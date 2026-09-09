# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Tạo kết nối project app với MySQL

Mô hình chuẩn bắt buộc phải qua 3 lớp: React Native (App) $\rightarrow$ Backend API (Node.js/Express) $\rightarrow$ MySQL Database.

Để quản lý tất cả trong một project trên VS Code, bạn hãy tạo một thư mục con tên là backend (hoặc server) ngay bên trong project VIETNAM_APP_project.

Cấu trúc thư mục dự án của bạn sẽ trông như thế này:
VIETNAM_APP_project/
├── app/ <-- Mã nguồn React Native (Expo)
├── backend/ <-- Chứa server kết nối MySQL
│ ├── node_modules/
│ ├── package.json
│ └── server.js
├── package.json <-- Package của React Native
└── ...

## Bước 1: Tạo thư mục Backend và cài đặt thư viện

Mở project VIETNAM_APP_project trên VS Code.

Mở Terminal trong VS Code (`Ctrl + ``) và chạy lần lượt các lệnh sau:

1. Tạo thư mục backend và di chuyển vào trong đó
   mkdir backend
   cd backend

2. Khởi tạo package.json riêng cho backend
   npm init -y

3. Cài đặt các thư viện cần thiết
   npm install express mysql2 cors

## Bước 2: Tạo file server.js trong thư mục backend

// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Cấu hình thông tin tài khoản MySQL của bạn
const db = mysql.createConnection({
host: 'localhost',
user: 'root', // Tên user MySQL (mặc định là root)
password: '123456', // Điền mật khẩu MySQL của bạn vào đây
database: 'luyenviet_chinhta_vietnam' // Điền tên database của bạn vào đây
});

// 2. Kiểm tra kết nối Database
db.connect((err) => {
if (err) {
console.error('Lỗi kết nối MySQL:', err.message);
return;
}
console.log('Đã kết nối MySQL thành công!');
});

// 3. API kiểm tra server hoạt động
app.get('/api/status', (req, res) => {
res.json({ message: 'Backend đang hoạt động tốt!' });
});

// 4. API mẫu lấy danh sách dữ liệu (thay 'ten_bang' bằng bảng thực tế của bạn)
app.get('/api/data', (req, res) => {
const sql = 'SELECT \* FROM mguoi_dung'; // Thay 'ten_bang' bằng tên bảng thực tế của bạn
db.query(sql, (err, results) => {
if (err) {
return res.status(500).json({ error: err.message });
}
res.json(results);
});
});

// Chạy server tại cổng 5506
const PORT = 5506;
app.listen(PORT, '0.0.0.0', () => {
console.log(`Server backend đang chạy tại http://localhost:${PORT}`);
});

\*Lưu ý nếu quên mật khẩu root hay không đăng nhập root sd cách này:

Bước 1: Tắt dịch vụ MySQL đang chạy ngầm

1. Nhấn tổ hợp phím Windows + R, gõ services.msc rồi bấm Enter.
2. Trong danh sách dịch vụ hiện ra, kéo tìm dịch vụ tên là MySQL80 (hoặc MySQL).
3. Nhấp chuột phải vào MySQL80 $\rightarrow$ chọn Stop (Dừng).
   Bước 2: Tạo file lệnh đổi mật khẩu
4. Mở ổ đĩa D:\ trên máy tính của bạn.
5. Tạo một file văn bản mới tên là reset.txt (đường dẫn file sẽ là D:\reset.txt).
6. Dán đúng 1 dòng lệnh sau vào file rồi lưu lại:

ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';

Bước 3: Cưỡng chế nạp mật khẩu mới

1. Nhấn phím Windows, gõ cmd.
2. Nhấp chuột phải vào Command Prompt $\rightarrow$ chọn Run as administrator (Chạy bằng quyền quản trị).
3. Dán toàn bộ dòng lệnh sau vào CMD rồi bấm Enter:

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" --init-file="D:\reset.txt" --console

## Bước 3: Cách chạy đồng thời Backend và React Native trên VS Code

Terminal 1 (Chạy Backend): (bắt buộc mở tab này và giữ nguyên tab/ trang đó)

Bash
cd backend
node server.js

(Khi thấy thông báo "Đã kết nối MySQL thành công!" là server đã sẵn sàng).

