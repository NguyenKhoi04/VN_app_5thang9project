// backend/translate.js
// API dịch tự động văn bản (tiếng Anh → ngôn ngữ người học chọn) có cache trong MySQL.
//   POST /api/translate   body: { source?: 'en', target: 'ko', texts: string[] }
//   → { target, translations: (string|null)[] }   (cùng thứ tự với texts, null = dịch lỗi)
//
// Dịch bằng Google Cloud Translation API v2 nếu có biến môi trường GOOGLE_TRANSLATE_API_KEY,
// nếu không sẽ dùng endpoint công khai translate.googleapis.com (client=gtx).
// Kết quả được lưu vào bảng ban_dich_tu_dong để lần sau trả về ngay, không cần gọi dịch lại.
const express = require('express');
const crypto = require('crypto');
const pool = require('./db');

const router = express.Router();

const SUPPORTED_LANGS = new Set(['vi', 'en', 'ko', 'zh-CN', 'ja', 'fr', 'de', 'ru', 'es']);
const MAX_TEXTS = 100;
const MAX_TEXT_LENGTH = 5000;
const CONCURRENCY = 4;

const memoryCache = new Map(); // `${source}|${target}|${hash}` → bản dịch

const hashText = (text) => crypto.createHash('sha256').update(text, 'utf8').digest('hex');
const cacheKey = (source, target, hash) => `${source}|${target}|${hash}`;

const tableReady = pool
  .query(
    `CREATE TABLE IF NOT EXISTS ban_dich_tu_dong (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      ngon_ngu_nguon VARCHAR(10) NOT NULL DEFAULT 'en',
      ngon_ngu_dich VARCHAR(10) NOT NULL,
      ma_bam CHAR(64) NOT NULL,
      van_ban_goc TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
      ban_dich TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
      ngay_tao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_ban_dich (ngon_ngu_nguon, ngon_ngu_dich, ma_bam)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  )
  .then(() => true)
  .catch((err) => {
    console.warn('⚠️ Không tạo được bảng ban_dich_tu_dong (chỉ cache trong RAM):', err.message);
    return false;
  });

async function translateWithCloudApi(texts, source, target, apiKey) {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: texts, source, target, format: 'text' }),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!res.ok) throw new Error(`Cloud Translation HTTP ${res.status}`);
  const json = await res.json();
  return (json?.data?.translations || []).map((t) => t?.translatedText ?? null);
}

async function translateOnePublic(text, source, target) {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t' +
    `&sl=${encodeURIComponent(source)}&tl=${encodeURIComponent(target)}&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Translate HTTP ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json?.[0])) return null;
  return json[0].map((segment) => (Array.isArray(segment) ? segment[0] || '' : '')).join('');
}

async function translateWithPublicApi(texts, source, target) {
  const results = new Array(texts.length).fill(null);
  let index = 0;
  const worker = async () => {
    while (index < texts.length) {
      const i = index++;
      try {
        results[i] = await translateOnePublic(texts[i], source, target);
      } catch (err) {
        console.warn(`⚠️ Dịch lỗi (${target}):`, err.message);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, texts.length) }, worker));
  return results;
}

async function machineTranslate(texts, source, target) {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (apiKey) {
    try {
      return await translateWithCloudApi(texts, source, target, apiKey);
    } catch (err) {
      console.warn('⚠️ Cloud Translation lỗi, chuyển sang endpoint công khai:', err.message);
    }
  }
  return translateWithPublicApi(texts, source, target);
}

/**
 * Dịch danh sách văn bản (có cache RAM + MySQL). Trả về mảng cùng thứ tự, null nếu dịch lỗi.
 */
async function translateTexts(texts, target, source = 'en') {
  if (source === target) return texts.slice();

  const results = new Array(texts.length).fill(null);
  const hashes = texts.map(hashText);
  const missing = new Map(); // hash → { text, indexes[] }

  texts.forEach((text, i) => {
    const hit = memoryCache.get(cacheKey(source, target, hashes[i]));
    if (hit !== undefined) {
      results[i] = hit;
    } else {
      const entry = missing.get(hashes[i]) || { text, indexes: [] };
      entry.indexes.push(i);
      missing.set(hashes[i], entry);
    }
  });

  if (missing.size === 0) return results;

  const dbReady = await tableReady;
  if (dbReady) {
    try {
      const [rows] = await pool.query(
        `SELECT ma_bam, ban_dich FROM ban_dich_tu_dong
         WHERE ngon_ngu_nguon = ? AND ngon_ngu_dich = ? AND ma_bam IN (?)`,
        [source, target, Array.from(missing.keys())],
      );
      rows.forEach((row) => {
        const entry = missing.get(row.ma_bam);
        if (!entry) return;
        memoryCache.set(cacheKey(source, target, row.ma_bam), row.ban_dich);
        entry.indexes.forEach((i) => {
          results[i] = row.ban_dich;
        });
        missing.delete(row.ma_bam);
      });
    } catch (err) {
      console.warn('⚠️ Đọc cache bản dịch lỗi:', err.message);
    }
  }

  if (missing.size === 0) return results;

  const pendingHashes = Array.from(missing.keys());
  const pendingTexts = pendingHashes.map((h) => missing.get(h).text);
  const translated = await machineTranslate(pendingTexts, source, target);

  const toInsert = [];
  pendingHashes.forEach((hash, k) => {
    const value = translated[k];
    if (typeof value !== 'string' || value.trim() === '') return;
    memoryCache.set(cacheKey(source, target, hash), value);
    missing.get(hash).indexes.forEach((i) => {
      results[i] = value;
    });
    toInsert.push([source, target, hash, pendingTexts[k], value]);
  });

  if (dbReady && toInsert.length > 0) {
    try {
      await pool.query(
        `INSERT INTO ban_dich_tu_dong (ngon_ngu_nguon, ngon_ngu_dich, ma_bam, van_ban_goc, ban_dich)
         VALUES ? ON DUPLICATE KEY UPDATE ban_dich = VALUES(ban_dich)`,
        [toInsert],
      );
    } catch (err) {
      console.warn('⚠️ Lưu cache bản dịch lỗi:', err.message);
    }
  }

  return results;
}

router.post('/', async (req, res) => {
  const source = req.body?.source || 'en';
  const target = req.body?.target;
  const texts = req.body?.texts;

  if (!SUPPORTED_LANGS.has(source) || !SUPPORTED_LANGS.has(target)) {
    return res.status(400).json({ error: 'Ngôn ngữ không được hỗ trợ' });
  }
  if (!Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: 'texts phải là mảng không rỗng' });
  }
  if (texts.length > MAX_TEXTS) {
    return res.status(400).json({ error: `Tối đa ${MAX_TEXTS} câu mỗi lần` });
  }

  const cleaned = texts.map((t) => (typeof t === 'string' ? t.slice(0, MAX_TEXT_LENGTH) : ''));

  try {
    const translations = await translateTexts(cleaned, target, source);
    res.json({
      source,
      target,
      translations: translations.map((value, i) => (cleaned[i] ? value : '')),
    });
  } catch (err) {
    console.error('❌ /api/translate lỗi:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.translateTexts = translateTexts;
module.exports.SUPPORTED_LANGS = SUPPORTED_LANGS;

