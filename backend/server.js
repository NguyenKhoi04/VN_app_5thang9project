// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware tự động nhận diện vùng miền từ Header 'x-region' hoặc query 'region'
app.use((req, res, next) => {
  req.region = req.headers['x-region'] || req.query.region || 'nam';
  next();
});

// 1. Cấu hình thông tin kết nối MySQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'luyenviet_chinhta_vn_1thang10',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 2. Kiểm tra kết nối Database
db.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL:', err.message);
    return;
  }
  console.log('✅ Đã kết nối MySQL (luyenviet_chinhta_vn_1thang10) thành công!');
  conn.release();
});

// 3. API kiểm tra server hoạt động
app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend đang hoạt động tốt!', database: 'luyenviet_chinhta_vn_1thang10' });
});

// ============================================================
// 4. NHÓM API: XÁC THỰC & NGƯỜI DÙNG (nguoi_dung, vai_tro)
// ============================================================

// Đăng nhập
app.post('/api/login', (req, res) => {
  const ten_dangnhap = req.body.ten_dangnhap || req.body.username;
  const mat_khau = req.body.mat_khau || req.body.password;

  const sql = `
    SELECT nd.*, vt.ma AS ma_vaitro, vt.ten_vn AS ten_vaitro
    FROM nguoi_dung nd
    LEFT JOIN nguoi_dung_vai_tro ndvt ON nd.id_nguoi_dung = ndvt.nguoi_dung_id
    LEFT JOIN vai_tro vt ON ndvt.vai_tro_id = vt.id
    WHERE nd.ten_dangnhap = ? AND nd.mat_khau = ?
    LIMIT 1
  `;

  db.query(sql, [ten_dangnhap, mat_khau], (err, results) => {
    if (err) {
      console.error('Lỗi SQL đăng nhập:', err);
      return res.status(500).json({ message: err.message || 'Lỗi truy vấn server' });
    }

    if (results.length > 0) {
      const u = results[0];
      return res.status(200).json({
        message: 'Đăng nhập thành công!',
        user: {
          id: u.id_nguoi_dung,
          id_nguoi_dung: u.id_nguoi_dung,
          ten_dangnhap: u.ten_dangnhap,
          ho_ten: u.ho_ten,
          email: u.email,
          so_dien_thoai: u.so_dien_thoai,
          anh_dai_dien: u.anh_dai_dien,
          ma_vaitro: u.ma_vaitro,
          ten_vaitro: u.ten_vaitro,
        },
      });
    } else {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
  });
});

// Đăng ký
app.post('/api/register', (req, res) => {
  const { ten_dangnhap, mat_khau, ho_ten, email, so_dien_thoai } = req.body;

  const sql = `
    INSERT INTO nguoi_dung (ten_dangnhap, mat_khau, ho_ten, email, so_dien_thoai, trang_thai, ngay_tao)
    VALUES (?, ?, ?, ?, ?, 1, NOW())
  `;
  db.query(sql, [ten_dangnhap, mat_khau, ho_ten || ten_dangnhap, email || null, so_dien_thoai || null], (err, results) => {
    if (err) {
      console.error('Lỗi SQL đăng ký:', err);
      return res.status(500).json({ message: err.message || 'Lỗi đăng ký' });
    }
    return res.status(200).json({ message: 'Đăng ký thành công!', id_nguoi_dung: results.insertId });
  });
});

// Lấy thông tin người dùng theo username hoặc họ tên
app.get('/api/user-info/:identifier', (req, res) => {
  const { identifier } = req.params;
  const sql = `
    SELECT id_nguoi_dung, id_nguoi_dung AS id, ten_dangnhap, ho_ten, email, so_dien_thoai, anh_dai_dien, trang_thai
    FROM nguoi_dung 
    WHERE ten_dangnhap = ? OR ho_ten = ? OR id_nguoi_dung = ?
    LIMIT 1
  `;
  db.query(sql, [identifier, identifier, identifier], (err, results) => {
    if (err) {
      console.error('Lỗi SQL user-info:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }
    return res.json(results[0]);
  });
});

// Danh sách vai trò (vai_tro)
app.get('/api/roles', (req, res) => {
  const sql = 'SELECT id, ma, ten_vn, ten_en, icon FROM vai_tro ORDER BY id ASC';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Lưu vai trò được chọn của người dùng
app.post('/api/user-role', (req, res) => {
  const { nguoi_dung_id, vai_tro_id } = req.body;
  const sql = `
    INSERT INTO nguoi_dung_vai_tro (nguoi_dung_id, vai_tro_id, ngay_chon)
    VALUES (?, ?, NOW())
    ON DUPLICATE KEY UPDATE vai_tro_id = VALUES(vai_tro_id), ngay_chon = NOW()
  `;
  db.query(sql, [nguoi_dung_id, vai_tro_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Cập nhật vai trò thành công!' });
  });
});

// ============================================================
// 5. NHÓM API: CHƯƠNG TRÌNH & KỸ NĂNG TIỂU HỌC
// (chuong_trinh, lop_hoc, ky_nang)
// ============================================================

// 9. API lấy tên lớp trong bảng chuong_trinh
app.get('/api/classes', (req, res) => {
  // Dùng DISTINCT để tránh lặp lại các dòng có cùng lớp (1, 2, 3)
  const sql = 'SELECT DISTINCT lop FROM chuong_trinh WHERE lop IN (1, 2, 3) ORDER BY lop ASC';

  db.query(sql, (err, results) => {
    if (err || !results || results.length === 0) {
      return res.json([{ lop: 1 }, { lop: 2 }, { lop: 3 }]);
    }
    res.json(results);
  });
});

// 10. API lấy tên chương trình dựa trên lớp
app.get('/api/program-name', (req, res) => {
  const lop = req.query.lop;
  const lopNum = parseInt(String(lop || '1').replace(/\D/g, ''), 10) || 1;

  const sql = "SELECT ten_chuong_trinh FROM chuong_trinh WHERE lop = ? AND (doi_tuong = 'hoc_sinh_tieu_hoc' OR doi_tuong IS NULL) LIMIT 1";

  db.query(sql, [lopNum], (err, results) => {
    if (err || !results || results.length === 0) {
      return res.json([{ ten_chuong_trinh: `Tiếng Việt lớp ${lopNum} - Kết nối tri thức với cuộc sống` }]);
    }
    res.json(results);
  });
});

// 11. API lấy danh sách kỹ năng trong kỹ năng được nối với tên lớp trong bảng chương trình
// API lấy danh sách kỹ năng theo lớp
app.get('/api/skills', (req, res) => {
  const { lop } = req.query;

  let sql = `
    SELECT 
      ky_nang.id_ky_nang,
      ky_nang.ma_ky_nang,
      ky_nang.ten_ky_nang,
      ky_nang.mo_ta,
      ky_nang.icon,
      ky_nang.lop,
      ky_nang.url_link,
      chuong_trinh.ten_chuong_trinh
    FROM ky_nang
    LEFT JOIN chuong_trinh ON ky_nang.lop = chuong_trinh.lop AND chuong_trinh.doi_tuong = 'hoc_sinh_tieu_hoc'
  `;
  const params = [];

  if (lop) {
    const lopNum = parseInt(String(lop).replace(/\D/g, ''), 10) || 1;
    sql += ` WHERE ky_nang.lop = ?`;
    params.push(lopNum);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi SQL:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// API lớp nào theo kỹ năng lớp đó
app.get('/api/skills-by-class', (req, res) => {
  const { lop } = req.query;
  const lopNum = parseInt(String(lop || '1').replace(/\D/g, ''), 10) || 1;
  const sql = `
    SELECT 
      ky_nang.id_ky_nang,
      ky_nang.ma_ky_nang,
      ky_nang.ten_ky_nang,
      ky_nang.mo_ta,
      ky_nang.icon,
      ky_nang.lop,
      ky_nang.url_link,
      chuong_trinh.ten_chuong_trinh
    FROM ky_nang
    LEFT JOIN chuong_trinh ON ky_nang.lop = chuong_trinh.lop AND chuong_trinh.doi_tuong = 'hoc_sinh_tieu_hoc'
    WHERE ky_nang.lop = ?
    ORDER BY ky_nang.id_ky_nang ASC
  `;
  db.query(sql, [lopNum], (err, results) => {
    if (err) {
      console.error('Lỗi SQL:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// API lấy danh sách người dùng
app.get('/api/data', (req, res) => {
  const sql = 'SELECT id_nguoi_dung AS id, ten_dangnhap FROM nguoi_dung';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ============================================================
// 6. NHÓM API: LUYỆN CHÍNH TẢ HỌC SINH
// (bai_chinh_ta_hs, ket_qua_chinh_ta_hs)
// ============================================================

// Lấy danh sách hoặc chi tiết đề bài chính tả theo khối lớp và tuần
app.get('/api/chinh-ta-hs', (req, res) => {
  const { lop_id, tuan_so, id } = req.query;
  let sql = `
    SELECT 
      id,
      lop_id,
      tuan_so,
      tieu_de,
      de_bai_goc,
      file_audio_mau,
      huong_dan,
      thu_tu
    FROM bai_chinh_ta_hs
    WHERE 1=1
  `;
  const params = [];

  if (id) {
    sql += ` AND id = ?`;
    params.push(id);
  }
  if (lop_id) {
    sql += ` AND lop_id = ?`;
    params.push(lop_id);
  }
  if (tuan_so) {
    sql += ` AND tuan_so = ?`;
    params.push(tuan_so);
  }
  sql += ` ORDER BY thu_tu ASC, id ASC`;

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Lấy 1 bài chính tả theo ID
app.get('/api/chinh-ta-hs/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM bai_chinh_ta_hs WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài chính tả' });
    }
    res.json(results[0]);
  });
});

// Nộp và lưu kết quả bài làm chính tả của học sinh
app.post('/api/ket-qua-chinh-ta-hs', (req, res) => {
  const {
    nguoi_dung_id,
    bai_chinh_ta_id,
    lop_id,
    van_ban_ocr,
    duong_dan_anh_goc,
    duong_dan_anh_khoanh_loi,
    tong_tu_sai = 0,
    chi_tiet_loi = null,
    diem_so = 10,
  } = req.body;

  const sql = `
    INSERT INTO ket_qua_chinh_ta_hs (
      nguoi_dung_id,
      bai_chinh_ta_id,
      lop_id,
      van_ban_ocr,
      duong_dan_anh_goc,
      duong_dan_anh_khoanh_loi,
      tong_tu_sai,
      chi_tiet_loi,
      diem_so,
      ngay_nop
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const chiTietLoiStr = chi_tiet_loi ? (typeof chi_tiet_loi === 'string' ? chi_tiet_loi : JSON.stringify(chi_tiet_loi)) : null;

  db.query(
    sql,
    [
      nguoi_dung_id,
      bai_chinh_ta_id || null,
      lop_id || 1,
      van_ban_ocr || '',
      duong_dan_anh_goc || null,
      duong_dan_anh_khoanh_loi || null,
      tong_tu_sai,
      chiTietLoiStr,
      diem_so,
    ],
    (err, results) => {
      if (err) {
        console.error('Lỗi lưu kết quả chính tả:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: 'Lưu kết quả bài chính tả thành công!',
        id: results.insertId,
      });
    }
  );
});

// Lấy lịch sử làm bài chính tả
app.get('/api/ket-qua-chinh-ta-hs', (req, res) => {
  const { nguoi_dung_id, lop_id } = req.query;
  let sql = `
    SELECT 
      kq.*,
      bct.tieu_de,
      bct.tuan_so
    FROM ket_qua_chinh_ta_hs kq
    LEFT JOIN bai_chinh_ta_hs bct ON kq.bai_chinh_ta_id = bct.id
    WHERE 1=1
  `;
  const params = [];
  if (nguoi_dung_id) {
    sql += ` AND kq.nguoi_dung_id = ?`;
    params.push(nguoi_dung_id);
  }
  if (lop_id) {
    sql += ` AND kq.lop_id = ?`;
    params.push(lop_id);
  }
  sql += ` ORDER BY kq.ngay_nop DESC`;

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ============================================================
// 7. NHÓM API: LUYỆN ĐỌC TIỂU HỌC (LỚP 1, 2, 3)
// (bai_doc, doan_van, tu_kho, cau_hoi_bai_doc, am_thanh_bai_doc, chu_de)
// ============================================================

// Danh sách chủ đề
app.get('/api/chu-de', (req, res) => {
  const { lop_id } = req.query;
  let sql = 'SELECT id, lop_id, so_chu_de, ten_chu_de, hinh_anh, thu_tu FROM chu_de';
  const params = [];
  if (lop_id) {
    sql += ' WHERE lop_id = ?';
    params.push(lop_id);
  }
  sql += ' ORDER BY thu_tu ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Danh sách bài đọc
app.get('/api/bai-doc', (req, res) => {
  const { lop_id, tuan_so, bai_so, chu_de_id } = req.query;
  let sql = `
    SELECT 
      bd.id,
      bd.lop_id,
      bd.chu_de_id,
      bd.tuan_so,
      bd.bai_so,
      bd.ten_bai,
      bd.hinh_anh_bai,
      bd.tac_gia,
      bd.noi_dung_day_du,
      bd.thu_tu,
      cd.ten_chu_de
    FROM bai_doc bd
    LEFT JOIN chu_de cd ON bd.chu_de_id = cd.id
    WHERE 1=1
  `;
  const params = [];

  if (lop_id) {
    sql += ` AND bd.lop_id = ?`;
    params.push(lop_id);
  }
  if (tuan_so) {
    sql += ` AND bd.tuan_so = ?`;
    params.push(tuan_so);
  }
  if (bai_so) {
    sql += ` AND bd.bai_so = ?`;
    params.push(bai_so);
  }
  if (chu_de_id) {
    sql += ` AND bd.chu_de_id = ?`;
    params.push(chu_de_id);
  }
  sql += ` ORDER BY bd.thu_tu ASC, bd.id ASC`;

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Chi tiết 1 bài đọc theo ID
app.get('/api/bai-doc/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT bd.*, cd.ten_chu_de 
    FROM bai_doc bd
    LEFT JOIN chu_de cd ON bd.chu_de_id = cd.id
    WHERE bd.id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy bài đọc' });
    res.json(results[0]);
  });
});

// Danh sách các đoạn văn của bài đọc
app.get('/api/doan-van', (req, res) => {
  const { bai_doc_id } = req.query;
  let sql = 'SELECT id, bai_doc_id, so_doan, noi_dung, ghi_chu FROM doan_van';
  const params = [];
  if (bai_doc_id) {
    sql += ' WHERE bai_doc_id = ?';
    params.push(bai_doc_id);
  }
  sql += ' ORDER BY so_doan ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Danh sách từ khó của bài đọc (tự động quy đổi từ ngữ theo vùng miền x-region)
app.get('/api/tu-kho', (req, res) => {
  const { bai_doc_id } = req.query;
  const currentRegion = req.headers['x-region'] || req.query.region || req.region || 'nam';

  let sql = 'SELECT id, bai_doc_id, tu, giai_thich, am_thanh, ma_key, thu_tu FROM tu_kho';
  const params = [];
  if (bai_doc_id) {
    sql += ' WHERE bai_doc_id = ?';
    params.push(bai_doc_id);
  }
  sql += ' ORDER BY thu_tu ASC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Tra cứu đối chiếu với bảng tu_vung_vung_mien
    db.query('SELECT * FROM tu_vung_vung_mien', (dictErr, dict) => {
      if (dictErr || !dict || dict.length === 0) {
        return res.json(results);
      }

      const formatted = results.map((row) => {
        const cleanTu = (row.tu || '').trim().toLowerCase();
        const matched = dict.find(
          (d) =>
            d.tu_mien_bac.toLowerCase() === cleanTu ||
            d.tu_mien_trung.toLowerCase() === cleanTu ||
            d.tu_mien_nam.toLowerCase() === cleanTu
        );

        if (matched) {
          let tu_hien_thi = matched.tu_mien_nam;
          let chu_thich_vung_mien = '';

          if (currentRegion === 'bac') {
            tu_hien_thi = matched.tu_mien_bac;
            chu_thich_vung_mien = `(Miền Trung: ${matched.tu_mien_trung} — Miền Nam: ${matched.tu_mien_nam})`;
          } else if (currentRegion === 'trung') {
            tu_hien_thi = matched.tu_mien_trung;
            chu_thich_vung_mien = `(Miền Bắc: ${matched.tu_mien_bac} — Miền Nam: ${matched.tu_mien_nam})`;
          } else {
            tu_hien_thi = matched.tu_mien_nam;
            chu_thich_vung_mien = `(Miền Bắc: ${matched.tu_mien_bac} — Miền Trung: ${matched.tu_mien_trung})`;
          }

          return {
            ...row,
            tu_goc: row.tu,
            tu: tu_hien_thi,
            tu_hien_thi,
            chu_thich_vung_mien,
            region: currentRegion,
          };
        }

        return row;
      });

      res.json(formatted);
    });
  });
});

// Danh sách câu hỏi đọc hiểu của bài đọc
app.get('/api/cau-hoi-bai-doc', (req, res) => {
  const { bai_doc_id } = req.query;
  let sql = 'SELECT id, bai_doc_id, so_cau, noi_dung_cau, dap_an, am_thanh_cau, am_thanh_dap, ma_key_cau, ma_key_dap FROM cau_hoi_bai_doc';
  const params = [];
  if (bai_doc_id) {
    sql += ' WHERE bai_doc_id = ?';
    params.push(bai_doc_id);
  }
  sql += ' ORDER BY so_cau ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// File âm thanh bài đọc (toàn bài hoặc từng đoạn)
app.get('/api/am-thanh-bai-doc', (req, res) => {
  const { bai_doc_id, loai } = req.query;
  let sql = 'SELECT id, bai_doc_id, doan_id, loai, ma_key, duong_dan FROM am_thanh_bai_doc WHERE 1=1';
  const params = [];
  if (bai_doc_id) {
    sql += ' AND bai_doc_id = ?';
    params.push(bai_doc_id);
  }
  if (loai) {
    sql += ' AND loai = ?';
    params.push(loai);
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ============================================================
// 8. NHÓM API: LỚP 1 PHẦN 1 (HỌC CHỮ CÁI, ÂM, VẦN)
// (tuan_hoc_lop1, bai_hoc_lop1_phan1, chu_am_van, am_thanh_chu_am)
// ============================================================

// Danh sách tuần học lớp 1
app.get('/api/tuan-hoc-lop-1', (req, res) => {
  const sql = 'SELECT id, so_tuan, ten_tuan, hinh_anh, thu_tu FROM tuan_hoc_lop1 ORDER BY so_tuan ASC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Danh sách bài học lớp 1 theo tuần
app.get('/api/baihoc-lop1', (req, res) => {
  const { tuan_id } = req.query;
  let sql = 'SELECT id, tuan_id, ten_bai_hoc, hinh_anh_bai, thu_tu FROM bai_hoc_lop1_phan1';
  const params = [];
  if (tuan_id) {
    sql += ' WHERE tuan_id = ?';
    params.push(tuan_id);
  }
  sql += ' ORDER BY thu_tu ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Danh sách chữ/âm/vần của bài học
app.get('/api/chu-am-van', (req, res) => {
  const { bai_hoc_id } = req.query;
  let sql = `
    SELECT id, bai_hoc_id, noi_dung, cach_doc, cach_doc_danh_van, kieu_hien_thi, hinh_minh_hoa, la_chu_cai, thanh_dieu, thu_tu
    FROM chu_am_van
  `;
  const params = [];
  if (bai_hoc_id) {
    sql += ' WHERE bai_hoc_id = ?';
    params.push(bai_hoc_id);
  }
  sql += ' ORDER BY thu_tu ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Âm thanh chữ/âm/vần
app.get('/api/am-thanh-chu-am', (req, res) => {
  const { chu_am_id } = req.query;
  let sql = 'SELECT id, chu_am_id, loai_am, ma_key, duong_dan, thu_tu FROM am_thanh_chu_am';
  const params = [];
  if (chu_am_id) {
    sql += ' WHERE chu_am_id = ?';
    params.push(chu_am_id);
  }
  sql += ' ORDER BY thu_tu ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ============================================================
// 9. NHÓM API: LUYỆN VIẾT CHỮ (bai_luyen_viet, chu_luyen_viet)
// ============================================================

// Lấy danh sách bài luyện viết theo lớp & tuần
app.get('/api/bai-luyen-viet', (req, res) => {
  const { lop_id, tuan_so } = req.query;
  let sql = 'SELECT id, lop_id, tuan_so, ten_bai, mo_ta, thu_tu FROM bai_luyen_viet WHERE 1=1';
  const params = [];
  if (lop_id) {
    sql += ' AND lop_id = ?';
    params.push(lop_id);
  }
  if (tuan_so) {
    sql += ' AND tuan_so = ?';
    params.push(tuan_so);
  }
  sql += ' ORDER BY thu_tu ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Lấy danh sách chữ cái tập viết theo bài luyện viết
app.get('/api/chu-luyen-viet', (req, res) => {
  const { bai_luyen_id } = req.query;
  let sql = 'SELECT id, bai_luyen_id, ma_key, nhan_hien_thi, duong_dan_video, thu_tu FROM chu_luyen_viet';
  const params = [];
  if (bai_luyen_id) {
    sql += ' WHERE bai_luyen_id = ?';
    params.push(bai_luyen_id);
  }
  sql += ' ORDER BY thu_tu ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ============================================================
// 10. NHÓM API: TIẾN TRÌNH HỌC TẬP (tien_trinh_hoc_sinh)
// ============================================================

// Lấy tiến trình của học sinh
app.get('/api/tien-trinh-hs', (req, res) => {
  const { nguoi_dung_id, lop_id } = req.query;
  let sql = 'SELECT * FROM tien_trinh_hoc_sinh WHERE nguoi_dung_id = ?';
  const params = [nguoi_dung_id];
  if (lop_id) {
    sql += ' AND lop_id = ?';
    params.push(lop_id);
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Cập nhật tiến trình của học sinh
app.post('/api/tien-trinh-hs', (req, res) => {
  const { nguoi_dung_id, lop_id, loai_bai, bai_doc_id, bai_lop1_p1_id, bai_luyen_id, trang_thai, che_do_hoc } = req.body;
  const sql = `
    INSERT INTO tien_trinh_hoc_sinh (
      nguoi_dung_id, lop_id, loai_bai, bai_doc_id, bai_lop1_p1_id, bai_luyen_id, trang_thai, che_do_hoc, ngay_cap_nhat
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE 
      trang_thai = VALUES(trang_thai),
      che_do_hoc = VALUES(che_do_hoc),
      ngay_cap_nhat = NOW()
  `;
  db.query(sql, [nguoi_dung_id, lop_id, loai_bai, bai_doc_id || null, bai_lop1_p1_id || null, bai_luyen_id || null, trang_thai || 'hoan_thanh', che_do_hoc || null], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lưu tiến trình học tập thành công!' });
  });
});

// ============================================================
// 11. NHÓM API: NGƯỜI NƯỚC NGOÀI (bai_hoc_nn, tu_vung, cau_hoi_nn, ...)
// ============================================================

app.get('/api/bai-hoc-nn', (req, res) => {
  const sql = 'SELECT * FROM bai_hoc_nn ORDER BY thu_tu ASC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/phan-bai-nn', (req, res) => {
  const { bai_hoc_id } = req.query;
  let sql = 'SELECT * FROM phan_bai_nn';
  const params = [];
  if (bai_hoc_id) {
    sql += ' WHERE bai_hoc_id = ?';
    params.push(bai_hoc_id);
  }
  sql += ' ORDER BY so_phan ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/tu-vung', (req, res) => {
  const { bai_hoc_id } = req.query;
  const currentRegion = req.headers['x-region'] || req.query.region || req.region || 'nam';

  let sql = 'SELECT * FROM tu_vung';
  const params = [];
  if (bai_hoc_id) {
    sql += ' WHERE bai_hoc_id = ?';
    params.push(bai_hoc_id);
  }
  sql += ' ORDER BY thu_tu ASC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query('SELECT * FROM tu_vung_vung_mien', (dictErr, dict) => {
      if (dictErr || !dict || dict.length === 0) {
        return res.json(results);
      }

      const formatted = results.map((row) => {
        const cleanTu = (row.tu_tv || '').trim().toLowerCase();
        const matched = dict.find(
          (d) =>
            d.tu_mien_bac.toLowerCase() === cleanTu ||
            d.tu_mien_trung.toLowerCase() === cleanTu ||
            d.tu_mien_nam.toLowerCase() === cleanTu
        );

        if (matched) {
          let tu_hien_thi = matched.tu_mien_nam;
          let chu_thich_vung_mien = '';

          if (currentRegion === 'bac') {
            tu_hien_thi = matched.tu_mien_bac;
            chu_thich_vung_mien = `(Miền Trung: ${matched.tu_mien_trung} — Miền Nam: ${matched.tu_mien_nam})`;
          } else if (currentRegion === 'trung') {
            tu_hien_thi = matched.tu_mien_trung;
            chu_thich_vung_mien = `(Miền Bắc: ${matched.tu_mien_bac} — Miền Nam: ${matched.tu_mien_nam})`;
          } else {
            tu_hien_thi = matched.tu_mien_nam;
            chu_thich_vung_mien = `(Miền Bắc: ${matched.tu_mien_bac} — Miền Trung: ${matched.tu_mien_trung})`;
          }

          return {
            ...row,
            tu_tv_goc: row.tu_tv,
            tu_tv: tu_hien_thi,
            tu_hien_thi,
            chu_thich_vung_mien,
            region: currentRegion,
          };
        }

        return row;
      });

      res.json(formatted);
    });
  });
});

app.get('/api/cau-hoi-nn', (req, res) => {
  const { bai_hoc_id } = req.query;
  let sql = 'SELECT * FROM cau_hoi_nn';
  const params = [];
  if (bai_hoc_id) {
    sql += ' WHERE bai_hoc_id = ?';
    params.push(bai_hoc_id);
  }
  sql += ' ORDER BY thu_tu ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ============================================================
// NHÓM API: TỪ VỰNG VÙNG MIỀN (tu_vung_vung_mien.sql)
// ============================================================

// Tự động khởi tạo bảng tu_vung_vung_mien và chèn dữ liệu mẫu nếu chưa có
const initTuVungVungMien = () => {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS tu_vung_vung_mien (
      id int unsigned NOT NULL AUTO_INCREMENT,
      danh_muc varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
      tu_mien_bac varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
      tu_mien_trung varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
      tu_mien_nam varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
      tu_dong_nghia_khac varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      ghi_chu_ngu_canh varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      PRIMARY KEY (id),
      KEY idx_mien_bac (tu_mien_bac),
      KEY idx_mien_trung (tu_mien_trung),
      KEY idx_mien_nam (tu_mien_nam)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  db.query(createTableSql, (err) => {
    if (err) {
      console.warn('⚠️ Kiểm tra bảng tu_vung_vung_mien:', err.message);
      return;
    }

    // Kiểm tra số lượng bản ghi
    db.query('SELECT COUNT(*) AS total FROM tu_vung_vung_mien', (errCount, results) => {
      if (errCount) return;
      if (results[0]?.total === 0) {
        console.log('🌱 Đang chèn dữ liệu từ điển 3 miền từ tu_vung_vung_mien.sql...');
        const sampleData = [
          ['Gia đình', 'Bố', 'Ba', 'Ba', 'Tía, Thầy', 'Cách gọi người cha trong gia đình'],
          ['Gia đình', 'Mẹ', 'Mạ', 'Má', 'U, Bầm, Đẻ', 'Cách gọi người mẹ trong gia đình'],
          ['Gia đình', 'Anh cả', 'Anh cả', 'Anh hai', null, 'Con trai đầu trong gia đình'],
          ['Gia đình', 'Chị cả', 'Chị cả', 'Chị hai', null, 'Con gái đầu trong gia đình'],
          ['Gia đình', 'Ông nội', 'Ông nội', 'Ông nội', 'Ông cố (đời trên)', 'Cha của bố/ba'],
          ['Gia đình', 'Trẻ con', 'Con nít', 'Con nít', 'Trẻ nhỏ', 'Chỉ thiếu nhi, em nhỏ'],
          ['Ẩm thực', 'Quả dứa', 'Quả thơm', 'Trái khóm', 'Trái thơm', 'Loại quả nhiệt đới nhiều mắt'],
          ['Ẩm thực', 'Quả na', 'Quả mãng cầu', 'Trái mãng cầu ta', 'Mãng cầu dai', 'Phân biệt với mãng cầu xiêm'],
          ['Ẩm thực', 'Củ sắn', 'Củ sắn', 'Củ khoai mì', null, 'Loại củ làm bột năng, luộc ăn'],
          ['Ẩm thực', 'Củ đậu', 'Củ sắn nước', 'Củ sắn', null, 'Củ vỏ nâu ruột trắng, ăn sống mát'],
          ['Ẩm thực', 'Ngô', 'Bắp', 'Bắp', null, 'Cây lương thực hạt vàng/trắng'],
          ['Ẩm thực', 'Lạc', 'Đậu phụng', 'Đậu phộng', null, 'Hạt dùng ép dầu, rang muối'],
          ['Ẩm thực', 'Vừng', 'Mè', 'Mè', null, 'Hạt nhỏ dùng làm muối vừng/muối mè'],
          ['Ẩm thực', 'Mỳ chính', 'Bột ngọt', 'Bột ngọt', null, 'Gia vị điều vị trong nấu ăn'],
          ['Ẩm thực', 'Nước chè', 'Nước chè', 'Nước trà', 'Trà đá', 'Thức uống nấu từ lá trà'],
          ['Ẩm thực', 'Quả roi', 'Quả đào lộn hột', 'Trái mận', null, 'Quả màu đỏ/hồng, mọng nước'],
          ['Ẩm thực', 'Quả mận', 'Quả mận Bắc', 'Trái mận Hà Nội', null, 'Quả vùng ôn đới phía Bắc'],
          ['Ẩm thực', 'Đỗ đen', 'Đậu đen', 'Đậu đen', null, 'Miền Bắc hay gọi các loại đậu là đỗ'],
          ['Ẩm thực', 'Thịt lợn', 'Thịt heo', 'Thịt heo', null, 'Thực phẩm phổ biến'],
          ['Đồ vật', 'Bát', 'Đọi', 'Chén', 'Cái chén', 'Dùng để ăn cơm hằng ngày'],
          ['Đồ vật', 'Bát tô', 'Tô', 'Tô', null, 'Bát cỡ lớn dùng đựng canh, bún, phở'],
          ['Đồ vật', 'Thìa', 'Muỗng', 'Muỗng', null, 'Dụng cụ xúc thức ăn'],
          ['Đồ vật', 'Cốc', 'Ly', 'Ly', null, 'Dụng cụ đựng nước uống'],
          ['Đồ vật', 'Ô', 'Dù', 'Dù', null, 'Vật dụng che nắng, che mưa'],
          ['Đồ vật', 'Chăn', 'Mền', 'Mền', null, 'Dùng để đắp khi ngủ'],
          ['Đồ vật', 'Cái chậu', 'Cái thau', 'Cái thau', null, 'Vật dụng đựng nước rửa mặt, giặt đồ'],
          ['Đồ vật', 'Túi bóng', 'Bì ni-lông', 'Bịch ni-lông', 'Túi ni-lông', 'Túi nhựa dùng đựng đồ'],
          ['Đồ vật', 'Giấy ăn', 'Khăn giấy', 'Khăn giấy', null, 'Giấy lau miệng trên bàn ăn'],
          ['Đồ vật', 'Xe máy', 'Xe máy', 'Xe gắn máy', 'Xe hon-đa', 'Phương tiện giao thông hai bánh'],
          ['Đồ vật', 'Ngõ', 'Kiệt', 'Hẻm', null, 'Đường nhỏ dẫn vào khu dân cư'],
          ['Động vật', 'Con lợn', 'Con heo', 'Con heo', null, 'Gia súc nuôi lấy thịt'],
          ['Động vật', 'Con ngan', 'Con vịt xiêm', 'Con vịt xiêm', null, 'Gia cầm họ vịt, mỏ có mào đỏ'],
          ['Động vật', 'Cá quả', 'Cá tràu', 'Cá lóc', 'Cá chuối', 'Loài cá nước ngọt phổ biến'],
          ['Động vật', 'Con gián', 'Con gián', 'Con gián', 'Con dán', 'Côn trùng trong nhà'],
          ['Tự nhiên', 'Mưa rào', 'Mưa dông', 'Mưa đám mây', 'Mưa bất chợt', 'Cơn mưa đến nhanh và tạnh nhanh'],
          ['Giao tiếp', 'Ngã', 'Té', 'Té', null, 'Bị mất thăng bằng và rơi xuống đất'],
          ['Giao tiếp', 'Ốm', 'Đau', 'Bệnh', 'Đau ốm', 'Trạng thái sức khỏe không tốt'],
          ['Giao tiếp', 'Bẩn', 'Dơ', 'Dơ', null, 'Không sạch sẽ'],
          ['Giao tiếp', 'Đắt', 'Mắc', 'Mắc', null, 'Giá cả cao'],
          ['Giao tiếp', 'Lười', 'Nhác', 'Làm biếng', null, 'Ngại làm việc, học tập'],
          ['Giao tiếp', 'Vào', 'Vô', 'Vô', null, 'Di chuyển từ ngoài vào trong'],
          ['Giao tiếp', 'Thế à', 'Rứa à', 'Vậy hả', 'Rứa hả', 'Câu cảm thán xác nhận thông tin'],
          ['Giao tiếp', 'Không sao', 'Không răng', 'Không sao đâu', 'Hổng sao', 'Trấn an người khác'],
          ['Giao tiếp', 'Cái gì', 'Cái chi', 'Cái gì', 'Cái giề', 'Từ để hỏi sự vật'],
          ['Giao tiếp', 'Ở đâu', 'Ở mô', 'Ở đâu', null, 'Từ để hỏi địa điểm'],
        ];

        const insertSql = `
          INSERT INTO tu_vung_vung_mien 
          (danh_muc, tu_mien_bac, tu_mien_trung, tu_mien_nam, tu_dong_nghia_khac, ghi_chu_ngu_canh)
          VALUES ?
        `;
        db.query(insertSql, [sampleData], (errInsert) => {
          if (errInsert) {
            console.warn('⚠️ Lỗi chèn dữ liệu mẫu tu_vung_vung_mien:', errInsert.message);
          } else {
            console.log('✅ Đã nạp thành công 33 cặp từ điển từ vựng 3 miền!');
          }
        });
      }
    });
  });
};

// Gọi khởi tạo bảng
initTuVungVungMien();

// 1. API lấy danh sách từ vựng 3 miền (có tự động chọn theo vùng miền đang chọn)
app.get('/api/tu-vung-vung-mien', (req, res) => {
  const currentRegion = req.headers['x-region'] || req.query.region || req.region || 'nam';
  const { danh_muc, q } = req.query;

  let sql = 'SELECT * FROM tu_vung_vung_mien WHERE 1=1';
  const params = [];

  if (danh_muc) {
    sql += ' AND danh_muc = ?';
    params.push(danh_muc);
  }

  if (q) {
    sql += ' AND (tu_mien_bac LIKE ? OR tu_mien_trung LIKE ? OR tu_mien_nam LIKE ?)';
    const searchPattern = `%${q}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  sql += ' ORDER BY danh_muc ASC, id ASC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Format kết quả tự động gắn trường từ theo vùng miền và câu chú thích UX
    const formatted = results.map((item) => {
      let tu_hien_thi = item.tu_mien_nam;
      let ghi_chu_so_sanh = '';

      if (currentRegion === 'bac') {
        tu_hien_thi = item.tu_mien_bac;
        ghi_chu_so_sanh = `(Miền Trung: ${item.tu_mien_trung} — Miền Nam: ${item.tu_mien_nam})`;
      } else if (currentRegion === 'trung') {
        tu_hien_thi = item.tu_mien_trung;
        ghi_chu_so_sanh = `(Miền Bắc: ${item.tu_mien_bac} — Miền Nam: ${item.tu_mien_nam})`;
      } else {
        tu_hien_thi = item.tu_mien_nam;
        ghi_chu_so_sanh = `(Miền Bắc: ${item.tu_mien_bac} — Miền Trung: ${item.tu_mien_trung})`;
      }

      return {
        ...item,
        region_applied: currentRegion,
        tu_hien_thi,
        ghi_chu_so_sanh,
      };
    });

    res.json(formatted);
  });
});

// 2. API lấy toàn bộ từ điển 3 miền (để client cache offline)
app.get('/api/tu-vung-vung-mien/all', (req, res) => {
  const sql = 'SELECT * FROM tu_vung_vung_mien ORDER BY danh_muc ASC, id ASC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. API tự động chuyển đổi văn bản / câu / từ theo vùng miền
app.post('/api/tu-vung-vung-mien/convert', (req, res) => {
  const currentRegion = req.headers['x-region'] || req.body.region || req.region || 'nam';
  const text = req.body.text || '';

  if (!text) {
    return res.status(400).json({ error: 'Vui lòng cung cấp văn bản cần chuyển đổi (field: text)' });
  }

  // Lấy toàn bộ từ điển để quét và chuyển đổi
  db.query('SELECT * FROM tu_vung_vung_mien', (err, dictionary) => {
    if (err) return res.status(500).json({ error: err.message });

    let convertedText = text;
    const replacements = [];

    dictionary.forEach((item) => {
      let targetWord = item.tu_mien_nam;
      let note = '';

      if (currentRegion === 'bac') {
        targetWord = item.tu_mien_bac;
        note = `(Miền Trung: ${item.tu_mien_trung} — Miền Nam: ${item.tu_mien_nam})`;
      } else if (currentRegion === 'trung') {
        targetWord = item.tu_mien_trung;
        note = `(Miền Bắc: ${item.tu_mien_bac} — Miền Nam: ${item.tu_mien_nam})`;
      } else {
        targetWord = item.tu_mien_nam;
        note = `(Miền Bắc: ${item.tu_mien_bac} — Miền Trung: ${item.tu_mien_trung})`;
      }

      const allVariants = [item.tu_mien_bac, item.tu_mien_trung, item.tu_mien_nam];
      allVariants.forEach((variant) => {
        if (variant && variant.toLowerCase() !== targetWord.toLowerCase()) {
          const regex = new RegExp(`\\b${variant}\\b`, 'gi');
          if (regex.test(convertedText)) {
            convertedText = convertedText.replace(regex, targetWord);
            replacements.push({
              tu_goc: variant,
              tu_chuyen_doi: targetWord,
              vung_mien: currentRegion,
              chu_thich_ux: `${targetWord} ${note}`,
            });
          }
        }
      });
    });

    res.json({
      original_text: text,
      converted_text: convertedText,
      region: currentRegion,
      replacements,
    });
  });
});

// 4. API lấy cấu hình giọng đọc TTS theo vùng miền
app.get('/api/tu-vung-vung-mien/voice-config', (req, res) => {
  const currentRegion = req.headers['x-region'] || req.query.region || req.region || 'nam';

  const voiceMap = {
    bac: {
      region: 'bac',
      region_name: 'Miền Bắc',
      voice_code: 'banmai',
      voice_name: 'Ban Mai (Nữ miền Bắc chuẩn)',
      speed: 1.0,
      description: 'Giọng đọc chuẩn Hà Nội thanh thoát, tự nhiên',
    },
    trung: {
      region: 'trung',
      region_name: 'Miền Trung',
      voice_code: 'myan',
      voice_name: 'Mỹ An (Nữ miền Trung)',
      speed: 1.0,
      description: 'Giọng đọc miền Trung (Huế - Đà Nẵng) truyền cảm, trầm ấm',
    },
    nam: {
      region: 'nam',
      region_name: 'Miền Nam',
      voice_code: 'lannhi',
      voice_name: 'Lan Nhi (Nữ miền Nam chuẩn)',
      speed: 1.0,
      description: 'Giọng đọc Sài Gòn ngọt ngào, gần gũi',
    },
  };

  const config = voiceMap[currentRegion] || voiceMap.nam;
  res.json(config);
});

// Khởi chạy server tại cổng 5000
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server backend đang chạy tại http://localhost:${PORT}`);
});
