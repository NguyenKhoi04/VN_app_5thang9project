// backend/translator.js
// Tự động dịch các cột *_en (tieu_de_en, ten_ky_nang_en, cau_en, mo_ta_en, ...) sang ngôn ngữ app
// - Client gửi header `x-lang` (hoặc ?lang=) : vi | en | ko | zh-CN | ja | fr | de | ru | es
// - Kết quả dịch được cache (RAM + bảng MySQL `ban_dich_cache`) nên mỗi câu chỉ dịch 1 lần.
// - Nếu có GOOGLE_TRANSLATE_API_KEY thì dùng Google Cloud Translation, không thì dùng endpoint gtx miễn phí.
const crypto = require('crypto');
const db = require('./config/db');

const SUPPORTED = new Set(['ko', 'zh-CN', 'ja', 'fr', 'de', 'ru', 'es']);
const SUFFIX = { 'zh-CN': 'zh_cn' };
const memory = new Map(); // `${lang}|${hash}` -> dịch
let tableReady = null;

const hash = (s) => crypto.createHash('md5').update(s).digest('hex');

function ensureTable() {
  if (!tableReady) {
    tableReady = db
      .query(
        `CREATE TABLE IF NOT EXISTS ban_dich_cache (
          lang VARCHAR(8) NOT NULL,
          hash CHAR(32) NOT NULL,
          nguon TEXT NOT NULL,
          dich TEXT NOT NULL,
          PRIMARY KEY (lang, hash)
        ) CHARACTER SET utf8mb4`
      )
      .catch((e) => console.warn('ban_dich_cache:', e.message));
  }
  return tableReady;
}

// Tự nạp ../.env (không cần cài dotenv)
// .env.local (được git bỏ qua) dùng để chứa khóa bí mật như GEMINI_API_KEY
['.env.local', '.env'].forEach((name) => {
  try {
    require('fs')
      .readFileSync(require('path').join(__dirname, '..', name), 'utf8')
      .split(/\r?\n/)
      .forEach((line) => {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      });
  } catch (e) {
    /* không có file */
  }
});

const LANG_NAMES = { ko: 'Korean', 'zh-CN': 'Simplified Chinese', ja: 'Japanese', fr: 'French', de: 'German', ru: 'Russian', es: 'Spanish' };

