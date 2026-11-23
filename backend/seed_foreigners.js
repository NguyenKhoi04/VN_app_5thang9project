// backend/seed_foreigners.js
const mysql = require('./node_modules/mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'luyenviet_chinhta_vn_1thang10',
  });

  console.log('✅ Connected to MySQL database!');

  // ==========================================
  // 1. BỔ SUNG BÀI HỌC PHẦN 2 (loai_phan: 'phat_am')
  // ==========================================
  const phan2Lessons = [
    {
      ma_bai: 'P201',
      so_bai: 1,
      ten_vn: 'BÀI 1: ÂM ĐẦU',
      ten_en: 'Lesson 1: Initial Consonants',
      mo_ta_vn: 'Luyện phát âm các phụ âm đầu trong tiếng Việt (b, c, d, đ, g, h, k, l, m, n...)',
      mo_ta_en: 'Practice Vietnamese initial consonants',
      x: 50,
      y: 15,
    },
    {
      ma_bai: 'P202',
      so_bai: 2,
      ten_vn: 'BÀI 2: ÂM CUỐI',
      ten_en: 'Lesson 2: Final Consonants',
      mo_ta_vn: 'Luyện phát âm các phụ âm cuối và bán âm cuối (c, ch, m, n, ng, nh, p, t, o, y)',
      mo_ta_en: 'Practice Vietnamese final consonants',
      x: 30,
      y: 35,
    },
    {
      ma_bai: 'P203',
      so_bai: 3,
      ten_vn: 'BÀI 3: ÂM ĐỆM VÀ ÂM CHÍNH',
      ten_en: 'Lesson 3: Medial and Main Vowels',
      mo_ta_vn: 'Luyện phát âm nguyên âm đơn, nguyên âm đôi và âm đệm u/o',
      mo_ta_en: 'Practice Vietnamese vowels and medials',
      x: 70,
      y: 60,
    },
    {
      ma_bai: 'P204',
      so_bai: 4,
      ten_vn: 'BÀI 4: LUYỆN TẬP TỔNG HỢP',
      ten_en: 'Lesson 4: Comprehensive Practice',
      mo_ta_vn: 'Thực hành kết hợp âm đầu, vần và thanh điệu tạo tiếng chuẩn xác',
      mo_ta_en: 'Comprehensive pronunciation and tones practice',
      x: 40,
      y: 80,
    },
    {
      ma_bai: 'P205',
      so_bai: 5,
      ten_vn: 'BÀI 5: BÀI TẬP TỔNG HỢP PHẦN 2',
      ten_en: 'Lesson 5: Comprehensive Practice Part 2',
      mo_ta_vn: '50 câu hỏi luyện tập và kiểm tra toàn diện phần phát âm - thanh điệu',
      mo_ta_en: '50 comprehensive pronunciation test exercises',
      x: 50,
      y: 95,
    },
  ];

  for (const l of phan2Lessons) {
    const [exist] = await conn.query('SELECT id FROM bai_hoc_nn WHERE ma_bai = ?', [l.ma_bai]);
    if (exist.length === 0) {
      await conn.query(
        `INSERT INTO bai_hoc_nn (loai_phan, ma_bai, bo_bai, so_bai, ten_bai_vn, ten_bai_en, mo_ta_vn, mo_ta_en, cap_do, thu_tu, trang_thai, roadmap_x, roadmap_y)
         VALUES ('phat_am', ?, 1, ?, ?, ?, ?, ?, 'A1', ?, 1, ?, ?)`,
        [l.ma_bai, l.so_bai, l.ten_vn, l.ten_en, l.mo_ta_vn, l.mo_ta_en, l.so_bai, l.x, l.y]
      );
      console.log(`[bai_hoc_nn] Đã thêm ${l.ma_bai}: ${l.ten_vn}`);
    } else {
      console.log(`[bai_hoc_nn] Đã tồn tại ${l.ma_bai} (id: ${exist[0].id})`);
    }
  }

  // Lấy danh sách bài học hiện có để map ID
  const [allLessons] = await conn.query('SELECT id, ma_bai, loai_phan, so_bai FROM bai_hoc_nn');
  const lessonMap = {};
  allLessons.forEach((l) => {
    lessonMap[l.ma_bai] = l.id;
  });
  console.log('Lesson ID mapping:', lessonMap);

  // ==========================================
  // 2. BỔ SUNG PHẦN BÀI (phan_bai_nn) CÒN THIẾU
  // ==========================================
  const phanBaiList = [
    // Cho Chủ đề 3 (C003)
    {
      ma_bai: 'C003',
      so_phan: 1,
      ten_vn: 'Phần 1: Từ vựng nghề nghiệp & Nơi làm việc',
      ten_en: 'Part 1: Occupations & Workplaces Vocabulary',
      noi_dung: 'Tên các ngành nghề phổ biến (bác sĩ, giáo viên, kỹ sư...) và cơ quan, bệnh viện, trường học',
    },
    {
      ma_bai: 'C003',
      so_phan: 2,
      ten_vn: 'Phần 2: Mẫu câu hỏi nghề nghiệp & Giới thiệu việc làm',
      ten_en: 'Part 2: Inquiring about Occupations & Jobs',
      noi_dung: 'Cấu trúc câu: "Anh làm nghề gì?", "Tôi làm nghề...", "Hiện nay bạn làm việc ở đâu?"',
    },
    {
      ma_bai: 'C003',
      so_phan: 3,
      ten_vn: 'Phần 3: Hội thoại giao lưu công việc và sở thích',
      ten_en: 'Part 3: Workplace & Hobbies Dialogue',
      noi_dung: 'Đoạn đàm thoại thực tế chia sẻ về công việc hàng ngày và mức độ yêu thích công việc',
    },
    // Cho Chủ đề 4 (C004)
    {
      ma_bai: 'C004',
      so_phan: 1,
      ten_vn: 'Phần 1: Từ vựng địa chỉ & Phương hướng nơi ở',
      ten_en: 'Part 1: Address & Living Location Vocabulary',
      noi_dung: 'Từ chỉ nơi ở: nhà, đường phố, quận, huyện, tỉnh thành phố, trung tâm',
    },
    {
      ma_bai: 'C004',
      so_phan: 2,
      ten_vn: 'Phần 2: Mẫu câu hỏi nơi ở: "Bây giờ cô sống ở đâu?"',
      ten_en: 'Part 2: Inquiring about Residence & Address',
      noi_dung: 'Mẫu câu: "Nhà bạn ở đâu?", "Tôi sống ở quận...", "Nhà cách công ty bao xa?"',
    },
    {
      ma_bai: 'C004',
      so_phan: 3,
      ten_vn: 'Phần 3: Đối thoại hỏi đường và miêu tả khoảng cách',
      ten_en: 'Part 3: Asking Directions & Distance Dialogue',
      noi_dung: 'Tình huống thực tế hỏi thăm vị trí nhà ở, khoảng cách gần - xa đến trung tâm thành phố',
    },
    // Cho các bài Phần 2 (P201..P204)
    {
      ma_bai: 'P201',
      so_phan: 1,
      ten_vn: 'Phần 1: Phụ âm môi và răng môi (b, m, ph, v)',
      ten_en: 'Part 1: Bilabial & Labiodental Consonants',
      noi_dung: 'Khẩu hình miệng và cách phát âm chuẩn xác các âm b, m, ph, v',
    },
    {
      ma_bai: 'P201',
      so_phan: 2,
      ten_vn: 'Phần 2: Phụ âm đầu lưỡi và răng (d, đ, t, th, x, s)',
      ten_en: 'Part 2: Dental & Alveolar Consonants',
      noi_dung: 'Cách đặt đầu lưỡi tạo âm gió và âm tắc vô thanh d, đ, t, th, x, s',
    },
    {
      ma_bai: 'P202',
      so_phan: 1,
      ten_vn: 'Phần 1: Phụ âm cuối mũi (m, n, ng, nh)',
      ten_en: 'Part 1: Nasal Final Consonants',
      noi_dung: 'Quy tắc khép khẩu hình và luồng hơi qua mũi khi phát âm đuôi',
    },
    {
      ma_bai: 'P202',
      so_phan: 2,
      ten_vn: 'Phần 2: Phụ âm cuối tắc họng (p, t, c, ch)',
      ten_en: 'Part 2: Stop Final Consonants',
      noi_dung: 'Quy tắc ngắt âm dứt khoát của phụ âm chặn cuối',
    },
    {
      ma_bai: 'P203',
      so_phan: 1,
      ten_vn: 'Phần 1: Hệ thống 11 nguyên âm đơn và 3 nguyên âm đôi',
      ten_en: 'Part 1: Single & Diphthong Vowel System',
      noi_dung: 'Luyện mở miệng rộng - hẹp và trường độ của nguyên âm ngắn - dài',
    },
    {
      ma_bai: 'P203',
      so_phan: 2,
      ten_vn: 'Phần 2: Âm đệm u/o và quy tắc làm tròn môi',
      ten_en: 'Part 2: Medials and Lip Rounding Rules',
      noi_dung: 'Cách chuyển động cơ môi tròn môi khi vần có âm đệm oa, oe, uy, uê',
    },
    {
      ma_bai: 'P204',
      so_phan: 1,
      ten_vn: 'Phần 1: Luyện ghép âm tiết hoàn chỉnh',
      ten_en: 'Part 1: Full Syllable Combination',
      noi_dung: 'Ghép phụ âm đầu + âm đệm + âm chính + âm cuối',
    },
    {
      ma_bai: 'P204',
      so_phan: 2,
      ten_vn: 'Phần 2: Luyện 6 thanh điệu kết hợp ngữ điệu câu',
      ten_en: 'Part 2: 6 Tones and Sentence Intonation',
      noi_dung: 'Luyện cao độ thanh ngang, huyền, sắc, hỏi, ngã, nặng trong câu dài',
    },
    {
      ma_bai: 'P205',
      so_phan: 1,
      ten_vn: 'Phần 1: Kiểm tra phát âm âm đầu và vần (25 câu)',
      ten_en: 'Part 1: Initial & Rhyme Review (25 questions)',
      noi_dung: 'Bài tập nhận diện âm vị và phân biệt cặp âm dễ nhầm',
    },
    {
      ma_bai: 'P205',
      so_phan: 2,
      ten_vn: 'Phần 2: Kiểm tra thanh điệu và ngữ điệu (25 câu)',
      ten_en: 'Part 2: Tone & Intonation Assessment (25 questions)',
      noi_dung: 'Bài tập phân biệt dấu hỏi - ngã, sắc - nặng và ngữ điệu câu hỏi',
    },
  ];

  for (const pb of phanBaiList) {
    const baiHocId = lessonMap[pb.ma_bai];
    if (!baiHocId) continue;

    const [exist] = await conn.query(
      'SELECT id FROM phan_bai_nn WHERE bai_hoc_id = ? AND so_phan = ?',
      [baiHocId, pb.so_phan]
    );

    if (exist.length === 0) {
      await conn.query(
        'INSERT INTO phan_bai_nn (bai_hoc_id, so_phan, ten_phan_vn, ten_phan_en, noi_dung) VALUES (?, ?, ?, ?, ?)',
        [baiHocId, pb.so_phan, pb.ten_vn, pb.ten_en, pb.noi_dung]
      );
      console.log(`[phan_bai_nn] Đã thêm phần ${pb.so_phan} cho bài ${pb.ma_bai}`);
    }
  }

  // ==========================================
  // 3. BỔ SUNG 59 TỪ VỰNG (tu_vung) ĐẦY ĐỦ CHO 4 BÀI CHỦ ĐỀ
  // ==========================================
  const vocabData = [
    // Bài 1 (C001) - 12 từ
    { ma_bai: 'C001', tv: 'xin chào', loai: 'V', en: 'hello / greet', vi_du: 'Xin chào anh Nam!', thu_tu: 1 },
    { ma_bai: 'C001', tv: 'xin lỗi', loai: 'V', en: 'excuse me / sorry', vi_du: 'Xin lỗi, cho tôi hỏi đường.', thu_tu: 2 },
    { ma_bai: 'C001', tv: 'tên', loai: 'N', en: 'name', vi_du: 'Tên của bạn là gì?', thu_tu: 3 },
    { ma_bai: 'C001', tv: 'tôi', loai: 'N', en: 'I / me', vi_du: 'Tôi là người du lịch.', thu_tu: 4 },
    { ma_bai: 'C001', tv: 'anh', loai: 'N', en: 'you (older male) / older brother', vi_du: 'Anh tên là gì ạ?', thu_tu: 5 },
    { ma_bai: 'C001', tv: 'chị', loai: 'N', en: 'you (older female) / older sister', vi_du: 'Chào chị Lan.', thu_tu: 6 },
    { ma_bai: 'C001', tv: 'bạn', loai: 'N', en: 'you (friend/peer) / friend', vi_du: 'Bạn có khỏe không?', thu_tu: 7 },
    { ma_bai: 'C001', tv: 'là', loai: 'V', en: 'to be (am/is/are)', vi_du: 'Tôi là John.', thu_tu: 8 },
    { ma_bai: 'C001', tv: 'gì', loai: 'N', en: 'what', vi_du: 'Cái này là cái gì?', thu_tu: 9 },
    { ma_bai: 'C001', tv: 'cảm ơn', loai: 'V', en: 'thank you', vi_du: 'Cảm ơn bạn rất nhiều.', thu_tu: 10 },
    { ma_bai: 'C001', tv: 'vâng', loai: 'ADV', en: 'yes (polite)', vi_du: 'Vâng, tôi hiểu rồi.', thu_tu: 11 },
    { ma_bai: 'C001', tv: 'không', loai: 'ADV', en: 'no / not', vi_du: 'Tôi không biết tiếng Pháp.', thu_tu: 12 },

    // Bài 2 (C002) - 15 từ
    { ma_bai: 'C002', tv: 'người', loai: 'N', en: 'person / people', vi_du: 'Người Việt Nam rất thân thiện.', thu_tu: 1 },
    { ma_bai: 'C002', tv: 'nước', loai: 'N', en: 'country / water', vi_du: 'Nước bạn ở đâu?', thu_tu: 2 },
    { ma_bai: 'C002', tv: 'nào', loai: 'N', en: 'which / what', vi_du: 'Bạn là người nước nào?', thu_tu: 3 },
    { ma_bai: 'C002', tv: 'Việt Nam', loai: 'N', en: 'Vietnam', vi_du: 'Tôi yêu đất nước Việt Nam.', thu_tu: 4 },
    { ma_bai: 'C002', tv: 'Anh', loai: 'N', en: 'England / British', vi_du: 'Tôi đến từ nước Anh.', thu_tu: 5 },
    { ma_bai: 'C002', tv: 'Mỹ', loai: 'N', en: 'America / American', vi_du: 'Anh ấy là người Mỹ.', thu_tu: 6 },
    { ma_bai: 'C002', tv: 'Hàn Quốc', loai: 'N', en: 'South Korea', vi_du: 'Cô ấy là người Hàn Quốc.', thu_tu: 7 },
    { ma_bai: 'C002', tv: 'Nhật Bản', loai: 'N', en: 'Japan', vi_du: 'Tokyo là thủ đô Nhật Bản.', thu_tu: 8 },
    { ma_bai: 'C002', tv: 'Pháp', loai: 'N', en: 'France / French', vi_du: 'Paris là kinh đô nước Pháp.', thu_tu: 9 },
    { ma_bai: 'C002', tv: 'cô', loai: 'N', en: 'you (younger female) / Miss', vi_du: 'Chào cô giáo.', thu_tu: 10 },
    { ma_bai: 'C002', tv: 'ông', loai: 'N', en: 'you (elderly male) / Mr.', vi_du: 'Ông có khỏe không?', thu_tu: 11 },
    { ma_bai: 'C002', tv: 'bà', loai: 'N', en: 'you (elderly female) / Mrs.', vi_du: 'Bà sống ở đâu?', thu_tu: 12 },
    { ma_bai: 'C002', tv: 'còn', loai: 'ADV', en: 'and (you)? / still', vi_du: 'Tôi là sinh viên, còn bạn?', thu_tu: 13 },
    { ma_bai: 'C002', tv: 'quốc tịch', loai: 'N', en: 'nationality', vi_du: 'Quốc tịch của bạn là gì?', thu_tu: 14 },
    { ma_bai: 'C002', tv: 'tiếng', loai: 'N', en: 'language / sound', vi_du: 'Bạn học tiếng Việt bao lâu rồi?', thu_tu: 15 },

    // Bài 3 (C003) - 18 từ
    { ma_bai: 'C003', tv: 'làm', loai: 'V', en: 'to do / to work / to make', vi_du: 'Dạo này bạn làm gì?', thu_tu: 1 },
    { ma_bai: 'C003', tv: 'nghề', loai: 'N', en: 'occupation / profession', vi_du: 'Nghề giáo viên rất cao quý.', thu_tu: 2 },
    { ma_bai: 'C003', tv: 'giáo viên', loai: 'N', en: 'teacher', vi_du: 'Mẹ tôi là giáo viên tiếng Anh.', thu_tu: 3 },
    { ma_bai: 'C003', tv: 'bác sĩ', loai: 'N', en: 'doctor', vi_du: 'Anh ấy là bác sĩ phẫu thuật.', thu_tu: 4 },
    { ma_bai: 'C003', tv: 'kỹ sư', loai: 'N', en: 'engineer', vi_du: 'Tôi là kỹ sư công nghệ thông tin.', thu_tu: 5 },
    { ma_bai: 'C003', tv: 'sinh viên', loai: 'N', en: 'university student', vi_du: 'Chúng tôi là sinh viên năm nhất.', thu_tu: 6 },
    { ma_bai: 'C003', tv: 'học sinh', loai: 'N', en: 'student (school)', vi_du: 'Em là học sinh trung học.', thu_tu: 7 },
    { ma_bai: 'C003', tv: 'nhân viên', loai: 'N', en: 'staff / employee', vi_du: 'Cô ấy là nhân viên văn phòng.', thu_tu: 8 },
    { ma_bai: 'C003', tv: 'kinh doanh', loai: 'N', en: 'business', vi_du: 'Gia đình tôi làm kinh doanh.', thu_tu: 9 },
    { ma_bai: 'C003', tv: 'ở', loai: 'V', en: 'to live / to stay / at', vi_du: 'Tôi làm việc ở Hà Nội.', thu_tu: 10 },
    { ma_bai: 'C003', tv: 'công ty', loai: 'N', en: 'company', vi_du: 'Công ty của bạn ở đâu?', thu_tu: 11 },
    { ma_bai: 'C003', tv: 'trường', loai: 'N', en: 'school', vi_du: 'Trường học rất gần nhà.', thu_tu: 12 },
    { ma_bai: 'C003', tv: 'bệnh viện', loai: 'N', en: 'hospital', vi_du: 'Bệnh viện ở cuối con đường.', thu_tu: 13 },
    { ma_bai: 'C003', tv: 'hiện nay', loai: 'ADV', en: 'currently / nowadays', vi_du: 'Hiện nay tôi đang tìm việc.', thu_tu: 14 },
    { ma_bai: 'C003', tv: 'đang', loai: 'ADV', en: 'currently (doing)', vi_du: 'Tôi đang học bài.', thu_tu: 15 },
    { ma_bai: 'C003', tv: 'thích', loai: 'V', en: 'to like', vi_du: 'Tôi thích món ăn Việt Nam.', thu_tu: 16 },
    { ma_bai: 'C003', tv: 'rất', loai: 'ADV', en: 'very / very much', vi_du: 'Công việc này rất bận rộn.', thu_tu: 17 },
    { ma_bai: 'C003', tv: 'thú vị', loai: 'ADJ', en: 'interesting', vi_du: 'Học tiếng Việt rất thú vị.', thu_tu: 18 },

    // Bài 4 (C004) - 14 từ
    { ma_bai: 'C004', tv: 'nhà', loai: 'N', en: 'house / home', vi_du: 'Nhà tôi ở quận 1.', thu_tu: 1 },
    { ma_bai: 'C004', tv: 'ở đâu', loai: 'ADV', en: 'where (location)', vi_du: 'Bây giờ cô sống ở đâu?', thu_tu: 2 },
    { ma_bai: 'C004', tv: 'địa chỉ', loai: 'N', en: 'address', vi_du: 'Địa chỉ nhà bạn là số mấy?', thu_tu: 3 },
    { ma_bai: 'C004', tv: 'đường', loai: 'N', en: 'road / street', vi_du: 'Đường Nguyễn Huệ rất đẹp.', thu_tu: 4 },
    { ma_bai: 'C004', tv: 'thành phố', loai: 'N', en: 'city', vi_du: 'Thành phố Hồ Chí Minh rất năng động.', thu_tu: 5 },
    { ma_bai: 'C004', tv: 'tỉnh', loai: 'N', en: 'province', vi_du: 'Quê tôi ở tỉnh Đồng Nai.', thu_tu: 6 },
    { ma_bai: 'C004', tv: 'quận', loai: 'N', en: 'district (urban)', vi_du: 'Quận Ba Đình ở trung tâm Hà Nội.', thu_tu: 7 },
    { ma_bai: 'C004', tv: 'huyện', loai: 'N', en: 'district (rural)', vi_du: 'Nhà bà tôi ở một huyện miền núi.', thu_tu: 8 },
    { ma_bai: 'C004', tv: 'gần', loai: 'ADJ', en: 'near / close', vi_du: 'Khách sạn rất gần sân bay.', thu_tu: 9 },
    { ma_bai: 'C004', tv: 'xa', loai: 'ADJ', en: 'far', vi_du: 'Từ đây đến đó có xa không?', thu_tu: 10 },
    { ma_bai: 'C004', tv: 'cách', loai: 'V', en: 'to be (distance) away from', vi_du: 'Nhà cách trường 2 cây số.', thu_tu: 11 },
    { ma_bai: 'C004', tv: 'đây', loai: 'ADV', en: 'here / this place', vi_du: 'Ở đây không khí rất trong lành.', thu_tu: 12 },
    { ma_bai: 'C004', tv: 'đó', loai: 'ADV', en: 'there / that place', vi_du: 'Ở đó có nhiều cửa hàng tiện lợi.', thu_tu: 13 },
    { ma_bai: 'C004', tv: 'trung tâm', loai: 'N', en: 'center / downtown', vi_du: 'Trung tâm thành phố về đêm rất nhộn nhịp.', thu_tu: 14 },
  ];

  for (const v of vocabData) {
    const baiHocId = lessonMap[v.ma_bai];
    if (!baiHocId) continue;

    const [exist] = await conn.query(
      'SELECT id FROM tu_vung WHERE bai_hoc_id = ? AND tu_tv = ?',
      [baiHocId, v.tv]
    );

    if (exist.length === 0) {
      await conn.query(
        'INSERT INTO tu_vung (bai_hoc_id, tu_tv, loai_tu, nghia_en, vi_du, thu_tu) VALUES (?, ?, ?, ?, ?, ?)',
        [baiHocId, v.tv, v.loai, v.en, v.vi_du, v.thu_tu]
      );
    } else {
      await conn.query(
        'UPDATE tu_vung SET loai_tu = ?, nghia_en = ?, vi_du = ?, thu_tu = ? WHERE id = ?',
        [v.loai, v.en, v.vi_du, v.thu_tu, exist[0].id]
      );
    }
  }
  console.log(`[tu_vung] Đã đồng bộ thành công ${vocabData.length} từ vựng!`);

  // ==========================================
  // 4. BỔ SUNG BÀI TẬP KỸ NĂNG (bai_tap_ky_nang)
  // ky_nang_id: 1 (Nghe), 2 (Nói/Phát âm), 3 (Đọc), 4 (Viết chính tả)
  // ==========================================
  const skillExercises = [
    // --- CHỦ ĐỀ 1 (C001) ---
    // Nghe (1)
    { ma_bai: 'C001', kn: 1, tu: 'Xin chào, tôi là học sinh.', goi_y: 'Listen: Hello, I am a student.', thu_tu: 1 },
    { ma_bai: 'C001', kn: 1, tu: 'Xin lỗi, anh tên là gì?', goi_y: 'Listen: Excuse me, what is your name?', thu_tu: 2 },
    { ma_bai: 'C001', kn: 1, tu: 'Cảm ơn bạn rất nhiều!', goi_y: 'Listen: Thank you very much!', thu_tu: 3 },
    // Nói / Phát âm (2)
    { ma_bai: 'C001', kn: 2, tu: 'Xin chào!', goi_y: 'Speak: Hello!', thu_tu: 1 },
    { ma_bai: 'C001', kn: 2, tu: 'Tôi tên là Nam.', goi_y: 'Speak: My name is Nam.', thu_tu: 2 },
    { ma_bai: 'C001', kn: 2, tu: 'Rất vui được gặp bạn.', goi_y: 'Speak: Nice to meet you.', thu_tu: 3 },
    // Đọc (3)
    { ma_bai: 'C001', kn: 3, tu: 'Xin chào! Anh tên gì?', goi_y: 'Read aloud: Dialogue greeting', thu_tu: 1 },
    { ma_bai: 'C001', kn: 3, tu: 'Tôi tên là David, còn anh?', goi_y: 'Read aloud: Self-introduction', thu_tu: 2 },
    { ma_bai: 'C001', kn: 3, tu: 'Tôi tên là Minh. Chào mừng anh đến Việt Nam!', goi_y: 'Read aloud: Welcome sentence', thu_tu: 3 },
    // Viết chính tả (4)
    { ma_bai: 'C001', kn: 4, tu: 'xin chào', goi_y: 'Greeting • Lời chào', thu_tu: 1 },
    { ma_bai: 'C001', kn: 4, tu: 'cảm ơn', goi_y: 'Thank you • Lời cảm ơn', thu_tu: 2 },
    { ma_bai: 'C001', kn: 4, tu: 'tạm biệt', goi_y: 'Goodbye • Chào tạm biệt', thu_tu: 3 },
    { ma_bai: 'C001', kn: 4, tu: 'tôi là học sinh', goi_y: 'I am a student • Giới thiệu bản thân', thu_tu: 4 },

    // --- CHỦ ĐỀ 2 (C002) ---
    // Nghe (1)
    { ma_bai: 'C002', kn: 1, tu: 'Cô là người nước nào?', goi_y: 'Listen: Where are you from?', thu_tu: 1 },
    { ma_bai: 'C002', kn: 1, tu: 'Tôi là người Việt Nam.', goi_y: 'Listen: I am Vietnamese.', thu_tu: 2 },
    { ma_bai: 'C002', kn: 1, tu: 'Bạn có nói được tiếng Việt không?', goi_y: 'Listen: Do you speak Vietnamese?', thu_tu: 3 },
    // Nói / Phát âm (2)
    { ma_bai: 'C002', kn: 2, tu: 'Tôi là người Mỹ.', goi_y: 'Speak: I am American.', thu_tu: 1 },
    { ma_bai: 'C002', kn: 2, tu: 'Tôi học tiếng Việt ở Hà Nội.', goi_y: 'Speak: I study Vietnamese in Hanoi.', thu_tu: 2 },
    // Đọc (3)
    { ma_bai: 'C002', kn: 3, tu: 'Cô là người nước nào?', goi_y: 'Read: Where are you from?', thu_tu: 1 },
    { ma_bai: 'C002', kn: 3, tu: 'Tôi là người Việt Nam.', goi_y: 'Read: I am Vietnamese.', thu_tu: 2 },
    { ma_bai: 'C002', kn: 3, tu: 'Việt Nam có thủ đô là Hà Nội.', goi_y: 'Read: Hanoi is capital of Vietnam.', thu_tu: 3 },
    // Viết chính tả (4)
    { ma_bai: 'C002', kn: 4, tu: 'Việt Nam', goi_y: 'Country name • Tên quốc gia', thu_tu: 1 },
    { ma_bai: 'C002', kn: 4, tu: 'tiếng Việt', goi_y: 'Vietnamese language • Ngôn ngữ', thu_tu: 2 },
    { ma_bai: 'C002', kn: 4, tu: 'quốc tịch', goi_y: 'Nationality • Quốc tịch', thu_tu: 3 },

    // --- CHỦ ĐỀ 3 (C003) ---
    // Nghe (1)
    { ma_bai: 'C003', kn: 1, tu: 'Dạo này bạn làm gì?', goi_y: 'Listen: What are you doing these days?', thu_tu: 1 },
    { ma_bai: 'C003', kn: 1, tu: 'Tôi đang làm việc tại bệnh viện.', goi_y: 'Listen: I am working at the hospital.', thu_tu: 2 },
    // Nói (2)
    { ma_bai: 'C003', kn: 2, tu: 'Tôi là kỹ sư công nghệ.', goi_y: 'Speak: I am a tech engineer.', thu_tu: 1 },
    { ma_bai: 'C003', kn: 2, tu: 'Công việc của tôi rất thú vị.', goi_y: 'Speak: My job is very interesting.', thu_tu: 2 },
    // Đọc (3)
    { ma_bai: 'C003', kn: 3, tu: 'Bác sĩ và giáo viên là hai nghề rất được kính trọng.', goi_y: 'Read: Respected professions', thu_tu: 1 },
    { ma_bai: 'C003', kn: 3, tu: 'Hiện nay tôi làm nhân viên kinh doanh.', goi_y: 'Read: Sales employee', thu_tu: 2 },
    // Viết chính tả (4)
    { ma_bai: 'C003', kn: 4, tu: 'bác sĩ', goi_y: 'Doctor • Bác sĩ chữa bệnh', thu_tu: 1 },
    { ma_bai: 'C003', kn: 4, tu: 'giáo viên', goi_y: 'Teacher • Giáo viên dạy học', thu_tu: 2 },
    { ma_bai: 'C003', kn: 4, tu: 'kỹ sư', goi_y: 'Engineer • Kỹ sư kỹ thuật', thu_tu: 3 },
    { ma_bai: 'C003', kn: 4, tu: 'sinh viên', goi_y: 'University student • Sinh viên', thu_tu: 4 },

    // --- CHỦ ĐỀ 4 (C004) ---
    // Nghe (1)
    { ma_bai: 'C004', kn: 1, tu: 'Bây giờ cô sống ở đâu?', goi_y: 'Listen: Where do you live now?', thu_tu: 1 },
    { ma_bai: 'C004', kn: 1, tu: 'Nhà tôi ở trung tâm thành phố.', goi_y: 'Listen: My home is in downtown.', thu_tu: 2 },
    // Nói (2)
    { ma_bai: 'C004', kn: 2, tu: 'Tôi sống ở quận Hoàn Kiếm.', goi_y: 'Speak: I live in Hoan Kiem district.', thu_tu: 1 },
    { ma_bai: 'C004', kn: 2, tu: 'Nhà tôi cách công ty ba cây số.', goi_y: 'Speak: My house is 3km away.', thu_tu: 2 },
    // Đọc (3)
    { ma_bai: 'C004', kn: 3, tu: 'Đường phố ở đây rất nhộn nhịp và đông đúc.', goi_y: 'Read: Busy streets', thu_tu: 1 },
    { ma_bai: 'C004', kn: 3, tu: 'Địa chỉ của tôi ở số 10 đường Nguyễn Du.', goi_y: 'Read: House address', thu_tu: 2 },
    // Viết chính tả (4)
    { ma_bai: 'C004', kn: 4, tu: 'thành phố', goi_y: 'City • Thành phố đô thị', thu_tu: 1 },
    { ma_bai: 'C004', kn: 4, tu: 'địa chỉ', goi_y: 'Address • Địa chỉ nhà', thu_tu: 2 },
    { ma_bai: 'C004', kn: 4, tu: 'trung tâm', goi_y: 'Center / Downtown • Trung tâm', thu_tu: 3 },

    // --- PHẦN 2: BÀI 1 ÂM ĐẦU (P201) ---
    // Nghe (1)
    { ma_bai: 'P201', kn: 1, tu: 'bà, ba, bố, bé, bi', goi_y: 'Listen: Sound of consonant B', thu_tu: 1 },
    { ma_bai: 'P201', kn: 1, tu: 'ca, cô, cư, cá, cờ', goi_y: 'Listen: Sound of consonant C', thu_tu: 2 },
    // Nói / Phát âm (2)
    { ma_bai: 'P201', kn: 2, tu: 'ba, bê, bò, cá, cô', goi_y: 'Speak: Practice initial syllables', thu_tu: 1 },
    { ma_bai: 'P201', kn: 2, tu: 'mẹ, mưa, nón, nước', goi_y: 'Speak: Nasal consonants M, N', thu_tu: 2 },
    // Đọc (3)
    { ma_bai: 'P201', kn: 3, tu: 'Bảng chữ cái tiếng Việt có 29 chữ cái.', goi_y: 'Read: Alphabet overview', thu_tu: 1 },
    { ma_bai: 'P201', kn: 3, tu: 'Tiếng Việt là ngôn ngữ đơn âm tiết.', goi_y: 'Read: Monosyllabic structure', thu_tu: 2 },
    // Viết chính tả (4)
    { ma_bai: 'P201', kn: 4, tu: 'ba má', goi_y: 'Parents • Ba má', thu_tu: 1 },
    { ma_bai: 'P201', kn: 4, tu: 'đi học', goi_y: 'Go to school • Đi học', thu_tu: 2 },
    { ma_bai: 'P201', kn: 4, tu: 'con cá', goi_y: 'Fish • Con cá', thu_tu: 3 },
  ];

  for (const ex of skillExercises) {
    const baiHocId = lessonMap[ex.ma_bai];
    if (!baiHocId) continue;

    const [exist] = await conn.query(
      'SELECT id FROM bai_tap_ky_nang WHERE bai_hoc_id = ? AND ky_nang_id = ? AND tu_tv = ?',
      [baiHocId, ex.kn, ex.tu]
    );

    if (exist.length === 0) {
      await conn.query(
        'INSERT INTO bai_tap_ky_nang (bai_hoc_id, ky_nang_id, tu_tv, goi_y, thu_tu) VALUES (?, ?, ?, ?, ?)',
        [baiHocId, ex.kn, ex.tu, ex.goi_y, ex.thu_tu]
      );
    }
  }
  console.log(`[bai_tap_ky_nang] Đã đồng bộ thành công bài tập kỹ năng!`);

  console.log('🎉 Hoàn tất toàn bộ nạp dữ liệu vào MySQL!');
  await conn.end();
}

main().catch((err) => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});

