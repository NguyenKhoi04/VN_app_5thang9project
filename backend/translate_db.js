// backend/translate_db.js
// Dịch sẵn (pre-translate) toàn bộ các cột tiếng Anh trong CSDL (tên cột kết thúc bằng _en:
// tieu_de_en, cau_en, mo_ta_en, ten_ky_nang_en, nghia_en, ten_bai_en, ten_phan_en, ...)
// sang các ngôn ngữ hỗ trợ và lưu vào bảng ban_dich_tu_dong.
// Sau khi chạy, app hiển thị bản dịch ngay lập tức mà không phải chờ dịch lần đầu.
//
// Cách chạy:   node translate_db.js              (tất cả ngôn ngữ)
//              node translate_db.js ko ja        (chỉ một số ngôn ngữ)
const pool = require('./db');
const { translateTexts, SUPPORTED_LANGS } = require('./translate');

const BATCH = 50;

// Lấy chuỗi tiếng Anh từ giá trị cột (kể cả JSON lồng nhau có khoá *_en / *En / en)
function collectStrings(value, out, isEnglishContext) {
  if (value == null) return;
  if (typeof value === 'string') {
    const text = value.trim();
    if (!text) return;
    if (isEnglishContext && /[A-Za-z]{2,}/.test(text)) {
      out.add(text);
      return;
    }
    if ((text.startsWith('{') || text.startsWith('[')) && text.length > 1) {
      try {
        collectStrings(JSON.parse(text), out, false);
      } catch (_) {
        /* không phải JSON */
      }
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v) => collectStrings(v, out, isEnglishContext));
    return;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, v]) => {
      const english = /(_en|En)$/.test(key) || key === 'en' || key === 'english';
      collectStrings(v, out, english);
    });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const targets = (args.length ? args : Array.from(SUPPORTED_LANGS)).filter(
    (l) => SUPPORTED_LANGS.has(l) && l !== 'en' && l !== 'vi',
  );

  const [[{ db }]] = await pool.query('SELECT DATABASE() AS db');
  const [columns] = await pool.query(
    `SELECT TABLE_NAME AS t, COLUMN_NAME AS c, DATA_TYPE AS type
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME <> 'ban_dich_tu_dong'
       AND DATA_TYPE IN ('varchar','char','text','tinytext','mediumtext','longtext','json')`,
    [db],
  );

  const texts = new Set();
  for (const { t, c, type } of columns) {
    const englishColumn = /_en$/i.test(c);
    const jsonLike = type === 'json' || /noi_dung|du_lieu|bai_kiem_tra|lua_chon|dap_an/i.test(c);
    if (!englishColumn && !jsonLike) continue;
    const [rows] = await pool.query('SELECT ?? AS v FROM ?? WHERE ?? IS NOT NULL', [c, t, c]);
    const before = texts.size;
    rows.forEach((r) => collectStrings(r.v, texts, englishColumn));
    if (texts.size > before) console.log(`• ${t}.${c}: +${texts.size - before}`);
  }

  const all = Array.from(texts);
  console.log(`\nTổng cộng ${all.length} câu tiếng Anh. Dịch sang: ${targets.join(', ')}`);

  for (const lang of targets) {
    let ok = 0;
    for (let i = 0; i < all.length; i += BATCH) {
      const chunk = all.slice(i, i + BATCH);
      const result = await translateTexts(chunk, lang, 'en');
      ok += result.filter((r) => typeof r === 'string').length;
      process.stdout.write(`\r  ${lang}: ${Math.min(i + BATCH, all.length)}/${all.length}`);
    }
    console.log(`\r  ✅ ${lang}: ${ok}/${all.length} câu đã có bản dịch`);
  }

  await pool.end();
}

main().catch(async (err) => {
  console.error('❌ Lỗi:', err);
  await pool.end().catch(() => {});
  process.exit(1);
});