// Dịch 1 lô chuỗi bằng Gemini, trả về mảng cùng độ dài hoặc null nếu lỗi
async function callGemini(texts, lang) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  `Translate each English string in this JSON array into ${LANG_NAMES[lang]}. ` +
                  'Keep any Vietnamese words, numbers, punctuation and placeholders like ___ unchanged. ' +
                  'Return ONLY a JSON array of strings with exactly the same length and order.\n' +
                  JSON.stringify(texts),
              },
            ],
          },
        ],
        generationConfig: { responseMimeType: 'application/json', temperature: 0, thinkingConfig: { thinkingBudget: 0 } },
      }),
      signal: ctrl.signal,
    });
    const j = await r.json();
    const arr = JSON.parse(j?.candidates?.[0]?.content?.parts?.[0]?.text || 'null');
    return Array.isArray(arr) && arr.length === texts.length ? arr : null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function callTranslate(text, lang) {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    if (key) {
      const r = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source: 'en', target: lang, format: 'text' }),
        signal: ctrl.signal,
      });
      const j = await r.json();
      return j?.data?.translations?.[0]?.translatedText || null;
    }
    const url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t' +
      `&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text)}`;
    const r = await fetch(url, { signal: ctrl.signal });
    const j = await r.json();
    return (j[0] || []).map((p) => p[0]).join('') || null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function translateTexts(texts, lang) {
  const out = {};
  if (!SUPPORTED.has(lang)) {
    texts.forEach((t) => (out[t] = t));
    return out;
  }
  await ensureTable();
  const unique = [...new Set(texts.filter((t) => typeof t === 'string' && t.trim() !== ''))];
  const missing = [];

  for (const t of unique) {
    const v = memory.get(`${lang}|${hash(t)}`);
    if (v) out[t] = v;
    else missing.push(t);
  }

  if (missing.length) {
    try {
      const hashes = missing.map(hash);
      const [rows] = await db.query('SELECT hash, dich FROM ban_dich_cache WHERE lang = ? AND hash IN (?)', [lang, hashes]);
      const found = new Map(rows.map((r) => [r.hash, r.dich]));
      for (const t of [...missing]) {
        const v = found.get(hash(t));
        if (v) {
          out[t] = v;
          memory.set(`${lang}|${hash(t)}`, v);
          missing.splice(missing.indexOf(t), 1);
        }
      }
    } catch (e) {
      /* bỏ qua lỗi cache DB */
    }
  }

  // Ưu tiên Gemini (Google AI Studio) dịch theo lô, câu nào lỗi thì rơi xuống gtx bên dưới
  if (process.env.GEMINI_API_KEY) {
    for (let i = 0; i < missing.length; i += 40) {
      const batch = missing.slice(i, i + 40);
      const result = await callGemini(batch, lang);
      if (!result) continue;
      batch.forEach((t, j) => {
        const dich = result[j];
        if (typeof dich === 'string' && dich.trim()) {
          out[t] = dich;
          memory.set(`${lang}|${hash(t)}`, dich);
          db.query('INSERT IGNORE INTO ban_dich_cache (lang, hash, nguon, dich) VALUES (?,?,?,?)', [lang, hash(t), t, dich]).catch(() => {});
        }
      });
    }
  }
  for (let k = missing.length - 1; k >= 0; k--) if (out[missing[k]]) missing.splice(k, 1);

  // Dịch phần còn thiếu (song song tối đa 8)
  let idx = 0;
  const worker = async () => {
    while (idx < missing.length) {
      const t = missing[idx++];
      const dich = await callTranslate(t, lang);
      if (dich) {
        out[t] = dich;
        memory.set(`${lang}|${hash(t)}`, dich);
        db.query('INSERT IGNORE INTO ban_dich_cache (lang, hash, nguon, dich) VALUES (?,?,?,?)', [lang, hash(t), t, dich]).catch(() => {});
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(8, missing.length) }, worker));

  unique.forEach((t) => {
    if (!out[t]) out[t] = t;
  });
  return out;
}

const isEnKey = (k) => /_en$/.test(k);

function collect(node, set) {
  if (Array.isArray(node)) return node.forEach((n) => collect(n, set));
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === 'string') {
        if (isEnKey(k) && v.length <= 1500) set.add(v);
      } else collect(v, set);
    }
  }
}

function apply(node, map, lang) {
  if (Array.isArray(node)) return node.map((n) => apply(n, map, lang));
  if (node && typeof node === 'object' && !(node instanceof Date) && !Buffer.isBuffer(node)) {
    const res = {};
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === 'string' && isEnKey(k)) {
        const translated = map[v] || v;
        res[k] = translated; // ghi đè *_en để các màn hình cũ tự đổi ngôn ngữ
        res[`${k.replace(/_en$/, '')}_${SUFFIX[lang] || lang}`] = translated;
      } else res[k] = apply(v, map, lang);
    }
    return res;
  }
  return node;
}

// Middleware: bọc res.json để dịch mọi cột *_en trong kết quả theo header x-lang
function localizeResponse(req, res, next) {
  const lang = req.headers['x-lang'] || req.query.lang;
  if (!SUPPORTED.has(lang)) return next();
  const original = res.json.bind(res);
  res.json = (body) => {
    const set = new Set();
    collect(body, set);
    if (!set.size) return original(body);
    translateTexts([...set], lang)
      .then((map) => original(apply(body, map, lang)))
      .catch(() => original(body));
    return res;
  };
  next();
}

// POST /api/translate  { texts: string[], lang }  -> { map: { "english": "dịch" } }
async function translateRoute(req, res) {
  const { texts, lang } = req.body || {};
  if (!Array.isArray(texts)) return res.status(400).json({ success: false, message: 'texts phải là mảng' });
  const map = await translateTexts(texts.slice(0, 200).map(String), lang);
  res.json({ success: true, map });
}

module.exports = { localizeResponse, translateRoute, translateTexts };