Terminal 2 (Chạy Expo React Native):

Nhấn vào dấu + (hoặc biểu tượng chia đôi màn hình Split Terminal) ở góc trên bên phải của bảng Terminal để mở tab thứ hai.

Chạy lệnh Expo ở thư mục gốc của project:

Bash
npx expo start

## Bước 4: Gọi dữ liệu từ React Native lên App

Biến Backend thành link Online qua Localtunnel (Dành cho điện thoại thật)
Công cụ này tạo một đường link internet (HTTPS) công khai trỏ thẳng vào cổng 5000 của máy tính. Điện thoại dù bật 4G hay bất kỳ mạng nào cũng gọi được dữ liệu từ MySQL mà không bị tường lửa chặn.

Mở cổng Backend ra Internet:
Mở thêm một cửa sổ Terminal mới trên VS Code và chạy lệnh:

Bash
npx localtunnel --port 5000
Terminal sẽ trả về một đường link công khai, ví dụ:

Plaintext

your url is: https://neat-kings-cover.loca.lt

## LỖI KHÔNG MỞ PROJECT ĐƯỢC

Lỗi java.io.IOException: Failed to download remote update xuất hiện khi app Expo Go trên điện thoại không thể tải được gói mã nguồn JavaScript (Metro Bundler) từ máy tính do bị tường lửa chặn hoặc router Wi-Fi chặn kết nối nội bộ giữa 2 thiết bị.

Dưới đây là các bước xử lý triệt để nhất:

Giải pháp 1: Sử dụng chế độ Tunnel (Khuyên dùng - bỏ qua mọi rào cản Wi-Fi và Firewall)

Chế độ Tunnel sẽ tạo một đường truyền qua Internet để máy tính và điện thoại kết nối với nhau mà không phụ thuộc vào việc chung mạng LAN hay bị router chặn.

Tại Terminal đang chạy Expo, nhấn Ctrl + C để dừng.

Chạy lệnh:

npx expo start --tunnel

hoặc xóa achaer cũ
npx expo start -c

hoặc
npx expo run:android

hoặc

Cách 2: Ép toàn bộ giao thông qua USB (Bỏ qua Wi-Fi)
1.Thiết lập ADB Reverse cho cả Expo Bundler (cổng 8081): Mở terminal PowerShell thứ tư và chạy lệnh (thay bằng đường dẫn tuyệt đối đến adb.exe nếu cần):

& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:8081 tcp:8081

2.Khởi động Expo Bundler ràng buộc với Localhost:

npx expo start --no-dev --clear --minify --host localhost

Lưu ý: Nếu terminal hỏi Do you want to install @expo/ngrok?, bạn gõ y rồi bấm Enter.

Quét lại mã QR mới xuất hiện trên màn hình bằng Expo Go.

## Thực hiện lần lượt các bước sau để chạy lệnh adb reverse thành công:

Bước 1: Bật gỡ lỗi USB trên điện thoại
Bước 1: Bật gỡ lỗi USB trên điện thoại

1. Vào Cài đặt $\rightarrow$ Thông tin điện thoại $\rightarrow$ bấm 7 lần vào dòng Số bản dựng (Build Number) để mở Chế độ nhà phát triển.
2. Quay lại menu Cài đặt, vào Tùy chọn cho nhà phát triển (Developer Options) $\rightarrow$ bật Gỡ lỗi USB (USB Debugging).
3. Cắm cáp USB nối điện thoại với máy tính, trên màn hình điện thoại chọn chế độ Truyền tệp (File Transfer), sau đó chọn Cho phép / Luôn cho phép gỡ lỗi USB nếu có hộp thoại hỏi.
   Bước 2: Tìm và chạy trực tiếp adb.exe bằng PowerShell
   Mở một tab PowerShell mới trong VS Code (hoặc Windows PowerShell) và chạy lệnh sau để kiểm tra xem file adb.exe mặc định có sẵn trên máy chưa:

& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices

Nếu kết quả hiển thị dạng:

List of devices attached
xxxxxxxxx device

Máy tính đã nhận điện thoại. Chạy tiếp lệnh đảo cổng:

& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:5000 tcp:5000

(Lệnh in ra 5000 là xong).

