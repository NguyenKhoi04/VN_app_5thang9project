# TỔNG HỢP PHÂN TÍCH CHỨC NĂNG & THIẾT KẾ UML TOÀN DỰ ÁN

- **Tên đề tài / Dự án:** Xây dựng ứng dụng Luyện viết chính tả và Tập đọc Tiếng Việt *(App người dùng)*
- **Phạm vi quét mã nguồn:** Toàn bộ `85` tệp mã nguồn trong thư mục `src/app/screens` (kết hợp đối chiếu điều hướng gốc `src/app/index.tsx`, cấu hình API `src/config/api.js` và dịch vụ AI `src/services/aiDetectionService.ts`).
- **Hai nhóm tác nhân (Actors) chính:**
  1. **Học sinh tiểu học (`user: học sinh tiểu học`):** Học sinh từ **Lớp 1 đến Lớp 3** (theo chương trình SGK *Tiếng Việt – Kết nối tri thức với cuộc sống*).
  2. **Người nước ngoài (`user: người nước ngoài`):** Người nước ngoài học Tiếng Việt ở **trình độ nhập môn A1** (hỗ trợ đa ngôn ngữ dịch thuật & giải nghĩa).

---

## MỤC LỤC

1. [Tổng quan cấu trúc thư mục `src/app/screens`](#1-tổng-quan-cấu-trúc-thư-mục-srcappscreens)
2. [YÊU CẦU 1: Liệt kê chi tiết các chức năng cho 2 đối tượng người dùng](#2-yêu-cầu-1-liệt-kê-chi-tiết-các-chức-năng-cho-2-đối-tượng-người-dùng)
   - [2.1. Nhóm chức năng dùng chung cho cả 2 đối tượng](#21-nhóm-chức-năng-dùng-chung-cho-cả-2-đối-tượng)
   - [2.2. Nhóm chức năng dành riêng cho Học sinh tiểu học (Lớp 1 – Lớp 3)](#22-nhóm-chức-năng-dành-riêng-cho-học-sinh-tiểu-học-lớp-1--lớp-3)
   - [2.3. Nhóm chức năng dành riêng cho Người nước ngoài (Trình độ A1)](#23-nhóm-chức-năng-dành-riêng-cho-người-nước-ngoài-trình-độ-a1)
3. [YÊU CẦU 2: Danh sách chi tiết Use Case, Sơ đồ trình tự và Sơ đồ hoạt động](#3-yêu-cầu-2-danh-sách-chi-tiết-use-case-sơ-đồ-trình-tự-và-sơ-đồ-hoạt-động)
   - [3.1. Danh sách tên Use Case chi tiết (Use Case Specification List)](#31-danh-sách-tên-use-case-chi-tiết-use-case-specification-list)
   - [3.2. Danh sách tên Sơ đồ trình tự (Sequence Diagrams)](#32-danh-sách-tên-sơ-đồ-trình-tự-sequence-diagrams)
   - [3.3. Danh sách tên Sơ đồ hoạt động (Activity Diagrams)](#33-danh-sách-tên-sơ-đồ-hoạt-động-activity-diagrams)
   - [3.4. Bảng ánh xạ đối chiếu 1–1 (Use Case ↔ Sơ đồ trình tự ↔ Sơ đồ hoạt động)](#34-bảng-ánh-xạ-đối-chiếu-11-use-case--sơ-đồ-trình-tự--sơ-đồ-hoạt-động)

---

## 1. TỔNG QUAN CẤU TRÚC THƯ MỤC `src/app/screens`

Toàn bộ `85` file trong `src/app/screens` được tổ chức thành 6 phân khu rõ ràng:

| STT | Phân khu thư mục | Số lượng file | Vai trò & Đối tượng phục vụ |
| :-: | :--- | :-: | :--- |
| 1 | `screens/*.tsx` (`WelcomeScreen`, `LoginScreen`, `RegisterScreen`, `RoleSelectionScreen`, `Footer`) | 5 | Khởi động, xác thực tài khoản, chọn đối tượng học và thanh điều hướng đáy (Dùng chung). |
| 2 | `screens/context/*` (`SettingsScreen`, `RegionContext`, `api`, `index`) | 4 | Quản lý cài đặt hệ thống, hồ sơ cá nhân, chuyển đổi giọng đọc & từ vựng 3 miền Bắc – Trung – Nam, đổi ngôn ngữ, đăng xuất (Dùng chung). |
| 3 | `screens/life_topics/*` (`LifeTopicsScreen`, `TopicDetailScreen`) | 2 | Học từ vựng & phát âm sự vật đời sống (Trái cây, Động vật) qua Camera AI nhận diện vật thể thời gian thực (Dùng chung cho cả 2 đối tượng). |
| 4 | `screens/locales/*` (`courseStatic`, `uiLabels`, `localizedField`, `useLanguage`, `useAutoTranslate`, `useLocalization`) | 6 | Hệ thống đa ngôn ngữ (9 thứ tiếng) và dịch tự động phụ đề/nhãn giao diện (Phục vụ chính cho Người nước ngoài & Cài đặt chung). |
| 5 | `screens/primary_school_students/**` (`Header`, `Home_primary`, Tập đọc Lớp 1–3, Luyện viết Lớp 1–3, Chính tả Lớp 1–3) | 34 | Toàn bộ phân hệ học tập dành cho **Học sinh tiểu học từ Lớp 1 đến Lớp 3**. |
| 6 | `screens/foreigners/**` (`menu_survery`, `select_skill`, `survey/*`, `hoc_tieng_viet/**`) | 34 | Toàn bộ phân hệ khảo sát đầu vào và khóa học Tiếng Việt trình độ A1 dành cho **Người nước ngoài**. |

---

## 2. YÊU CẦU 1: LIỆT KÊ CHI TIẾT CÁC CHỨC NĂNG CHO 2 ĐỐI TƯỢNG NGƯỜI DÙNG

### 2.1. Nhóm chức năng dùng chung cho cả 2 đối tượng (`Học sinh tiểu học` & `Người nước ngoài`)

1. **Khởi động & Kiểm tra kết nối hệ thống (`WelcomeScreen.tsx`):**
   - Hiển thị giao diện giới thiệu ứng dụng *"Luyện Viết Chính Tả và Tập Đọc Tiếng Việt"*.
   - Tự động kiểm tra trạng thái kết nối tới Backend & CSDL MySQL (`GET /api/status`) và hiển thị huy hiệu trạng thái trực quan (tự ẩn sau 20 giây).
   - Điều hướng sang màn hình **Đăng nhập** hoặc **Đăng ký**.

2. **Đăng ký tài khoản mới tích hợp mã xác thực CAPTCHA (`RegisterScreen.tsx`):**
   - Nhập thông tin tạo tài khoản: `Email`, `Mật khẩu`, `Nhập lại mật khẩu`.
   - Tự động sinh mã CAPTCHA ngẫu nhiên 6 ký tự chữ và số, hỗ trợ nút làm mới mã CAPTCHA (`↻`).
   - Kiểm tra tính hợp lệ (khớp mật khẩu xác nhận, đúng mã CAPTCHA) trước khi hoàn tất đăng ký và chuyển sang màn hình Đăng nhập.
   - Hỗ trợ giao diện nút liên kết mạng xã hội (Google, Facebook).

3. **Đăng nhập tài khoản người dùng (`LoginScreen.tsx`):**
   - Nhập `Tên đăng nhập` và `Mật khẩu` (có nút bật/tắt hiển thị mật khẩu `👁️`, liên kết *Quên mật khẩu* và nút *Google/Facebook*).
   - Gửi yêu cầu xác thực (`POST /api/login`), kiểm tra phản hồi JSON an toàn, trích xuất `ho_ten` và đối tượng `user` để chuyển tới màn hình chọn vai trò.

4. **Lựa chọn vai trò / Đối tượng người học (`RoleSelectionScreen.tsx`):**
   - Tải danh sách đối tượng học từ CSDL (`GET /api/roles`).
   - Phân luồng người dùng vào đúng không gian học tập chuyên biệt:
     - Chọn **Học sinh tiểu học (`hoc_sinh_tieu_hoc`)** ➔ Điều hướng tới `HomePrimary` (`Home_primary.tsx`).
     - Chọn **Người nước ngoài (`nguoi_nuoc_ngoai`)** ➔ Điều hướng tới `MenuSurvey` (`menu_survery.tsx`).
     - *(Có định nghĩa sẵn mã mở rộng `giao_vien` trong cấu hình vai trò).*

5. **Điều hướng nhanh qua thanh công cụ dưới cùng (`Footer.tsx`):**
   - Chuyển nhanh về **Trang chủ chọn vai trò** (`RoleSelection`), mục **Bài học**, và mở màn hình **Cài đặt hệ thống** (`Settings`).

6. **Quản lý Hồ sơ cá nhân & Cài đặt hệ thống (`context/SettingsScreen.tsx`, `context/RegionContext.tsx`, `context/api.ts`):**
   - **Xem thông tin cá nhân (Modal Profile):** Hiển thị ảnh đại diện chữ cái đầu, Họ và tên, Vai trò người dùng, Lớp học hiện tại, Tên đăng nhập, Email liên hệ và Số điện thoại (đồng bộ với `AsyncStorage` `USER_INFO`).
   - **Đổi ngôn ngữ hiển thị & dịch thuật (Modal Language):** Tìm kiếm và chuyển đổi giữa 8 ngôn ngữ (Tiếng Việt, Tiếng Anh, Tiếng Hàn, Tiếng Nhật, Tiếng Trung, Tiếng Pháp, Tiếng Đức, Tiếng Nga – lưu vào `APP_LANGUAGE`).
   - **Chuyển đổi chế độ phương ngữ 3 vùng miền Bắc – Trung – Nam (`RegionContext`):**
     - Chỉ với 1 thao tác chạm để chọn **Miền Bắc** (Giọng TTS *Ban Mai – Hà Nội*), **Miền Trung** (Giọng TTS *Mỹ An – Huế/Đà Nẵng*) hoặc **Miền Nam** (Giọng TTS *Lan Nhi – Sài Gòn*).
     - Tự động lưu `APP_REGION`, gắn header `x-region` vào mọi request API qua Axios Interceptor, đồng thời tự động quy đổi văn bản dựa trên từ điển **33 bộ từ vựng 3 miền** thuộc 5 chủ đề (*Gia đình, Ẩm thực, Đồ vật, Động vật, Giao tiếp*) kèm chú thích đối chiếu vùng miền.
   - **Cài đặt âm thanh & nhắc nhở học tập:**
     - Bật/tắt chế độ *Tự động phát giọng đọc bài học* khi mở bài đọc/chính tả (`SETTING_AUTOPLAY`).
     - Bật/tắt *Hiệu ứng âm thanh tương tác*.
     - Bật/tắt *Nhắc nhở học tập mỗi ngày* lúc 19:30 tối (`SETTING_REMINDER`).
     - Xem phiên bản ứng dụng (`v1.0.0`) và mục Hỗ trợ & Hướng dẫn.
   - **Đăng xuất tài khoản:** Xác nhận đăng xuất, xóa thông tin phiên (`USER_INFO`, `USER_TOKEN`) khỏi bộ nhớ thiết bị và đặt lại luồng điều hướng (reset stack) về `LoginScreen`.

7. **Học từ vựng & Phát âm qua Camera AI nhận diện đồ vật – Chủ đề trong cuộc sống (`life_topics/LifeTopicsScreen.tsx`, `life_topics/TopicDetailScreen.tsx`):**
   - *(Được tích hợp trực tiếp tại cả Trang chủ Học sinh tiểu học `Home_primary.tsx` và Trang chủ Khóa học Người nước ngoài `hoc_tieng_viet/index.tsx`)*
   - **Chọn chủ đề khám phá (`LifeTopicsScreen.tsx`):**
     - Chủ đề 1: **Trái cây (Fruits)** – 5 sự vật: *Quả táo, Quả chuối, Quả cam, Quả dưa hấu, Quả nho*.
     - Chủ đề 2: **Động vật (Animals)** – 3 loài: *Con trâu, Sư tử, Con mèo*.
   - **Quét nhận diện vật thể bằng AI & Nghe phát âm (`TopicDetailScreen.tsx`):**
     - Xin quyền truy cập máy ảnh, hỗ trợ lật Camera trước/sau, hiển thị khung ngắm vuông chuẩn `200x200` với 4 góc định vị.
     - Cho phép **Chụp ảnh trực tiếp qua Camera** hoặc **Chọn ảnh có sẵn từ thư viện máy** để phân tích bằng mô hình AI (kết hợp phân tích phổ màu pixel, Roboflow Cloud Model v7 `nhan_dien_dovat/7` và API `/api/ai/detect-object`).
     - Vẽ khung bao nhận diện màu xanh lá (**Bounding Box**), hiển thị nhãn tên sự vật bằng tiếng Việt và chỉ số **Độ tin cậy (%)**.
     - Tự động đọc to tên sự vật bằng giọng chuẩn tiếng Việt (`expo-speech`), hỗ trợ nút nghe lại (`🔊`) và làm nổi bật dòng từ vựng tương ứng trong bảng bên dưới.
     - Hiển thị bảng từ vựng đối chiếu song ngữ (*STT | Ảnh minh họa | Tiếng Việt | Ngoại ngữ theo cài đặt | Nút Loa*) cho phép chạm vào bất kỳ sự vật nào để nghe phát âm ngay lập tức.

---

### 2.2. Nhóm chức năng dành riêng cho Học sinh tiểu học (Lớp 1 – Lớp 3)

*(Nằm trong thư mục `src/app/screens/primary_school_students/`)*

#### A. Quản lý Trang chủ Tiểu học & Chuyển đổi Khối lớp (`Home_primary.tsx`, `Header.tsx`)
1. **Hiển thị lời chào cá nhân hóa:** Chào tên học sinh và lớp đang theo học trên thanh tiêu đề.
2. **Chuyển đổi khối lớp linh hoạt (Lớp 1 – Lớp 2 – Lớp 3):**
   - Tải danh sách khối lớp (`GET /api/classes`) và tự động nạp tên chương trình học (*Tiếng Việt lớp 1/2/3 – Kết nối tri thức với cuộc sống*) cùng danh sách kỹ năng tương ứng (`GET /api/skills-by-class?lop=...`, có dữ liệu chuẩn offline dự phòng).
3. **Truy cập 4 nhóm kỹ năng cốt lõi của từng lớp:**
   - **Tập đọc** (Lớp 1, Lớp 2, Lớp 3)
   - **Luyện viết** (Lớp 1, Lớp 2, Lớp 3)
   - **Chính tả** (Lớp 1, Lớp 2, Lớp 3)
   - **Ôn tập** (Lớp 1, Lớp 2, Lớp 3 – hiển thị thông báo tính năng đang phát triển)
   - Khu vực truy cập nhanh **Chủ đề trong cuộc sống (Camera AI)**.

#### B. Nhóm chức năng Kỹ năng Tập đọc & Phát âm Tiểu học
1. **Tập đọc & Ghép vần Lớp 1 (`skills_reading_students/`):**
   - **Chọn danh mục tuần & chủ đề đọc (`practice_reading_class1.tsx`):** Chọn Tuần 1, Tuần 3, Tuần 5 hoặc Chủ đề 1.
   - **Luyện đọc âm, vần, tiếng và câu ngắn theo tuần (tích hợp âm thanh mẫu `expo-audio`):**
     - *Tuần 1 (`reading_week1_details.tsx` ➔ `reading_pronunciation_week1.tsx`):* Nghe phát âm chữ cái `a, b, c`; học mô hình cấu tạo âm tiết ghép vần (`b + a = ba`, `bà`, `ca`, `cá`) gắn với hình minh họa trực quan; luyện đọc câu ngắn (*"A, bà."*, *"A, cá."*).
     - *Tuần 3 (`reading_week3_details.tsx` ➔ `reading_pronunciation_week3.tsx`):* Nghe phát âm âm `i, k`; học bảng ghép ngang `k + i = ki`, `kì`; luyện đọc lưới từ có thanh điệu (`kí, kỉ, kĩ, kè, kẻ, kệ`); đọc từ khóa có tranh minh họa (`bí đỏ`, `kì đà`) và câu ứng dụng (*"Nam vẽ kì đà."*, *"Kì đà bò ở kẽ đá."*).
     - *Tuần 5 (`reading_week5_details.tsx` ➔ `reading_pronunciation_week5.tsx`):* Nghe phát âm âm `r, s`; học bảng ghép `ra, sẻ`; luyện đọc lưới 10 tiếng (`rạ, rế, rẻ, rẽ, rổ, sa, sả, sẽ, sổ, sò`); đọc 6 thẻ từ có hình (`rổ rá, cá rô, su su, chữ số, ốc sò, chim sẻ`) và các câu văn luyện tập.
   - **Tập đọc bài văn theo Chủ đề Lớp 1 (`reading_topic1_details.tsx` ➔ `reading_pronunciation_topic1.tsx`):**
     - Bài đọc *"Tôi là học sinh lớp 1"* (Trung Sơn) thiết kế theo **3 chế độ học**:
       1. *Chế độ 1 – Mẫu:* Nghe giọng đọc mẫu diễn cảm toàn bài.
       2. *Chế độ 2 – Hiểu từ khó:* Nhấn vào từ khó in đỏ có dấu `?` (`đồng phục`, `hãnh diện`, `chững chạc`) để mở cửa sổ Modal giải nghĩa dễ hiểu cho trẻ em đồng thời phát âm mẫu từ đó.
       3. *Chế độ 3 – Đọc theo mẫu:* Chạm vào từng đoạn/câu văn để nghe đọc mẫu từng phần và đọc nhại theo.

2. **Tập đọc & Đọc hiểu Lớp 2 (`skills_reading_class2students/`):**
   - **Chọn chủ điểm & tuần học (`practice_reading_class2.tsx` và các màn hình `reading_topic*_class2details*.tsx`):** Duyệt theo 4 chủ điểm (*Em lớn lên từng ngày*, *Đi học vui sao*, *Niềm vui tuổi thơ*, *Mái ấm gia đình*) ➔ chọn Tuần (Tuần 3, Tuần 5, Tuần 6) ➔ chọn Bài đọc cụ thể.
   - **Học chi tiết các bài Tập đọc văn xuôi & thơ Lớp 2 (đồng bộ CSDL `GET /api/bai-doc`, `GET /api/cau-hoi-bai-doc`):**
     - *Bài 5 – Tuần 3: "Em có xinh không?" (`readingpronunciation_bai5_week3.tsx`):* Gồm 3 chế độ (*1. Mẫu*, *2. Đọc theo mẫu từng đoạn*, *3. Tìm hiểu bài học* – nghe audio câu hỏi, bấm nút ẩn/hiện đáp án và nghe audio đáp án).
     - *Bài 6 – Tuần 3: "Một giờ học" (`readingpronunciation_bai6_week3.tsx`):* Gồm đầy đủ **4 chế độ** (*1. Mẫu*, *2. Hiểu từ khó* giải nghĩa từ `lúng túng`, `kiên nhẫn` qua Modal, *3. Hiểu từng đoạn*, *4. Tìm hiểu bài học* trả lời 3 câu hỏi đọc hiểu rút ra đại ý).
     - *Bài 9 – Tuần 5: Bài thơ "Cô giáo lớp em" (`readingpronunciation_bai9_week5.tsx`):* Gồm 3 chế độ (*1. Mẫu*, *2. Đọc từng khổ thơ*, *3. Tìm hiểu bài* với 3 câu hỏi – đáp án).
     - *Bài 11 – Tuần 6: Bài thơ "Cái trống trường em" (`readingpronunciation_bai11_week6.tsx`):* Gồm 3 chế độ (*1. Mẫu*, *2. Đọc từng khổ thơ*, *3. Tìm hiểu bài* với 3 câu hỏi – đáp án).

3. **Tập đọc & Đọc hiểu Lớp 3 (`skills_reading_class3students/`):**
   - **Chọn chủ đề & bài đọc Lớp 3 (`practice_reading_class3.tsx` ➔ `reading_topic1_class3details.tsx` ➔ `reading_topic1week3_class3details_bai2.tsx`):** Điều hướng theo Chủ đề 1 ➔ Tuần 3 – Bài 2.
   - **Học bài thơ *"Về thăm quê"* (`readingpronunciation_bai2_week3class3.tsx`):** Thiết kế đầy đủ **4 chế độ chuyên sâu**:
     1. *Mẫu:* Nghe đọc mẫu toàn bài thơ 4 khổ.
     2. *Hiểu từ khó:* Nhấn vào từ khó (`chập chờn`) để nghe phát âm và xem giải nghĩa trong Modal.
     3. *Hiểu từng khổ:* Bấm nghe và luyện đọc ngắt nhịp theo từng khổ thơ riêng biệt.
     4. *Tìm hiểu bài học:* Trả lời 3 câu hỏi đọc hiểu nội dung bài thơ, ẩn/hiện đáp án và nghe phát âm câu hỏi/đáp án.

#### C. Nhóm chức năng Kỹ năng Luyện viết chữ theo Video mẫu
1. **Luyện viết Lớp 1 (`skils_class1_writingpractice/`):**
   - Chọn tuần học (`writingpractice_class1.tsx`) ➔ Vào màn hình luyện viết chi tiết (`skils_writingpractice_week1detail.tsx`).
   - Mở hộp thoại lưới chọn chữ cái và từ luyện viết (`a, b, c, bà, cá, i, k, kì đà`).
   - Xem **Video hướng dẫn quy trình đặt bút – đưa nét** trên dòng kẻ ô ly (`expo-video`, hỗ trợ nút *Phát video / Tạm dừng*, chế độ *Picture-in-Picture*) để học sinh quan sát và viết theo vào vở.

2. **Luyện viết Lớp 2 (`skils_class2_writingpractice/`):**
   - Chọn chủ đề (`writingpractice_class2.tsx`) ➔ Vào màn hình luyện viết 3 chế độ (`skils_writingpractice_class2detail.tsx`):
     1. *Chế độ 1 – Viết chữ hoa:* Xem video hướng dẫn nét viết các chữ cái viết hoa (`A, Ă, Â, B, C, D`).
     2. *Chế độ 2 – Ứng dụng:* Xem video hướng dẫn viết cụm từ/câu ứng dụng (`a ứng dụng`).
     3. *Chế độ 3 – Luyện từ khó:* Xem video hướng dẫn viết từ khó (`lạt xạt`, `xuýt xoa`) kết hợp khung **Giải thích nghĩa của từ** hiển thị trực tiếp phía trên video.

3. **Luyện viết Lớp 3 (`skils_class3_writingpractice/writingpractice_class3.tsx`):**
   - Hiển thị danh mục chủ đề luyện viết chữ, từ, câu và đoạn văn ngắn dành cho học sinh Lớp 3 (thông báo cập nhật nội dung chi tiết).

#### D. Nhóm chức năng Kỹ năng Nghe – Viết Chính tả & Chấm điểm bài viết tay tự động (`skills_spelling_students/`)
- Triển khai đồng bộ cho cả 3 khối lớp: **Chính tả Lớp 1** (`skills_spelling_class1_students.tsx`), **Chính tả Lớp 2** (`skills_spelling_class2_students.tsx`), và **Chính tả Lớp 3** (`skills_spelling_class3_students.tsx`), kết nối CSDL qua `GET /api/chinh-ta-hs` và `POST /api/ket-qua-chinh-ta-hs`.
- Bao gồm **5 chức năng thành phần (5 Khung quy trình khép kín)**:
  1. **Nghe đọc chính tả (Khung 1 – Nghe):** Phát/Tạm dừng file âm thanh đọc bài chính tả, hiển thị thanh tiến trình thời gian thực và bộ đếm giây (`mm:ss`) để học sinh nghe và chép vào vở.
  2. **Nộp bài viết tay qua Camera hoặc Thư viện tệp (Khung 2 – Bài làm):**
     - Mở trực tiếp Camera phần cứng của thiết bị để chụp trang vở viết tay (cho phép xem trước ảnh chụp và nhấn *Chụp lại*), hoặc chọn ảnh/tệp PDF từ bộ nhớ thiết bị.
  3. **Đối chiếu văn bản gốc (Khung 3 – Đề bài gốc):** Hiển thị đoạn văn bản chuẩn từ CSDL để học sinh tự rà soát chữ viết và dấu câu.
  4. **Phát hiện và khoanh tròn lỗi chính tả trên hình ảnh (Khung 4 – Khoanh tròn chỗ sai):**
     - *Hiển thị thông minh có điều kiện:* Chỉ xuất hiện khi bài làm có lỗi sai; tự động ẩn nếu học sinh viết đúng hoàn toàn 100%.
     - Vẽ vòng khoanh tròn màu đỏ đánh dấu trực tiếp vị trí các chữ viết sai trên ảnh bài làm và trích xuất bảng đối chiếu từng lỗi (`Từ viết sai ❌ ➔ Từ chuẩn ✅`).
  5. **Chấm điểm, xếp loại học lực và lưu lịch sử kết quả (Khung 5 – Kết quả chấm điểm):**
     - Tự động tính điểm trên thang **10.0** (trừ `0.5` điểm/từ viết sai hoặc lệch số lượng từ mỗi dòng, giới hạn điểm trừ tối đa hợp lý).
     - Phân hạng kết quả chi tiết (`A+` Xuất sắc tuyệt đối, `A` Xuất sắc, `A-` Giỏi, `B+` Khá tốt, `B` Khá, `C` Trung bình, `D/F` Chưa hoàn thành) kèm lời nhận xét sư phạm của giáo viên và danh sách chi tiết các lỗi bị trừ điểm.
     - Tự động lưu toàn bộ kết quả chấm (điểm số, tổng từ sai, mảng chi tiết lỗi, văn bản nhận dạng, đường dẫn ảnh) vào bảng `ket_qua_chinh_ta_hs` trên MySQL.

---

### 2.3. Nhóm chức năng dành riêng cho Người nước ngoài (Trình độ A1)

*(Nằm trong thư mục `src/app/screens/foreigners/` và `src/app/screens/locales/`)*

#### A. Hệ thống Đa ngôn ngữ & Dịch tự động Giao diện (`locales/*`)
1. **Hỗ trợ 9 ngôn ngữ hiển thị & giải nghĩa:** Tiếng Anh (`en` – mặc định), Tiếng Hàn (`ko`), Tiếng Nhật (`ja`), Tiếng Trung (`zh-CN`), Tiếng Pháp (`fr`), Tiếng Đức (`de`), Tiếng Nga (`ru`), Tiếng Tây Ban Nha (`es`) và Tiếng Việt (`vi`).
2. **Cơ chế dịch tự động hai chiều Client – Server:**
   - Tự động đính kèm header `x-lang` vào mọi yêu cầu `fetch` gửi tới Backend để nhận nội dung bài học đã dịch tương ứng.
   - Hook `useAutoTranslate` tự động gom nhóm (debounce/batch) các chuỗi văn bản phụ đề và gọi `POST /api/translate` kèm bộ nhớ đệm (`cache`) giúp chuyển đổi ngôn ngữ mượt mà mà không làm thay đổi từ gốc tiếng Việt cần học.

#### B. Khảo sát Cá nhân hóa Đầu vào 7 Bước (`menu_survery.tsx`, `survey/*`)
- Sử dụng bố cục chuẩn `SurveyLayout.tsx` với thanh tiến trình trực quan (`1/7` đến `7/7`), nút quay lại bước trước và nút **Bỏ qua (Skip)** (từ bước 3 đến bước 6) để vào thẳng khóa học bất cứ lúc nào:
  1. **Bước 1 – Chọn ngôn ngữ mẹ đẻ / ngôn ngữ dẫn đường (`language.tsx`):** Tìm kiếm ngôn ngữ theo tên bản ngữ hoặc tiếng Việt, cập nhật ngôn ngữ giao diện ngay tức thì khi chạm chọn và lưu vào `AsyncStorage`.
  2. **Bước 2 – Chọn nhóm độ tuổi (`age.tsx`):** Lựa chọn 1 trong 6 nhóm tuổi (*Dưới 18, 18–24, 25–34, 35–44, 45–54, 55+*) để gợi ý ngữ cảnh giao tiếp phù hợp.
  3. **Bước 3 – Xác định trình độ tiếng Việt hiện tại (`level_vn.tsx`):** Mặc định chọn trình độ mục tiêu **A1 – Nhập môn (Beginner)** (kèm mô tả các bậc tham chiếu A2, B1–B2, C1–C2).
  4. **Bước 4 – Chọn mục tiêu mong muốn đạt được (`desire.tsx`):** Học nền tảng cơ bản, Tự tin giao tiếp hàng ngày, Du lịch & sinh sống tại Việt Nam, Phục vụ công việc, hoặc Khám phá văn hóa.
  5. **Bước 5 – Chọn động lực / lý do học chính (`reason.tsx`):** Du lịch, Giao tiếp gia đình & bạn bè, Cơ hội nghề nghiệp, Học thuật & du học, Rèn luyện trí não, hoặc Lý do khác.
  6. **Bước 6 – Chọn phong cách học tập (`style_foreigners.tsx`):** Nghe & Luyện nói phản xạ, Đọc & Trực quan hình ảnh, Vừa học vừa chơi tương tác (Gamified), hoặc Ngữ pháp & Cấu trúc bài bản.
  7. **Bước 7 – Thiết lập mục tiêu thời gian luyện tập hàng ngày (`practice.tsx`):** Chọn mức cam kết (*5 phút, 15 phút, 30 phút, 60 phút/ngày*) và nhấn *"Bắt đầu học ngay"* để vào chương trình học Tiếng Việt A1 (`HocTiengViet`).

#### C. Trang chủ Chương trình học Tiếng Việt A1 & Bản đồ Lộ trình (`hoc_tieng_viet/index.tsx`, `DuolingoRoadmap.tsx`, `SkillMenuScreen.tsx`)
1. **Trung tâm điều phối khóa học (`hoc_tieng_viet/index.tsx`):**
   - Hiển thị 3 Phần học cốt lõi trình độ A1 (**Phần 1: Ngữ âm và chữ viết**, **Phần 2: Luyện Phát âm**, **Phần 3: Bài học theo chủ đề**).
   - Truy cập chuyên mục đặc biệt **Bảng từ vựng (Vocabulary Table)**.
   - Truy cập trực tiếp khu vực **Chủ đề đời sống (Life Topics – AI Camera)** cho người nước ngoài học từ vựng thực tế qua hình ảnh.
2. **Bản đồ lộ trình bài học kiểu Duolingo (`DuolingoRoadmap.tsx`):**
   - Trực quan hóa tiến độ từng bài học dưới dạng các nút tròn nối tiếp có hiệu ứng nhịp đập (`PulseAnim`) cho bài đang học, trạng thái hoàn thành (`✅`) hoặc khóa (`🔒`).
3. **Menu 6 Kỹ năng của từng Bài học (`SkillMenuScreen.tsx`, `BaseSkillContent.tsx`):**
   - Tải thông tin bài học động từ `GET /api/nn/bai-hoc/:baiHocId/ky-nang` và điều hướng vào 6 kỹ năng thành phần (kèm các nhánh kỹ năng con `1.1`, `1.2`, `1.3`, `3.1`, `3.2`).

#### D. PHẦN 1: Học Ngữ âm và Chữ viết Tiếng Việt nền tảng (`hoc_tieng_viet/phan1/`)
1. **Bài 1 – Bảng chữ cái tiếng Việt (`phan1/bai1.tsx`):**
   - Hiển thị lưới chữ cái tiếng Việt (cả chữ hoa và chữ thường).
   - Chạm vào từng chữ cái để nghe phát âm chuẩn (`expo-audio`), phân biệt trực quan bằng màu đỏ kèm ghi chú song ngữ đối với các ký tự không phát âm độc lập (`Ă`, `Â`).
2. **Bài 2 – Nguyên âm và Phụ âm (`phan1/bai2.tsx`):**
   - **Chế độ Nguyên âm (Vowels):** Giải thích lý thuyết song ngữ Việt – Anh về nguyên âm đơn và nguyên âm đôi, minh họa sơ đồ hình thang vị trí lưỡi/độ mở miệng, và lưới thẻ bấm nghe luyện đọc 16 nguyên âm/tổ hợp nguyên âm.
   - **Chế độ Phụ âm (Consonants):** Phân loại chi tiết 11 nhóm phụ âm theo vị trí và phương thức cấu âm (`2.1` – `2.11`), cung cấp **Bảng tra cứu 23 âm vị IPA – Chữ viết – Cách phát âm – Nút nghe âm thanh**, và lưới luyện đọc nhanh các phụ âm đơn/kép.
3. **Bài 3 – Hệ thống 6 Thanh điệu (`phan1/bai3.tsx`):**
   - Trình bày lý thuyết hệ thống thanh điệu tiếng Việt, bảng ma trận phân loại *Âm vực (Cao/Thấp) × Đường nét (Bằng/Trắc)*, lưu ý đặc trưng phương ngữ Nam Bộ.
   - Nghe phát âm mẫu 6 thanh trên âm tiết chuẩn (`ba, bà, bá, bả, bã, bạ`) và thực hành đọc 52 dòng tổ hợp thanh điệu mở rộng.

#### E. PHẦN 2: Luyện Phát âm Cấu trúc Âm tiết (`hoc_tieng_viet/phan2/`)
- Tải danh sách bài học động từ `GET /api/bai-hoc-nn?loai_phan=phat_am`, bao gồm:
  - **Bài 1 (`phan2/bai1.tsx`):** Âm đầu / Ngữ cảnh *Gặp nhau ở sân bay* (`lessonId = 10`).
  - **Bài 2 (`phan2/bai2.tsx`):** Âm cuối (`lessonId = 11`).
  - **Bài 3 (`phan2/bai3.tsx`):** Âm đệm và âm chính (`lessonId = 12`).
  - **Bài 4 (`phan2/bai4.tsx`):** Luyện tập tổng hợp ngữ âm (`lessonId = 13`).
  - *(Các Bài 1 – 4 kết nối trực tiếp vào bộ 6 màn hình kỹ năng thực hành).*
  - **Bài 5 (`phan2/bai5.tsx`):** **Bài tập tổng hợp Phần 2** (`bai_hoc_id = 14`) – Kiểm tra toàn diện qua 5 nhóm bài tập lớn / 14 dạng câu hỏi tương tác.

#### F. PHẦN 3: Học Tiếng Việt Giao tiếp theo Chủ đề A1 (`hoc_tieng_viet/phan3/`)
- Tải lộ trình chủ đề từ `GET /api/bai-hoc-nn?loai_phan=chu_de` hiển thị trên sơ đồ zíc-zắc trực quan:
  - **Chủ đề 1 (`phan3/bai1.tsx`):** *"Xin lỗi, anh tên gì?"* – Làm quen, chào hỏi và giới thiệu tên (`lessonId = 5`).
  - **Chủ đề 2 (`phan3/bai2.tsx`):** *"Cô là người nước nào?"* – Hỏi đáp quốc tịch và đất nước (`lessonId = 6`).
  - **Chủ đề 3 (`phan3/bai3.tsx`):** *"Dạo này bạn làm gì? / Anh làm nghề gì?"* – Hỏi đáp nghề nghiệp và nơi làm việc (`lessonId = 7`).
  - **Chủ đề 4 (`phan3/bai4.tsx`):** *"Bây giờ cô sống ở đâu? / Nhà bạn ở đâu?"* – Hỏi đáp địa chỉ, nơi cư trú và khoảng cách (`lessonId = 8`).
  - *(Các Chủ đề 1 – 4 đều tích hợp đầy đủ 6 kỹ năng thực hành).*
  - **Chủ đề 5 (`phan3/bai5.tsx`):** **Bài tập tổng hợp Chủ đề 1 đến Chủ đề 4** (`bai_hoc_id = 9`, ngân hàng 50 câu hỏi chia thành 5 phân mục / 14 dạng tương tác).

#### G. Bộ 6 Kỹ năng Rèn luyện Chuyên sâu cho từng Bài học (`hoc_tieng_viet/skills/`)
*(Dùng chung cho toàn bộ các bài học thuộc Phần 2 và Phần 3, nạp dữ liệu động từ `GET /api/nn/bai-hoc/:baiHocId/ky-nang/:kyNangId`)*

1. **Kỹ năng 1 – Phát âm (`skills/phat_am.tsx`):**
   - *Tab 1.1 – Tập phát âm:* Học các cụm âm vị trọng tâm, nghe mẫu và xem mẹo phát âm song ngữ.
   - *Tab 1.2 – Ghép âm:* Thực hành ghép phụ âm đầu với nguyên âm tạo thành các âm tiết tiếng Việt.
   - *Tab 1.3 – Thanh điệu:* Luyện phân biệt 6 dấu thanh gắn với từ vựng cụ thể và nghĩa dịch.
2. **Kỹ năng 2 – Nghe và lặp lại (`skills/nghe_lap_lai.tsx`):**
   - Nghe phát âm từng câu giao tiếp mẫu kèm nghĩa dịch, bấm nút thu âm/luyện nói (`🎤 Nhấn để đọc`), theo dõi thanh chấm tiến độ câu và chuyển đổi *Câu trước / Câu sau*.
3. **Kỹ năng 3 – Tập đọc (`skills/tap_doc.tsx`):**
   - *Tab 3.1 – Đọc các chữ:* Chạm vào từng từ đơn trong lưới để phóng to từ, nghe phát âm chuẩn và luyện đọc các câu mẫu song ngữ.
   - *Tab 3.2 – Tập đối thoại:* Nghe toàn bộ hội thoại và luyện đọc phân vai (Nhân vật A – Nhân vật B) trên giao diện hội thoại bong bóng kèm bản dịch dưới mỗi câu.
4. **Kỹ năng 4 – Ngữ pháp (`skills/ngu_phap.tsx`):**
   - Phân tích cấu trúc câu tiếng Việt bằng sơ đồ khối màu (*Chủ ngữ + Vị ngữ + Tân ngữ*), học các quy tắc ngữ pháp cốt lõi kèm dịch nghĩa từng từ (*Literal translation*), và làm bài **Quick Quiz** trắc nghiệm kiểm tra hiểu bài ngay tại chỗ.
5. **Kỹ năng 5 – Nhận diện và thay thế (`skills/nhan_dien.tsx`):**
   - Chạm chọn các từ thay thế để ghép động vào khung mẫu câu giao tiếp; xem phân tích thành phần câu bằng thẻ màu; làm bài tập điền từ vào chỗ trống có nút bật/tắt xem đáp án chuẩn.
6. **Kỹ năng 6 – Viết chính tả dành cho người nước ngoài (`skills/chinh_ta.tsx`):**
   - Nghe phát âm từ/cụm từ kết hợp xem gợi ý nghĩa ngoại ngữ, gõ lại từ tiếng Việt có dấu thanh vào ô nhập liệu, hệ thống chấm Đúng/Sai tức thì, hiển thị đáp án chuẩn nếu viết sai, cộng điểm (`Score`) theo tiến độ và cung cấp mẹo gõ dấu tiếng Việt.

#### H. Làm Bài tập Tổng hợp & Kiểm tra Đánh giá 5 Nhóm / 14 Dạng (`phan2/bai5.tsx` & `phan3/bai5.tsx`)
- Tải ngân hàng câu hỏi từ `GET /api/cau-hoi-nn`, chấm điểm tự động từng phần và yêu cầu **Làm lại (Retry)** nếu còn câu sai:
  1. **Nhóm 1 – Trắc nghiệm (`tracNghiem`):** Chọn phương án đúng A, B, C, D.
  2. **Nhóm 2 – Điền từ (`dienTu`):**
     - *Dạng 1:* Chọn từ cho sẵn trong ngân hàng từ (`wordBank`) điền vào chỗ trống.
     - *Dạng 2:* Nhìn biểu tượng/hình minh họa và gợi ý để gõ từ tiếng Việt.
     - *Dạng 3:* Chạm sắp xếp các chữ cái xáo trộn để ghép thành từ tiếng Việt đúng.
  3. **Nhóm 3 – Ngữ pháp (`nguPhap`):**
     - *Dạng 1:* Chọn từ ngữ pháp phù hợp điền vào câu khuyết.
     - *Dạng 2:* Đọc câu gốc và gõ từ/cụm từ viết lại câu tương đương.
     - *Dạng 3:* Chạm sắp xếp các từ xáo trộn thành câu hoàn chỉnh đúng trật tự ngữ pháp.
     - *Dạng 4:* Nhìn hình ảnh minh họa và sắp xếp các từ cho sẵn thành câu mô tả đúng.
  4. **Nhóm 4 – Hội thoại (`hoiThoai`):**
     - *Dạng 1:* Đọc lời thoại gợi mở và chọn câu hồi đáp đúng nhất (trắc nghiệm hội thoại).
     - *Dạng 2:* Sắp xếp các câu thoại bị xáo trộn theo đúng trình tự giao tiếp hợp lý bằng nút điều chỉnh lên/xuống (`▲` / `▼`).
     - *Dạng 3:* Chọn từ thích hợp điền vào chỗ trống trong đoạn hội thoại.
  5. **Nhóm 5 – Nghe hiểu & Điền từ (`nghe`):**
     - *Dạng 1:* Nghe câu phát âm và chọn đáp án trắc nghiệm đúng.
     - *Dạng 2:* Nghe câu phát âm và tự gõ từ còn thiếu vào chỗ trống.
     - *Dạng 3:* Nghe từ/câu phát âm và chọn đúng hình ảnh/biểu tượng tương ứng.

#### I. Tra cứu Từ điển / Bảng từ vựng theo Bài học (`hoc_tieng_viet/tu_vung/index.tsx`, `bang_tu_vung.tsx`)
- Chọn bài học từ vựng (Bài 1 đến Bài 4) kèm bảng giải thích ký hiệu từ loại (`N`, `V`, `ADJ`, `ADV`).
- Xem danh sách từ vựng 3 cột (*Tiếng Việt | Từ loại | Nghĩa ngoại ngữ*) đồng bộ từ `GET /api/tu-vung`, tìm kiếm tức thời theo từ khóa song ngữ và lọc danh sách từ theo từng nhãn từ loại.

---

## 3. YÊU CẦU 2: DANH SÁCH CHI TIẾT USE CASE, SƠ ĐỒ TRÌNH TỰ VÀ SƠ ĐỒ HOẠT ĐỘNG

> **Quy ước đặt mã chuẩn báo cáo tốt nghiệp:**
> - **`UC-CHUNG-xx` / `SD-CHUNG-xx` / `AD-CHUNG-xx`:** Phân hệ dùng chung cho cả 2 đối tượng (`Học sinh tiểu học` và `Người nước ngoài A1`).
> - **`UC-HSTH-xx` / `SD-HSTH-xx` / `AD-HSTH-xx`:** Phân hệ dành cho Actor **Học sinh tiểu học (Lớp 1 – Lớp 3)**.
> - **`UC-NNN-xx` / `SD-NNN-xx` / `AD-NNN-xx`:** Phân hệ dành cho Actor **Người nước ngoài (Trình độ A1)**.

---

### 3.1. Danh sách tên Use Case chi tiết (Use Case Specification List)

#### A. Nhóm Use Case Dùng chung (Áp dụng cho cả `Học sinh tiểu học` & `Người nước ngoài A1`) — 10 Use Case

| Mã UC | Tên Use Case chi tiết | Tác nhân (Actor) | Màn hình mã nguồn (`src/app/screens/...`) |
| :---: | :--- | :--- | :--- |
| **UC-CHUNG-01** | Khởi động ứng dụng và kiểm tra kết nối hệ thống | Học sinh tiểu học, Người nước ngoài | `WelcomeScreen.tsx` |
| **UC-CHUNG-02** | Đăng ký tài khoản người dùng mới (kèm xác thực CAPTCHA) | Học sinh tiểu học, Người nước ngoài | `RegisterScreen.tsx` |
| **UC-CHUNG-03** | Đăng nhập hệ thống | Học sinh tiểu học, Người nước ngoài | `LoginScreen.tsx` |
| **UC-CHUNG-04** | Lựa chọn vai trò đối tượng người học | Học sinh tiểu học, Người nước ngoài | `RoleSelectionScreen.tsx` |
| **UC-CHUNG-05** | Xem thông tin hồ sơ cá nhân | Học sinh tiểu học, Người nước ngoài | `context/SettingsScreen.tsx` |
| **UC-CHUNG-06** | Thay đổi ngôn ngữ hiển thị và dịch thuật | Người nước ngoài, Học sinh tiểu học | `context/SettingsScreen.tsx`, `locales/*` |
| **UC-CHUNG-07** | Chuyển đổi chế độ giọng đọc và từ vựng 3 vùng miền (Bắc – Trung – Nam) | Học sinh tiểu học, Người nước ngoài | `context/SettingsScreen.tsx`, `context/RegionContext.tsx` |
| **UC-CHUNG-08** | Cấu hình âm thanh bài học và nhắc nhở học tập hàng ngày | Học sinh tiểu học, Người nước ngoài | `context/SettingsScreen.tsx` |
| **UC-CHUNG-09** | Đăng xuất tài khoản khỏi hệ thống | Học sinh tiểu học, Người nước ngoài | `context/SettingsScreen.tsx` |
| **UC-CHUNG-10** | Nhận diện sự vật qua Camera AI và nghe phát âm theo chủ đề cuộc sống (Trái cây, Động vật) | Học sinh tiểu học, Người nước ngoài | `life_topics/LifeTopicsScreen.tsx`, `life_topics/TopicDetailScreen.tsx` |

#### B. Nhóm Use Case cho Đối tượng 1: `Học sinh tiểu học` (Lớp 1 – Lớp 3) — 12 Use Case

| Mã UC | Tên Use Case chi tiết | Tác nhân (Actor) | Màn hình mã nguồn (`src/app/screens/primary_school_students/...`) |
| :---: | :--- | :--- | :--- |
| **UC-HSTH-01** | Xem trang chủ tiểu học và chuyển đổi khối lớp (Lớp 1, Lớp 2, Lớp 3) | Học sinh tiểu học | `Home_primary.tsx`, `Header.tsx` |
| **UC-HSTH-02** | Lựa chọn kỹ năng học tập theo chương trình khối lớp | Học sinh tiểu học | `Home_primary.tsx` |
| **UC-HSTH-03** | Luyện đọc âm, vần, tiếng và câu ứng dụng Lớp 1 theo tuần học | Học sinh tiểu học (Lớp 1) | `skills_reading_students/practice_reading_class1.tsx`, `reading_week1/3/5_details.tsx`, `reading_pronunciation_week1/3/5.tsx` |
| **UC-HSTH-04** | Tập đọc bài văn theo chủ đề Lớp 1 (Đọc mẫu, Giải nghĩa từ khó, Đọc từng đoạn) | Học sinh tiểu học (Lớp 1) | `skills_reading_students/reading_topic1_details.tsx`, `reading_pronunciation_topic1.tsx` |
| **UC-HSTH-05** | Tập đọc và tìm hiểu bài đọc Lớp 2 theo chủ điểm và tuần học | Học sinh tiểu học (Lớp 2) | `skills_reading_class2students/practice_reading_class2.tsx`, `reading_topic*_class2details*.tsx`, `readingpronunciation_bai5/6/9/11_*.tsx` |
| **UC-HSTH-06** | Tập đọc và tìm hiểu bài thơ Lớp 3 theo chủ đề (4 chế độ đọc hiểu) | Học sinh tiểu học (Lớp 3) | `skills_reading_class3students/practice_reading_class3.tsx`, `reading_topic1*.tsx`, `readingpronunciation_bai2_week3class3.tsx` |
| **UC-HSTH-07** | Giải nghĩa và nghe phát âm từ khó trong bài Tập đọc | Học sinh tiểu học (Lớp 1–3) | `reading_pronunciation_topic1.tsx`, `readingpronunciation_bai6_week3.tsx`, `readingpronunciation_bai2_week3class3.tsx` |
| **UC-HSTH-08** | Trả lời câu hỏi đọc hiểu và nghe âm thanh đáp án bài Tập đọc | Học sinh tiểu học (Lớp 2–3) | `readingpronunciation_bai5/6/9/11_*.tsx`, `readingpronunciation_bai2_week3class3.tsx` |
| **UC-HSTH-09** | Luyện viết chữ thường và từ vựng Lớp 1 qua video hướng dẫn nét viết | Học sinh tiểu học (Lớp 1) | `skils_class1_writingpractice/writingpractice_class1.tsx`, `skils_writingpractice_week1detail.tsx` |
| **UC-HSTH-10** | Luyện viết chữ hoa, câu ứng dụng và từ khó Lớp 2 qua video hướng dẫn | Học sinh tiểu học (Lớp 2) | `skils_class2_writingpractice/writingpractice_class2.tsx`, `skils_writingpractice_class2detail.tsx` |
| **UC-HSTH-11** | Xem danh mục chủ đề luyện viết đoạn văn Lớp 3 | Học sinh tiểu học (Lớp 3) | `skils_class3_writingpractice/writingpractice_class3.tsx` |
| **UC-HSTH-12** | Nghe – viết chính tả vào vở, chụp ảnh bài làm và chấm điểm viết tay tự động (Lớp 1, 2, 3) | Học sinh tiểu học (Lớp 1–3) | `skills_spelling_students/skills_spelling_class1/2/3_students.tsx` |

#### C. Nhóm Use Case cho Đối tượng 2: `Người nước ngoài` (Trình độ A1) — 16 Use Case

| Mã UC | Tên Use Case chi tiết | Tác nhân (Actor) | Màn hình mã nguồn (`src/app/screens/foreigners/...`) |
| :---: | :--- | :--- | :--- |
| **UC-NNN-01** | Thực hiện khảo sát cá nhân hóa lộ trình học đầu vào (7 bước) | Người nước ngoài (A1) | `menu_survery.tsx`, `survey/SurveyLayout.tsx`, `language.tsx`, `age.tsx`, `level_vn.tsx`, `desire.tsx`, `reason.tsx`, `style_foreigners.tsx`, `practice.tsx` |
| **UC-NNN-02** | Bỏ qua khảo sát đầu vào để truy cập nhanh chương trình học Tiếng Việt A1 | Người nước ngoài (A1) | `survey/SurveyLayout.tsx` (`level_vn`, `desire`, `reason`, `style_foreigners`) |
| **UC-NNN-03** | Xem tổng quan chương trình học Tiếng Việt A1 và chọn phần học | Người nước ngoài (A1) | `hoc_tieng_viet/index.tsx` |
| **UC-NNN-04** | Theo dõi bản đồ lộ trình bài học (Roadmap) và chọn bài học trong từng phần | Người nước ngoài (A1) | `hoc_tieng_viet/DuolingoRoadmap.tsx`, `phan1/index.tsx`, `phan2/index.tsx`, `phan3/index.tsx` |
| **UC-NNN-05** | Học và nghe phát âm Bảng chữ cái tiếng Việt (Phần 1 – Bài 1) | Người nước ngoài (A1) | `hoc_tieng_viet/phan1/bai1.tsx` |
| **UC-NNN-06** | Học lý thuyết cấu âm, bảng IPA và luyện đọc Nguyên âm – Phụ âm (Phần 1 – Bài 2) | Người nước ngoài (A1) | `hoc_tieng_viet/phan1/bai2.tsx` |
| **UC-NNN-07** | Học lý thuyết hệ thống 6 Thanh điệu và luyện đọc tổ hợp thanh điệu (Phần 1 – Bài 3) | Người nước ngoài (A1) | `hoc_tieng_viet/phan1/bai3.tsx` |
| **UC-NNN-08** | Chọn bài học Luyện phát âm (Phần 2) hoặc Chủ đề giao tiếp A1 (Phần 3) và mở menu 6 kỹ năng | Người nước ngoài (A1) | `hoc_tieng_viet/SkillMenuScreen.tsx`, `phan2/bai1..4.tsx`, `phan3/bai1..4.tsx` |
| **UC-NNN-09** | Luyện Kỹ năng 1: Phát âm (Tập phát âm cơ bản, Ghép tổ hợp âm, Thanh điệu) | Người nước ngoài (A1) | `hoc_tieng_viet/skills/phat_am.tsx` |
| **UC-NNN-10** | Luyện Kỹ năng 2: Nghe câu giao tiếp mẫu và ghi âm lặp lại | Người nước ngoài (A1) | `hoc_tieng_viet/skills/nghe_lap_lai.tsx` |
| **UC-NNN-11** | Luyện Kỹ năng 3: Tập đọc từ vựng, câu mẫu và thực hành đối thoại phân vai | Người nước ngoài (A1) | `hoc_tieng_viet/skills/tap_doc.tsx` |
| **UC-NNN-12** | Luyện Kỹ năng 4: Học cấu trúc ngữ pháp câu và làm bài trắc nghiệm nhanh (Quick Quiz) | Người nước ngoài (A1) | `hoc_tieng_viet/skills/ngu_phap.tsx` |
| **UC-NNN-13** | Luyện Kỹ năng 5: Nhận diện thành phần câu, thay thế từ trong mẫu câu và điền khuyết | Người nước ngoài (A1) | `hoc_tieng_viet/skills/nhan_dien.tsx` |
| **UC-NNN-14** | Luyện Kỹ năng 6: Nghe và gõ viết chính tả từ/cụm từ tiếng Việt có chấm điểm | Người nước ngoài (A1) | `hoc_tieng_viet/skills/chinh_ta.tsx` |
| **UC-NNN-15** | Làm bài kiểm tra tổng hợp đa dạng thức (Trắc nghiệm, Điền từ, Ngữ pháp, Hội thoại, Nghe hiểu) cuối Phần 2 & Phần 3 | Người nước ngoài (A1) | `hoc_tieng_viet/phan2/bai5.tsx`, `hoc_tieng_viet/phan3/bai5.tsx` |
| **UC-NNN-16** | Tra cứu, tìm kiếm và lọc Bảng từ vựng song ngữ theo bài học và từ loại (`N, V, ADJ, ADV`) | Người nước ngoài (A1) | `hoc_tieng_viet/tu_vung/index.tsx`, `hoc_tieng_viet/tu_vung/bang_tu_vung.tsx` |

---

### 3.2. Danh sách tên Sơ đồ trình tự (Sequence Diagrams)

#### A. Nhóm Sơ đồ trình tự Dùng chung (2 đối tượng) — 8 Sơ đồ
1. **SD-CHUNG-01:** Sơ đồ trình tự Khởi động ứng dụng và kiểm tra trạng thái kết nối Backend/MySQL.
2. **SD-CHUNG-02:** Sơ đồ trình tự Đăng ký tài khoản mới và xác thực mã CAPTCHA.
3. **SD-CHUNG-03:** Sơ đồ trình tự Đăng nhập hệ thống và tải danh sách vai trò người học.
4. **SD-CHUNG-04:** Sơ đồ trình tự Lựa chọn vai trò đối tượng học và điều hướng phân hệ.
5. **SD-CHUNG-05:** Sơ đồ trình tự Xem hồ sơ cá nhân, thay đổi ngôn ngữ dịch và cấu hình cài đặt ứng dụng.
6. **SD-CHUNG-06:** Sơ đồ trình tự Chuyển đổi vùng miền (Bắc – Trung – Nam) đồng bộ giọng đọc và từ vựng toàn hệ thống.
7. **SD-CHUNG-07:** Sơ đồ trình tự Quét nhận diện vật thể bằng Camera AI (Roboflow/Backend) và phát âm từ vựng Chủ đề cuộc sống.
8. **SD-CHUNG-08:** Sơ đồ trình tự Đăng xuất tài khoản và xóa phiên làm việc cục bộ.

#### B. Nhóm Sơ đồ trình tự cho `Học sinh tiểu học` (Lớp 1 – Lớp 3) — 8 Sơ đồ
1. **SD-HSTH-01:** Sơ đồ trình tự Xem trang chủ tiểu học, chuyển đổi khối lớp (Lớp 1–3) và tải danh sách kỹ năng theo lớp.
2. **SD-HSTH-02:** Sơ đồ trình tự Luyện đọc đánh vần âm, vần, tiếng và câu ứng dụng Lớp 1 theo tuần học.
3. **SD-HSTH-03:** Sơ đồ trình tự Tập đọc văn bản theo chủ đề Lớp 1 và tra cứu giải nghĩa từ khó.
4. **SD-HSTH-04:** Sơ đồ trình tự Tập đọc bài học Lớp 2 (Tải nội dung bài đọc, câu hỏi từ CSDL, nghe đọc mẫu và trả lời câu hỏi đọc hiểu).
5. **SD-HSTH-05:** Sơ đồ trình tự Tập đọc bài thơ Lớp 3 theo 4 chế độ (Đọc mẫu, Hiểu từ khó, Đọc từng khổ, Tìm hiểu bài học).
6. **SD-HSTH-06:** Sơ đồ trình tự Luyện viết chữ cái và từ vựng Lớp 1 qua trình phát video mẫu.
7. **SD-HSTH-07:** Sơ đồ trình tự Luyện viết chữ hoa, câu ứng dụng và giải nghĩa từ khó Lớp 2 qua video hướng dẫn.
8. **SD-HSTH-08:** Sơ đồ trình tự Nghe – viết chính tả, chụp/tải ảnh bài làm viết tay, khoanh tròn lỗi sai và lưu kết quả chấm điểm Tiểu học (Lớp 1–3).

#### C. Nhóm Sơ đồ trình tự cho `Người nước ngoài` (Trình độ A1) — 12 Sơ đồ
1. **SD-NNN-01:** Sơ đồ trình tự Thực hiện khảo sát đầu vào 7 bước và lưu thiết lập ngôn ngữ cho người nước ngoài.
2. **SD-NNN-02:** Sơ đồ trình tự Duyệt chương trình học Tiếng Việt A1 và tải lộ trình bài học theo phần (`Phan1`, `Phan2`, `Phan3`).
3. **SD-NNN-03:** Sơ đồ trình tự Học Ngữ âm nền tảng Phần 1 (Bảng chữ cái, Nguyên âm – Phụ âm IPA và Hệ thống 6 Thanh điệu).
4. **SD-NNN-04:** Sơ đồ trình tự Chọn bài học Phần 2 / Phần 3 và tải danh mục 6 kỹ năng thực hành từ CSDL.
5. **SD-NNN-05:** Sơ đồ trình tự Thực hành Kỹ năng 1 – Phát âm (Tập phát âm, Ghép tổ hợp âm và Thanh điệu).
6. **SD-NNN-06:** Sơ đồ trình tự Thực hành Kỹ năng 2 – Nghe câu giao tiếp mẫu và ghi âm lặp lại.
7. **SD-NNN-07:** Sơ đồ trình tự Thực hành Kỹ năng 3 – Tập đọc từ, câu mẫu và hội thoại phân vai.
8. **SD-NNN-08:** Sơ đồ trình tự Thực hành Kỹ năng 4 – Học cấu trúc Ngữ pháp và kiểm tra nhanh (Quick Quiz).
9. **SD-NNN-09:** Sơ đồ trình tự Thực hành Kỹ năng 5 – Nhận diện cấu trúc, thay thế từ vào mẫu câu và điền khuyết.
10. **SD-NNN-10:** Sơ đồ trình tự Thực hành Kỹ năng 6 – Nghe và gõ viết chính tả tiếng Việt cho người nước ngoài.
11. **SD-NNN-11:** Sơ đồ trình tự Tải ngân hàng câu hỏi và chấm điểm Bài tập tổng hợp cuối Phần 2 & Phần 3 (5 nhóm bài tập / 14 dạng).
12. **SD-NNN-12:** Sơ đồ trình tự Tra cứu, tìm kiếm và lọc Bảng từ vựng song ngữ kết hợp dịch tự động đa ngôn ngữ.

---

### 3.3. Danh sách tên Sơ đồ hoạt động (Activity Diagrams)

#### A. Nhóm Sơ đồ hoạt động Dùng chung (2 đối tượng) — 7 Sơ đồ
1. **AD-CHUNG-01:** Sơ đồ hoạt động Quy trình Đăng ký tài khoản mới và kiểm tra mã CAPTCHA.
2. **AD-CHUNG-02:** Sơ đồ hoạt động Quy trình Đăng nhập và phân luồng chọn vai trò người học (`Học sinh tiểu học` / `Người nước ngoài`).
3. **AD-CHUNG-03:** Sơ đồ hoạt động Quy trình Quản lý cài đặt cá nhân, bật/tắt âm thanh và nhắc nhở học tập.
4. **AD-CHUNG-04:** Sơ đồ hoạt động Quy trình Thay đổi ngôn ngữ hiển thị và tự động dịch giao diện ứng dụng.
5. **AD-CHUNG-05:** Sơ đồ hoạt động Quy trình Chuyển đổi chế độ 3 vùng miền (Bắc – Trung – Nam) và quy đổi từ vựng – giọng đọc.
6. **AD-CHUNG-06:** Sơ đồ hoạt động Quy trình Nhận diện đồ vật qua Camera AI / Thư viện ảnh và phát âm từ vựng Chủ đề cuộc sống.
7. **AD-CHUNG-07:** Sơ đồ hoạt động Quy trình Đăng xuất tài khoản.

#### B. Nhóm Sơ đồ hoạt động cho `Học sinh tiểu học` (Lớp 1 – Lớp 3) — 7 Sơ đồ
1. **AD-HSTH-01:** Sơ đồ hoạt động Quy trình Chọn khối lớp (Lớp 1, Lớp 2, Lớp 3) và điều hướng kỹ năng học tập Tiểu học.
2. **AD-HSTH-02:** Sơ đồ hoạt động Quy trình Luyện đọc âm, vần, tiếng và câu ứng dụng cho học sinh Lớp 1.
3. **AD-HSTH-03:** Sơ đồ hoạt động Quy trình Tập đọc văn bản và thơ theo 4 chế độ (Đọc mẫu, Giải nghĩa từ khó, Đọc từng đoạn/khổ, Trả lời câu hỏi tìm hiểu bài) cho Lớp 1, 2, 3.
4. **AD-HSTH-04:** Sơ đồ hoạt động Quy trình Xem giải nghĩa và nghe phát âm từ khó trong bài Tập đọc.
5. **AD-HSTH-05:** Sơ đồ hoạt động Quy trình Luyện viết chữ thường và từ vựng Lớp 1 qua video mẫu.
6. **AD-HSTH-06:** Sơ đồ hoạt động Quy trình Luyện viết chữ hoa, câu ứng dụng và từ khó Lớp 2 theo 3 chế độ video.
7. **AD-HSTH-07:** Sơ đồ hoạt động Quy trình Nghe – viết chính tả, chụp ảnh vở viết tay, chấm điểm, khoanh tròn lỗi sai (nếu có lỗi) và lưu kết quả cho học sinh Lớp 1–3.

#### C. Nhóm Sơ đồ hoạt động cho `Người nước ngoài` (Trình độ A1) — 11 Sơ đồ
1. **AD-NNN-01:** Sơ đồ hoạt động Quy trình Khảo sát cá nhân hóa đầu vào 7 bước (có nhánh Bỏ qua – Skip) cho người nước ngoài.
2. **AD-NNN-02:** Sơ đồ hoạt động Quy trình Lựa chọn phần học và điều hướng bài học trên lộ trình Tiếng Việt A1.
3. **AD-NNN-03:** Sơ đồ hoạt động Quy trình Học Ngữ âm và Chữ viết Phần 1 (Bảng chữ cái, Nguyên âm – Phụ âm IPA, 6 Thanh điệu).
4. **AD-NNN-04:** Sơ đồ hoạt động Quy trình Luyện Kỹ năng 1 – Phát âm theo 3 cấp độ (Âm cơ bản, Ghép tổ hợp âm, Thanh điệu).
5. **AD-NNN-05:** Sơ đồ hoạt động Quy trình Luyện Kỹ năng 2 – Nghe câu mẫu và ghi âm lặp lại.
6. **AD-NNN-06:** Sơ đồ hoạt động Quy trình Luyện Kỹ năng 3 – Tập đọc chữ/từ và thực hành hội thoại phân vai.
7. **AD-NNN-07:** Sơ đồ hoạt động Quy trình Luyện Kỹ năng 4 – Học cấu trúc ngữ pháp và làm bài trắc nghiệm kiểm tra nhanh.
8. **AD-NNN-08:** Sơ đồ hoạt động Quy trình Luyện Kỹ năng 5 – Thay thế từ vào mẫu câu, nhận diện cấu trúc và điền vào chỗ trống.
9. **AD-NNN-09:** Sơ đồ hoạt động Quy trình Luyện Kỹ năng 6 – Nghe âm thanh, gõ chính tả tiếng Việt và chấm điểm từng từ.
10. **AD-NNN-10:** Sơ đồ hoạt động Quy trình Làm bài tập tổng hợp 5 phần (Trắc nghiệm, Điền từ, Ngữ pháp, Hội thoại, Nghe hiểu), kiểm tra đúng hết hoặc yêu cầu làm lại (Retry).
11. **AD-NNN-11:** Sơ đồ hoạt động Quy trình Tra cứu, tìm kiếm từ khóa và lọc từ loại trong Bảng từ vựng song ngữ.

---

### 3.4. Bảng ánh xạ đối chiếu 1–1 (Use Case ↔ Sơ đồ trình tự ↔ Sơ đồ hoạt động)

Bảng dưới đây giúp đối chiếu đồng bộ giữa **Use Case**, **Sơ đồ trình tự** và **Sơ đồ hoạt động** khi trình bày trong báo cáo tốt nghiệp:

| Phân hệ / Đối tượng | Mã Use Case | Mã Sơ đồ trình tự tương ứng | Mã Sơ đồ hoạt động tương ứng |
| :--- | :---: | :---: | :---: |
| **Dùng chung (2 đối tượng)** | `UC-CHUNG-01` | `SD-CHUNG-01` | `AD-CHUNG-02` *(Khởi tạo & Vào đăng nhập)* |
| **Dùng chung (2 đối tượng)** | `UC-CHUNG-02` | `SD-CHUNG-02` | `AD-CHUNG-01` |
| **Dùng chung (2 đối tượng)** | `UC-CHUNG-03`, `UC-CHUNG-04` | `SD-CHUNG-03`, `SD-CHUNG-04` | `AD-CHUNG-02` |
| **Dùng chung (2 đối tượng)** | `UC-CHUNG-05`, `UC-CHUNG-08` | `SD-CHUNG-05` | `AD-CHUNG-03` |
| **Dùng chung (2 đối tượng)** | `UC-CHUNG-06` | `SD-CHUNG-05` | `AD-CHUNG-04` |
| **Dùng chung (2 đối tượng)** | `UC-CHUNG-07` | `SD-CHUNG-06` | `AD-CHUNG-05` |
| **Dùng chung (2 đối tượng)** | `UC-CHUNG-09` | `SD-CHUNG-08` | `AD-CHUNG-07` |
| **Dùng chung (2 đối tượng)** | `UC-CHUNG-10` | `SD-CHUNG-07` | `AD-CHUNG-06` |
| **Học sinh tiểu học (Lớp 1–3)** | `UC-HSTH-01`, `UC-HSTH-02`, `UC-HSTH-11` | `SD-HSTH-01` | `AD-HSTH-01` |
| **Học sinh tiểu học (Lớp 1)** | `UC-HSTH-03` | `SD-HSTH-02` | `AD-HSTH-02` |
| **Học sinh tiểu học (Lớp 1–3)** | `UC-HSTH-04`, `UC-HSTH-05`, `UC-HSTH-06`, `UC-HSTH-08` | `SD-HSTH-03`, `SD-HSTH-04`, `SD-HSTH-05` | `AD-HSTH-03` |
| **Học sinh tiểu học (Lớp 1–3)** | `UC-HSTH-07` | `SD-HSTH-03`, `SD-HSTH-05` | `AD-HSTH-04` |
| **Học sinh tiểu học (Lớp 1)** | `UC-HSTH-09` | `SD-HSTH-06` | `AD-HSTH-05` |
| **Học sinh tiểu học (Lớp 2)** | `UC-HSTH-10` | `SD-HSTH-07` | `AD-HSTH-06` |
| **Học sinh tiểu học (Lớp 1–3)** | `UC-HSTH-12` | `SD-HSTH-08` | `AD-HSTH-07` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-01`, `UC-NNN-02` | `SD-NNN-01` | `AD-NNN-01` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-03`, `UC-NNN-04` | `SD-NNN-02` | `AD-NNN-02` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-05`, `UC-NNN-06`, `UC-NNN-07` | `SD-NNN-03` | `AD-NNN-03` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-08`, `UC-NNN-09` | `SD-NNN-04`, `SD-NNN-05` | `AD-NNN-04` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-10` | `SD-NNN-06` | `AD-NNN-05` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-11` | `SD-NNN-07` | `AD-NNN-06` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-12` | `SD-NNN-08` | `AD-NNN-07` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-13` | `SD-NNN-09` | `AD-NNN-08` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-14` | `SD-NNN-10` | `AD-NNN-09` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-15` | `SD-NNN-11` | `AD-NNN-10` |
| **Người nước ngoài (Trình độ A1)** | `UC-NNN-16` | `SD-NNN-12` | `AD-NNN-11` |

---

## 4. TỔNG KẾT SỐ LIỆU QUÉT MÃ NGUỒN

- **Tổng số tệp trong `src/app/screens` đã quét:** `85` tệp.
- **Tổng số Use Case chi tiết:** `38` Use Case (`10` Dùng chung + `12` Học sinh tiểu học + `16` Người nước ngoài A1).
- **Tổng số Sơ đồ trình tự (Sequence Diagrams):** `28` Sơ đồ (`8` Dùng chung + `8` Học sinh tiểu học + `12` Người nước ngoài A1).
- **Tổng số Sơ đồ hoạt động (Activity Diagrams):** `25` Sơ đồ (`7` Dùng chung + `7` Học sinh tiểu học + `11` Người nước ngoài A1).
