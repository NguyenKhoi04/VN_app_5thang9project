const express = require('express');
const router = express.Router();
const db = require('./config/db'); // Đổi lại đường dẫn file kết nối mysql2/promise của bạn

// Chỉ cho phép 2 bảng hợp lệ (tránh SQL Injection)
const TABLE_MAP = {
  phat_am: 'baihoc_phatam_phan2',
  chu_de: 'baihoc_chude_phan3',
};

const getTableName = (loaiPhan) => TABLE_MAP[loaiPhan] || null;

// Parse JSON an toàn (mysql2 có thể trả string hoặc object tùy cấu hình)
const parseJSON = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

// Gom danh sách kỹ năng phẳng thành cây cha - con (parent_id)
const buildSkillTree = (rows) => {
  const map = new Map();
  const roots = [];

  rows.forEach((row) => {
    map.set(row.id, { ...row, children: [] });
  });

  map.forEach((item) => {
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id).children.push(item);
    } else {
      roots.push(item);
    }
  });

  return roots;
};

// Format dòng dữ liệu nội dung kỹ năng trả về cho App
const formatContentRow = (row) => ({
  ...row,
  noi_dung_chinh: parseJSON(row.noi_dung_chinh),
  noi_dung_phu: parseJSON(row.noi_dung_phu),
  bai_kiem_tra: parseJSON(row.bai_kiem_tra),
});