## Trong databse có bảng kỹ năng với cột url_link

Không thể lưu đường dẫn ổ đĩa máy tính (D:\...) vào database vì ứng dụng di động khi chạy trên thiết bị sẽ không nhận diện được đường dẫn tệp tin của máy tính. Trong Expo Router, bạn cần lưu đường dẫn route (Relative Route).

1. Cập nhật dữ liệu cột url_link trong MySQL

Lưu đường dẫn tương đối tính từ thư mục app/ (bỏ phần đuôi .tsx và đường dẫn ổ đĩa D:\...):

Giá trị cần lưu:

\*\* Giá trị trong database phải trùng khớp chính xác với name được khai báo trong <Stack.Screen name="..."/>:

❌ Giá trị cũ (sai): /screens/primary_school_students/skills_reading_students/\_practice_reading_class1

✅ Giá trị mới (đúng): PracticeReading

## cách làm Text- to- Speech (TTS)

Bước 1: TRUY CẬP https://marketplace.fptcloud.com/en/models/fpt-ai-vits
Bước 2 lấy API
Bước 3 chép code
Bước 4: tạo cmd : npm install openai
Bước 5 chạy node tts.js để tải file âm thanh

Để giảm tốc độ phát âm cho phù hợp với học sinh tiểu học, bạn có thể áp dụng 2 cách sau:

Cách 1: Thêm tham số speed vào hàm tạo âm thanh (Khuyên dùng)

OpenAI SDK hỗ trợ thuộc tính speed với dải giá trị từ 0.25 đến 4.0 (mặc định là 1.0). Đối với học sinh tiểu học hoặc bé tập đọc, mức 0.7 đến 0.8 là mức độ vừa phải, rõ chữ và không bị méo tiếng.

Chỉnh sửa lại hàm run() trong file tts.js:
async function run() {
const response = await client.audio.speech.create({
model: 'FPT.AI-VITS',
input: 'xin chào, chúng tôi là FPT',
response_format: 'wav',
voice: 'std_kimngan',
speed: 0.75, // Giảm tốc độ phát âm (0.7 - 0.8 phù hợp cho tiểu học)
});
}

Cách 2: Ngắt nhịp văn bản bằng dấu câu

Mô hình TTS tự động ngắt nghỉ khi gặp dấu câu. Nếu muốn bé nghe rõ từng cụm từ hoặc từng âm tiết để luyện phát âm, bạn có thể chủ động thêm dấu phẩy , giữa các từ:

ví dụ: input: 'xin chào, chúng tôi, là, FPT',

ví dụ 2: nếu kéo dài âm A (vd: Aaaaa, cá) thì A... cá ( thêm 3 chấm vô)

Sau đó trở về file reading_pronuciation.stx thêm âm thanh vô

1.  Bước 1: npx expo install expo-av
2.  sửa code
    // Xử lý phát âm thanh
    const playSound = async (text: string) => {
    console.log('Phát âm:', text);
    try {
    // Dừng và giải phóng file âm thanh đang phát trước đó (nếu có)
    if (sound) {
    await sound.unloadAsync();
    }

          // Nạp và phát file âm thanh (đổi lại đuôi .wav/.mp3 theo đúng file của bạn)
          const { sound: newSound } = await Audio.Sound.createAsync(
            require('@/assets/audio/speech_a.wav') // Trỏ đúng tới thư mục chứa file âm thanh
          );

          setSound(newSound);
          await newSound.playAsync();
        } catch (error) {
          console.error('Lỗi phát âm thanh:', error);
        }

    };

// Tự động giải phóng bộ nhớ âm thanh khi component bị unmount
useEffect(() => {
return sound
? () => {
sound.unloadAsync();
}
: undefined;
}, [sound]);


## Thay đổi audio
1. import { createAudioPlayer } from "expo-audio"; không cần dùng import { Audio } from "expo-av"; nữa.
2. Xóa const [sound, setSound] = useState<Audio.Sound | null>(null);
3. playsound giờ là hàm đồng bộ dùng createAudioPlayer(source).play() để phát âm thanh.
4. Xóa navigation và router props khỏi <Header> (Header không cần dùng navigation và router và các props khác không cần thiết)

sửa
"main": "expo-router/entry", thành  "main": "index.js",