// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    if (err) {
      console.error('Lỗi SQL:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 10. API lấy tên chương trình dựa trên lớp
app.get('/api/program-name', (req, res) => {
  const lop = req.query.lop;

  const sql = "SELECT ten_chuong_trinh FROM chuong_trinh WHERE lop = ? AND (doi_tuong = 'hoc_sinh_tieu_hoc' OR doi_tuong IS NULL) LIMIT 1";

  db.query(sql, [lop], (err, results) => {
    if (err) {
      console.error('Lỗi SQL:', err);
      return res.status(500).json({ error: err.message });
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
    sql += ` WHERE ky_nang.lop = ?`;
    params.push(lop);
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
  db.query(sql, [lop], (err, results) => {
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

// Danh sách từ khó của bài đọc
app.get('/api/tu-kho', (req, res) => {
  const { bai_doc_id } = req.query;
  let sql = 'SELECT id, bai_doc_id, tu, giai_thich, am_thanh, ma_key, thu_tu FROM tu_kho';
  const params = [];
  if (bai_doc_id) {
    sql += ' WHERE bai_doc_id = ?';
    params.push(bai_doc_id);
  }
  sql += ' ORDER BY thu_tu ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
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
  let sql = 'SELECT * FROM tu_vung';
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

// Khởi chạy server tại cổng 5000
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server backend đang chạy tại http://localhost:${PORT}`);
});