// =========================================================================
// 1. LẤY DANH MỤC KỸ NĂNG DẠNG CÂY (Màn hình "Chọn kỹ năng")
// GET /api/nn/ky-nang
// =========================================================================
router.get('/ky-nang', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, parent_id, ky_hieu, ma_ky_nang, ten_ky_nang_vn, ten_ky_nang_en, icon, thu_tu
       FROM ky_nang_nn
       WHERE trang_thai = 1
       ORDER BY COALESCE(parent_id, id), parent_id IS NOT NULL, thu_tu ASC`
    );

    res.json({
      success: true,
      data: buildSkillTree(rows),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 2. LẤY TOÀN BỘ NỘI DUNG KỸ NĂNG CỦA 1 BÀI HỌC
// Tự động tra loai_phan từ bai_hoc_nn để truy vấn baihoc_phatam_phan2 hoặc baihoc_chude_phan3
// GET /api/nn/bai-hoc/:baiHocId/ky-nang
// =========================================================================
router.get('/bai-hoc/:baiHocId/ky-nang', async (req, res) => {
  try {
    const { baiHocId } = req.params;

    const [[baiHoc]] = await db.query(
      `SELECT id, loai_phan, ma_bai, so_bai, ten_bai_vn, ten_bai_en, cap_do
       FROM bai_hoc_nn
       WHERE id = ? AND trang_thai = 1`,
      [baiHocId]
    );

    if (!baiHoc) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
    }

    const tableName = getTableName(baiHoc.loai_phan);
    if (!tableName) {
      return res.status(400).json({
        success: false,
        message: `Loại phần '${baiHoc.loai_phan}' không thuộc bảng phát âm hoặc chủ đề`,
      });
    }

    const [rows] = await db.query(
      `SELECT 
         kn.id, kn.parent_id, kn.ky_hieu, kn.ma_ky_nang,
         kn.ten_ky_nang_vn, kn.ten_ky_nang_en, kn.icon, kn.thu_tu AS thu_tu_ky_nang,
         ct.id AS noi_dung_id, ct.tieu_de_vn, ct.tieu_de_en,
         ct.noi_dung_chinh, ct.noi_dung_phu, ct.bai_kiem_tra, ct.am_thanh_mau
       FROM ky_nang_nn kn
       LEFT JOIN \`${tableName}\` ct
         ON ct.ky_nang_id = kn.id AND ct.bai_hoc_id = ? AND ct.trang_thai = 1
       WHERE kn.trang_thai = 1
       ORDER BY COALESCE(kn.parent_id, kn.id), kn.parent_id IS NOT NULL, kn.thu_tu ASC`,
      [baiHocId]
    );

    const formatted = rows.map(formatContentRow);

    res.json({
      success: true,
      bai_hoc: baiHoc,
      bang_du_lieu: tableName,
      data: buildSkillTree(formatted),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 3. LẤY CHI TIẾT 1 KỸ NĂNG (VÀ CÁC TAB CON NẾU LÀ KỸ NĂNG CHA 1 HOẶC 3)
// GET /api/nn/bai-hoc/:baiHocId/ky-nang/:kyNangId
// =========================================================================
router.get('/bai-hoc/:baiHocId/ky-nang/:kyNangId', async (req, res) => {
  try {
    const { baiHocId, kyNangId } = req.params;

    const [[baiHoc]] = await db.query(
      `SELECT id, loai_phan, ma_bai, ten_bai_vn, ten_bai_en FROM bai_hoc_nn WHERE id = ?`,
      [baiHocId]
    );
    if (!baiHoc) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
    }

    const tableName = getTableName(baiHoc.loai_phan);
    if (!tableName) {
      return res.status(400).json({ success: false, message: 'Loại phần không hợp lệ' });
    }

    // Lấy cả kỹ năng được chọn và các tiểu mục con của nó (VD: chọn 1 -> lấy 1.1, 1.2, 1.3)
    const [rows] = await db.query(
      `SELECT 
         kn.id, kn.parent_id, kn.ky_hieu, kn.ma_ky_nang,
         kn.ten_ky_nang_vn, kn.ten_ky_nang_en, kn.icon,
         ct.id AS noi_dung_id, ct.tieu_de_vn, ct.tieu_de_en,
         ct.noi_dung_chinh, ct.noi_dung_phu, ct.bai_kiem_tra, ct.am_thanh_mau
       FROM ky_nang_nn kn
       LEFT JOIN \`${tableName}\` ct
         ON ct.ky_nang_id = kn.id AND ct.bai_hoc_id = ? AND ct.trang_thai = 1
       WHERE kn.trang_thai = 1 AND (kn.id = ? OR kn.parent_id = ?)
       ORDER BY kn.parent_id IS NOT NULL, kn.thu_tu ASC`,
      [baiHocId, kyNangId, kyNangId]
    );

    // Lấy thêm bài tập bổ trợ từ bảng bai_tap_ky_nang (nếu có)
    let baiTapBoTro = [];
    try {
      const [btRows] = await db.query(
        `SELECT id, tu_tv, goi_y, am_thanh, hinh_anh, thu_tu
         FROM bai_tap_ky_nang
         WHERE bai_hoc_id = ? AND ky_nang_id = ?
         ORDER BY thu_tu ASC`,
        [baiHocId, kyNangId]
      );
      baiTapBoTro = btRows;
    } catch (e) {
      // Bỏ qua nếu bảng chưa tồn tại
    }

    res.json({
      success: true,
      bai_hoc: baiHoc,
      data: rows.map(formatContentRow),
      bai_tap_bo_tro: baiTapBoTro,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 4. ADMIN: THÊM HOẶC CẬP NHẬT NỘI DUNG KỸ NĂNG CHO BÀI HỌC
// POST /api/nn/noi-dung
// Body: { bai_hoc_id, ky_nang_id, tieu_de_vn, tieu_de_en, noi_dung_chinh, noi_dung_phu, bai_kiem_tra, am_thanh_mau, thu_tu }
// =========================================================================
router.post('/noi-dung', async (req, res) => {
  try {
    const {
      bai_hoc_id,
      ky_nang_id,
      tieu_de_vn = null,
      tieu_de_en = null,
      noi_dung_chinh = null,
      noi_dung_phu = null,
      bai_kiem_tra = null,
      am_thanh_mau = null,
      thu_tu = 1,
    } = req.body;

    // Tự động lấy loai_phan từ bai_hoc_nn để ghi vào đúng bảng
    const [[baiHoc]] = await db.query(
      `SELECT id, loai_phan FROM bai_hoc_nn WHERE id = ?`,
      [bai_hoc_id]
    );
    if (!baiHoc) {
      return res.status(404).json({ success: false, message: 'bai_hoc_id không tồn tại' });
    }

    const tableName = getTableName(baiHoc.loai_phan);
    if (!tableName) {
      return res.status(400).json({ success: false, message: 'loai_phan không hợp lệ' });
    }

    const toJSONString = (v) => (v === null || v === undefined ? null : JSON.stringify(v));

    await db.query(
      `INSERT INTO \`${tableName}\`
         (bai_hoc_id, loai_phan, ky_nang_id, tieu_de_vn, tieu_de_en,
          noi_dung_chinh, noi_dung_phu, bai_kiem_tra, am_thanh_mau, thu_tu)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         tieu_de_vn = VALUES(tieu_de_vn),
         tieu_de_en = VALUES(tieu_de_en),
         noi_dung_chinh = VALUES(noi_dung_chinh),
         noi_dung_phu = VALUES(noi_dung_phu),
         bai_kiem_tra = VALUES(bai_kiem_tra),
         am_thanh_mau = VALUES(am_thanh_mau),
         thu_tu = VALUES(thu_tu)`,
      [
        bai_hoc_id,
        baiHoc.loai_phan,
        ky_nang_id,
        tieu_de_vn,
        tieu_de_en,
        toJSONString(noi_dung_chinh),
        toJSONString(noi_dung_phu),
        toJSONString(bai_kiem_tra),
        am_thanh_mau,
        thu_tu,
      ]
    );

    res.json({
      success: true,
      message: `Đã lưu nội dung vào bảng ${tableName}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 5. ADMIN: XÓA 1 DÒNG NỘI DUNG KỸ NĂNG
// DELETE /api/nn/noi-dung/:loaiPhan/:id
// =========================================================================
router.delete('/noi-dung/:loaiPhan/:id', async (req, res) => {
  try {
    const { loaiPhan, id } = req.params;
    const tableName = getTableName(loaiPhan);

    if (!tableName) {
      return res.status(400).json({ success: false, message: 'loaiPhan phải là phat_am hoặc chu_de' });
    }

    const [result] = await db.query(`DELETE FROM \`${tableName}\` WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi để xóa' });
    }

    res.json({ success: true, message: `Đã xóa thành công khỏi ${tableName}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;