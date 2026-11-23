// src/config/api.js
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

// LƯU Ý ĐỔI IP:
// - Máy ảo Android: dùng 'http://10.0.2.2:5000'
// - Máy thật (qua Wi-Fi): dùng 'http://<IP_MAY_TINH>:5000' (ví dụ: 'http://192.168.1.15:5000')
// - Máy ảo iOS hoặc Web: dùng 'http://localhost:5000'

export const API_ENDPOINTS = {
  // Trạng thái server
  GET_STATUS: `${BASE_URL}/api/status`,

  // Xác thực & Người dùng (nguoi_dung, vai_tro)
  LOGIN: `${BASE_URL}/api/login`,
  REGISTER: `${BASE_URL}/api/register`,
  GET_ROLES: `${BASE_URL}/api/roles`,
  GET_USER_INFO: `${BASE_URL}/api/user-info`,
  SAVE_USER_ROLE: `${BASE_URL}/api/user-role`,

  // Chương trình & Kỹ năng (chuong_trinh, ky_nang, lop_hoc)
  GET_CLASSES: `${BASE_URL}/api/classes`,
  GET_PROGRAM_NAME: `${BASE_URL}/api/program-name`,
  GET_SKILLS: `${BASE_URL}/api/skills`,
  GET_SKILLS_BY_CLASS: `${BASE_URL}/api/skills-by-class`,
  GET_DATA: `${BASE_URL}/api/data`,

  // Luyện chính tả học sinh (bai_chinh_ta_hs, ket_qua_chinh_ta_hs)
  GET_CHINH_TA_HS: `${BASE_URL}/api/chinh-ta-hs`,
  SAVE_KET_QUA_CHINH_TA_HS: `${BASE_URL}/api/ket-qua-chinh-ta-hs`,
  GET_KET_QUA_CHINH_TA_HS: `${BASE_URL}/api/ket-qua-chinh-ta-hs`,

  // Luyện đọc học sinh (bai_doc, doan_van, tu_kho, cau_hoi_bai_doc, am_thanh_bai_doc, chu_de)
  GET_CHU_DE: `${BASE_URL}/api/chu-de`,
  GET_BAI_DOC: `${BASE_URL}/api/bai-doc`,
  GET_DOAN_VAN: `${BASE_URL}/api/doan-van`,
  GET_TU_KHO: `${BASE_URL}/api/tu-kho`,
  GET_CAU_HOI_BAI_DOC: `${BASE_URL}/api/cau-hoi-bai-doc`,
  GET_AM_THANH_BAI_DOC: `${BASE_URL}/api/am-thanh-bai-doc`,

  // Học âm, vần Lớp 1 (tuan_hoc_lop1, bai_hoc_lop1_phan1, chu_am_van, am_thanh_chu_am)
  GET_TUAN_HOC_LOP1: `${BASE_URL}/api/tuan-hoc-lop-1`,
  GET_BAIHOC_LOP1: `${BASE_URL}/api/baihoc-lop1`,
  GET_CHU_AM_VAN: `${BASE_URL}/api/chu-am-van`,
  GET_AM_THANH_CHU_AM: `${BASE_URL}/api/am-thanh-chu-am`,

  // Luyện viết (bai_luyen_viet, chu_luyen_viet)
  GET_BAI_LUYEN_VIET: `${BASE_URL}/api/bai-luyen-viet`,
  GET_CHU_LUYEN_VIET: `${BASE_URL}/api/chu-luyen-viet`,

  // Tiến trình học tập học sinh (tien_trinh_hoc_sinh)
  GET_TIEN_TRINH_HS: `${BASE_URL}/api/tien-trinh-hs`,
  SAVE_TIEN_TRINH_HS: `${BASE_URL}/api/tien-trinh-hs`,

  // Người nước ngoài (bai_hoc_nn, phan_bai_nn, tu_vung, cau_hoi_nn, bai_tap_ky_nang)
  GET_BAI_HOC_NN: `${BASE_URL}/api/bai-hoc-nn`,
  GET_PHAN_BAI_NN: `${BASE_URL}/api/phan-bai-nn`,
  GET_TU_VUNG: `${BASE_URL}/api/tu-vung`,
  GET_CAU_HOI_NN: `${BASE_URL}/api/cau-hoi-nn`,
  GET_BAI_TAP_KY_NANG: `${BASE_URL}/api/bai-tap-ky-nang`,

  // AI Camera nhận diện đồ vật (Roboflow & Backend AI)
  AI_DETECT_OBJECT: `${BASE_URL}/api/ai/detect-object`,
};
