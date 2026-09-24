
const OpenAI = require('openai');
const fs = require('fs');

const client = new OpenAI({
  apiKey: 'sk-wCc8IViEFUcd9FFaQkDoPbK0wWP4edLhz81W4YufYYI=',
  baseURL: 'https://mkp-api.fptcloud.com'
});

async function run() {

  // Đoạn văn đã xử lý dấu ngắt nghỉ và dùng Template Literal (dấu `) để tránh lỗi ký tự ngoặc kép
  const textContent = `
a
  `;
  const response = await client.audio.speech.create({
    model: 'FPT.AI-VITs',
    // input: 'Bạn trả lời là, Trước sự thay đổi của voi em, voi anh đã nói: “Trời ơi, sao em lại thêm sừng và râu thế này? Xấu lắm!” ',
    input: textContent,
    voice: 'std_banmai',
    speed: 0.5,// Giảm tốc độ phát âm (0.7 - 0.8 phù hợp cho tiểu học)
  });
  const buffer = await response.arrayBuffer();
  fs.writeFileSync('speech_alphabet_a.wav', Buffer.from(buffer));
}

run();