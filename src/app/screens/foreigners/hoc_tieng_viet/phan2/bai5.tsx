// Phần 2 - Bài 5: Bài tập tổng hợp (Comprehensive Practice)
import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, TextInput, Animated, Alert, Modal, PanResponder,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const THEME = '#0891B2';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type SectionKey = 'tracNghiem' | 'dienTu' | 'nguPhap' | 'hoiThoai' | 'nghe';

interface Props { navigation: any; }

// ─────────────────────────────────────────────────────────────
// DATA - Phần 2: Âm vị / Phát âm
// ─────────────────────────────────────────────────────────────

// 1. TRẮC NGHIỆM (10 câu: từ vựng, ngữ pháp, phát âm)
const tracNghiemData = [
  { id: 1, cat: '📚 Từ vựng', q: 'Từ nào có nghĩa là "sân bay"?', opts: ['A. bệnh viện', 'B. sân bay', 'C. trường học', 'D. nhà hàng', 'E. khách sạn'], ans: 'B' },
  { id: 2, cat: '📖 Ngữ pháp', q: '"Anh ___ mua vé máy bay chưa?" – Chọn từ đúng:', opts: ['A. đã', 'B. sẽ', 'C. đang', 'D. vừa', 'E. mới'], ans: 'A' },
  { id: 3, cat: '🔊 Phát âm', q: 'Từ "máy bay" có thanh điệu:', opts: ['A. ngang – huyền', 'B. sắc – nặng', 'C. sắc – huyền', 'D. hỏi – ngã', 'E. nặng – sắc'], ans: 'C' },
  { id: 4, cat: '📚 Từ vựng', q: '"Vé" trong "vé máy bay" nghĩa là gì?', opts: ['A. ticket', 'B. seat', 'C. gate', 'D. passport', 'E. luggage'], ans: 'A' },
  { id: 5, cat: '📖 Ngữ pháp', q: 'Câu nào đúng?', opts: ['A. Tôi muốn mua một vé.', 'B. Tôi một muốn mua vé.', 'C. Muốn tôi mua một vé.', 'D. Vé một tôi muốn mua.', 'E. Mua vé tôi muốn.'], ans: 'A' },
  { id: 6, cat: '🔊 Phát âm', q: 'Từ "hải quan" phát âm đúng là:', opts: ['A. h-ai quyền hài quờ- u-a -quan', 'B. h-ai hỏi hải quờ -u -a -quan ', 'C. h-ai sắc hái hờ -u -a -quan', 'D. h-ai nặng hại hờ -u -a -quan', 'E. hải bản'], ans: 'B' },
  { id: 7, cat: '📚 Từ vựng', q: '"Khởi hành" nghĩa là gì?', opts: ['A. arrive', 'B. depart', 'C. transit', 'D. board', 'E. land'], ans: 'B' },
  { id: 8, cat: '📖 Ngữ pháp', q: '"Chuyến bay ___ mấy giờ?" – Chọn đúng:', opts: ['A. lúc', 'B. vào', 'C. ở', 'D. từ', 'E. đến'], ans: 'B' },
  { id: 9, cat: '🔊 Phát âm', q: 'Thanh điệu của "huyền" là:', opts: ['A. dấu  ´ ', 'B. dấu `', 'C. dấu ~', 'D. dấu ?', 'E. .'], ans: 'B' },
  { id: 10, cat: '📚 Từ vựng', q: '"Hành lý" nghĩa tiếng Anh là:', opts: ['A. boarding pass', 'B. check-in', 'C. luggage', 'D. customs', 'E. terminal'], ans: 'C' },
];

// 2. ĐIỀN TỪ (3 dạng, mỗi dạng ~3-4 câu = tổng 10)
// Dạng 1: Kéo thả từ có sẵn
const dienTuDang1Data = [
  { id: 1, sentence: '___ tôi muốn mua một vé khứ hồi.', blank: 0, wordBank: ['Xin lỗi,', 'Cảm ơn,', 'Chào,', 'Hẹn gặp,'], ans: 'Xin lỗi,' },
  { id: 2, sentence: 'Chuyến bay ___ lúc 8 giờ sáng.', blank: 1, wordBank: ['khởi hành', 'đáp xuống', 'bay lên', 'chờ đợi'], ans: 'khởi hành' },
  { id: 3, sentence: 'Tôi cần ___ hành lý trước khi lên máy bay.', blank: 1, wordBank: ['ký gửi', 'mang về', 'bỏ lại', 'mở ra'], ans: 'ký gửi' },
  { id: 4, sentence: 'Cổng ___ là cổng của chuyến bay này.', blank: 1, wordBank: ['cửa số 5', 'số 5', 'cửa 15', 'số cửa 20'], ans: 'số 5' },
];

// Dạng 2: Gõ từ (có gợi ý hình ảnh emoji)
const dienTuDang2Data = [
  { id: 1, emoji: '✈️', hint: 'Phương tiện bay', ans: 'máy bay' },
  { id: 2, emoji: '🎫', hint: 'Giấy tờ để lên tàu / xe / máy bay', ans: 'vé' },
  { id: 3, emoji: '🧳', hint: 'Đồ dùng mang theo khi đi du lịch', ans: 'hành lý' },
  { id: 4, emoji: '🛂', hint: 'Nơi kiểm tra hộ chiếu', ans: 'hải quan' },
];

// Dạng 3: Sắp xếp chữ cái thành từ
const dienTuDang3Data = [
  { id: 1, emoji: '🏨', shuffled: ['H', 'Á', 'C', 'H', ' ', 'S', 'Ạ', 'N'], ans: 'KHÁCH SẠN' },
  { id: 2, emoji: '🚀', shuffled: ['H', 'Ở', 'I', ' ', 'H', 'À', 'N', 'H'], ans: 'KHỞI HÀNH' },
  { id: 3, emoji: '🏛️', shuffled: ['H', 'H', 'T', 'C', 'Ủ', 'Ụ'], ans: 'THỦ TỤC' },
];

// 3. NGỮ PHÁP (4 dạng)
// Dạng 1: Kéo thả điền vào câu
const nguPhapDang1Data = [
  { id: 1, sentence: 'Tôi ___ đặt vé máy bay rồi.', wordBank: ['đã', 'sẽ', 'đang', 'chưa'], ans: 'đã' },
  { id: 2, sentence: 'Chuyến bay ___ vì thời tiết xấu.', wordBank: ['bị hoãn', 'bị hủy', 'sẽ đi', 'đã hạ cánh'], ans: 'bị hoãn' },
  { id: 3, sentence: 'Anh ấy ___ đi Đà Nẵng rồi phải không?', wordBank: ['đã', 'sẽ', 'đang', 'sắp'], ans: 'đã' },
];

// Dạng 2: Viết lại câu
const nguPhapDang2Data = [
  { id: 1, original: 'Tôi muốn mua vé. Vé đó đi Hà Nội.', rewrite: 'Tôi muốn mua ___ đi Hà Nội.', ans: 'vé' },
  { id: 2, original: 'Cô ấy đặt phòng khách sạn. Phòng đó ở gần sân bay.', rewrite: 'Cô ấy đặt ___ ở gần sân bay.', ans: 'phòng khách sạn' },
  { id: 3, original: 'Chúng tôi sẽ khởi hành. Chúng tôi khởi hành lúc 6 giờ.', rewrite: 'Chúng tôi sẽ khởi hành ___ 6 giờ.', ans: 'lúc' },
  { id: 4, original: 'Anh cần trình hộ chiếu. Hộ chiếu ở hải quan.', rewrite: 'Anh cần trình hộ chiếu ___ hải quan.', ans: 'ở' },
];

// Dạng 3: Sắp xếp câu
const nguPhapDang3Data = [
  { id: 1, words: ['bay', 'Tôi', 'vé', 'muốn', 'mua', 'máy'], ans: 'Tôi muốn mua vé máy bay' },
  { id: 2, words: ['hành', 'khởi', 'chuyến', 'lúc', 'bay', '8 giờ'], ans: 'Chuyến bay khởi hành lúc 8 giờ' },
  { id: 3, words: ['sân bay', 'đến', 'phải', 'sớm', 'Bạn', 'ở'], ans: 'Bạn phải đến sân bay sớm' },
];

// Dạng 4: Hình ảnh + Sắp xếp câu kéo thả
const nguPhapDang4Data = [
  { id: 1, emoji: '🎫', words: ['một', 'Tôi', 'cần', 'vé', 'khứ hồi'], ans: 'Tôi cần một vé khứ hồi' },
  { id: 2, emoji: '🧳', words: ['ký gửi', 'hành lý', 'Tôi', 'muốn'], ans: 'Tôi muốn ký gửi hành lý' },
  { id: 3, emoji: '🛂', words: ['hải quan', 'thủ tục', 'ở', 'xong', 'Tôi'], ans: 'Tôi xong thủ tục ở hải quan' },
];

// 4. HỘI THOẠI (3 dạng)
const hoiThoaiDang1Data = [
  { id: 1, q: 'Nhân viên: "Anh muốn mua vé loại nào?" – Khách đáp:', opts: ['A. Vé một chiều đi Hà Nội.', 'B. Tôi không biết.', 'C. Sân bay đâu?', 'D. Cảm ơn nhiều.', 'E. Gặp lại sau.'], ans: 'A' },
  { id: 2, q: 'Nhân viên: "Hành lý của anh nặng bao nhiêu?" – Khách đáp:', opts: ['A. 20 kg.', 'B. Tôi đi Hà Nội.', 'C. Vé khứ hồi.', 'D. Lúc 8 giờ.', 'E. Cổng số 5.'], ans: 'A' },
  { id: 3, q: 'Nhân viên: "Chuyến bay của anh khởi hành lúc mấy giờ?" – Khách đáp:', opts: ['A. 9 giờ 30 sáng.', 'B. Vé một chiều.', 'C. Tôi cần hành lý.', 'D. Cổng số 10.', 'E. Hải quan đâu?'], ans: 'A' },
  { id: 4, q: '"Anh có thể cho tôi xem hộ chiếu không?" Ai nói câu này?', opts: ['A. Nhân viên hải quan', 'B. Phi công', 'C. Hành khách', 'D. Nhân viên khách sạn', 'E. Tài xế taxi'], ans: 'A' },
];

// Dạng 2: Sắp xếp hội thoại kéo thả
const hoiThoaiDang2Data = [
  {
    id: 1,
    title: 'Mua vé máy bay',
    lines: [
      { key: 'A', text: 'Nhân viên: Anh muốn mua vé đi đâu ạ?' },
      { key: 'D', text: 'Khách: Tôi muốn mua vé đi Hà Nội.' },
      { key: 'C', text: 'Nhân viên: Anh muốn vé một chiều hay khứ hồi?' },
      { key: 'B', text: 'Khách: Vé khứ hồi, ngày mai khởi hành.' },
    ],
    ans: ['A', 'D', 'C', 'B'],
  },
  {
    id: 2,
    title: 'Check-in sân bay',
    lines: [
      { key: 'D', text: 'NV: Xin cho xem vé và hộ chiếu ạ.' },
      { key: 'A', text: 'Khách: Vâng, đây ạ.' },
      { key: 'B', text: 'NV: Hành lý của anh nặng 18 kg, không cần phụ phí.' },
      { key: 'C', text: 'Khách: Cảm ơn chị.' },
    ],
    ans: ['D', 'A', 'B', 'C'],
  },
];

// Dạng 3: Điền từ vào hội thoại
const hoiThoaiDang3Data = [
  { id: 1, dialogue: 'NV: Chuyến bay của anh ___lúc 10 giờ. Khách: Cảm ơn.', blank: 'khởi hành', wordBank: ['khởi hành', 'hạ cánh', 'cất cánh', 'đến nơi'] },
  { id: 2, dialogue: 'Khách: Cổng ___ là cổng của tôi? NV: Cổng B3 ạ.', blank: 'nào', wordBank: ['nào', 'đó', 'này', 'kia'] },
  { id: 3, dialogue: 'NV: Anh có hành lý ___ gửi không? Khách: Có, 20kg.', blank: 'ký', wordBank: ['ký', 'cầm', 'mang', 'xách'] },
];

// 5. NGHE & ĐIỀN TỪ (3 dạng, mỗi dạng dùng audio emoji giả lập)
const ngheDang1Data = [
  { id: 1, audio: '🔊 "Xin lỗi, vé đi Hà Nội bao nhiêu tiền?"', opts: ['A. Hỏi giá vé', 'B. Hỏi giờ bay', 'C. Đặt phòng', 'D. Hỏi hành lý', 'E. Hỏi cổng bay'], ans: 'A' },
  { id: 2, audio: '🔊 "Chuyến bay khởi hành lúc 7 giờ sáng."', opts: ['A. 6 giờ', 'B. 7 giờ', 'C. 8 giờ', 'D. 9 giờ', 'E. 10 giờ'], ans: 'B' },
  { id: 3, audio: '🔊 "Hành lý của anh nặng 22 kg, phải trả phụ phí."', opts: ['A. 18 kg', 'B. 20 kg', 'C. 22 kg', 'D. 24 kg', 'E. 25 kg'], ans: 'C' },
  { id: 4, audio: '🔊 "Cổng số 12 là cổng của chuyến bay đi TP.HCM."', opts: ['A. Cổng 10', 'B. Cổng 11', 'C. Cổng 12', 'D. Cổng 13', 'E. Cổng 15'], ans: 'C' },
];

const ngheDang2Data = [
  { id: 1, audio: '🔊 "Tôi muốn mua vé ___ Đà Nẵng."', ans: 'đi' },
  { id: 2, audio: '🔊 "Chuyến bay ___ lúc 6 giờ tối."', ans: 'khởi hành' },
  { id: 3, audio: '🔊 "Làm ơn cho tôi xem ___ của anh."', ans: 'hộ chiếu' },
];

const ngheDang3Data = [
  { id: 1, audio: '🔊 "Đây là cổng lên máy bay."', emojis: ['🚪✈️', '🛂', '🏨', '🚕', '🍜'], ans: '🚪✈️' },
  { id: 2, audio: '🔊 "Tôi cần ký gửi hành lý."', emojis: ['🧳📦', '🎫', '🛂', '🍱', '💳'], ans: '🧳📦' },
  { id: 3, audio: '🔊 "Xin trình hộ chiếu."', emojis: ['📘', '🎫', '🧳', '✈️', '🏨'], ans: '📘' },
];

// ─────────────────────────────────────────────────────────────
// SMALL REUSABLE COMPONENTS
// ─────────────────────────────────────────────────────────────

const SectionTab: React.FC<{ label: string; active: boolean; onPress: () => void; color: string }> = ({ label, active, onPress, color }) => (
  <TouchableOpacity onPress={onPress} style={[styles.tab, active && { backgroundColor: color, borderColor: color }]}>
    <Text style={[styles.tabText, active && { color: 'white' }]}>{label}</Text>
  </TouchableOpacity>
);

const ResultBanner: React.FC<{ correct: boolean; onRetry: () => void }> = ({ correct, onRetry }) => (
  <View style={[styles.banner, { backgroundColor: correct ? '#D1FAE5' : '#FEE2E2' }]}>
    <Text style={[styles.bannerTitle, { color: correct ? '#065F46' : '#991B1B' }]}>
      {correct ? '🎉 Chúc mừng bạn đúng hết bài học!' : '❌ Còn sai! Hãy làm lại nhé.'}
    </Text>
    {!correct && (
      <TouchableOpacity onPress={onRetry} style={[styles.retryBtn, { backgroundColor: '#DC2626' }]}>
        <Text style={styles.retryText}>Làm lại • Retry</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─────────────────────────────────────────────────────────────
// SECTION 1: TRẮC NGHIỆM
// ─────────────────────────────────────────────────────────────
const TracNghiemSection: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (id: number, opt: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: opt[0] }));
  };

  const handleSubmit = () => {
    const allAnswered = tracNghiemData.every(q => answers[q.id]);
    if (!allAnswered) { Alert.alert('Chưa xong!', 'Hãy chọn đáp án cho tất cả câu hỏi.'); return; }
    setSubmitted(true);
    const allCorrect = tracNghiemData.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!allCorrect) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 2000);
  };

  const allCorrect = submitted && tracNghiemData.every(q => answers[q.id] === q.ans);

  return (
    <View>
      {tracNghiemData.map(q => (
        <View key={q.id} style={styles.questionCard}>
          <Text style={styles.catBadge}>{q.cat}</Text>
          <Text style={styles.questionText}>Câu {q.id}: {q.q}</Text>
          {q.opts.map(opt => {
            const letter = opt[0];
            const chosen = answers[q.id] === letter;
            const isCorrect = submitted && letter === q.ans;
            const isWrong = submitted && chosen && letter !== q.ans;
            return (
              <TouchableOpacity
                key={opt}
                onPress={() => handleSelect(q.id, opt)}
                style={[
                  styles.optBtn,
                  chosen && !submitted && { borderColor: THEME, backgroundColor: '#E0F2FE' },
                  isCorrect && { borderColor: '#059669', backgroundColor: '#D1FAE5' },
                  isWrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' },
                ]}
              >
                <Text style={[styles.optText, isWrong && { color: '#DC2626', fontWeight: '700' }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION 2: ĐIỀN TỪ
// ─────────────────────────────────────────────────────────────
// Dạng 1: Kéo thả từ có sẵn (click to assign)
const DienTuDang1: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleWordPick = (qid: number, word: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qid]: word }));
  };

  const handleSubmit = () => {
    const allDone = dienTuDang1Data.every(q => answers[q.id]);
    if (!allDone) { Alert.alert('Chưa xong!', 'Hãy chọn đáp án cho tất cả câu.'); return; }
    setSubmitted(true);
    const allCorrect = dienTuDang1Data.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!allCorrect) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 2200);
  };

  const allCorrect = submitted && dienTuDang1Data.every(q => answers[q.id] === q.ans);

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 1: Chọn từ điền vào chỗ trống</Text>
      {dienTuDang1Data.map(q => {
        const parts = q.sentence.split('___');
        const filled = answers[q.id] || '     ';
        const isCorrect = submitted && answers[q.id] === q.ans;
        const isWrong = submitted && answers[q.id] && answers[q.id] !== q.ans;
        return (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.questionText}>Câu {q.id}:</Text>
            <View style={styles.sentenceRow}>
              <Text style={styles.sentText}>{parts[0]}</Text>
              <View style={[styles.blankBox, isCorrect && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, isWrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.blankText, isWrong && { color: '#DC2626' }]}>{filled}</Text>
              </View>
              <Text style={styles.sentText}>{parts[1]}</Text>
            </View>
            <View style={styles.wordBankRow}>
              {q.wordBank.map(w => (
                <TouchableOpacity key={w} onPress={() => handleWordPick(q.id, w)} style={[styles.wordChip, answers[q.id] === w && { backgroundColor: THEME }]}>
                  <Text style={[styles.wordChipText, answers[q.id] === w && { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Dạng 2: Gõ từ theo hình ảnh
const DienTuDang2: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    const allDone = dienTuDang2Data.every(q => answers[q.id]?.trim());
    if (!allDone) { Alert.alert('Chưa xong!', 'Hãy điền tất cả từ.'); return; }
    setSubmitted(true);
    const allCorrect = dienTuDang2Data.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());
    setShowResult(true);
    if (!allCorrect) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 2200);
  };

  const allCorrect = submitted && dienTuDang2Data.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 2: Nhìn hình - Gõ từ</Text>
      {dienTuDang2Data.map(q => {
        const correct = submitted && answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase();
        const wrong = submitted && !correct;
        return (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.bigEmoji}>{q.emoji}</Text>
            <Text style={styles.hintText}>{q.hint}</Text>
            <TextInput
              style={[styles.typeInput, correct && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, wrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}
              value={answers[q.id] || ''}
              onChangeText={t => !submitted && setAnswers(prev => ({ ...prev, [q.id]: t }))}
              placeholder="Gõ từ tiếng Việt..."
              editable={!submitted}
            />
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Dạng 3: Sắp xếp chữ cái thành từ
const DienTuDang3: React.FC = () => {
  const [arranged, setArranged] = useState<Record<number, string[]>>(
    Object.fromEntries(dienTuDang3Data.map(q => [q.id, [...q.shuffled].sort(() => Math.random() - 0.5)]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string[]>>(
    Object.fromEntries(dienTuDang3Data.map(q => [q.id, []]))
  );

  const moveLetter = (qid: number, letter: string, from: 'bank' | 'answer') => {
    if (submitted) return;
    if (from === 'bank') {
      setArranged(prev => {
        const idx = prev[qid].indexOf(letter);
        if (idx === -1) return prev;
        const next = [...prev[qid]];
        next.splice(idx, 1);
        return { ...prev, [qid]: next };
      });
      setAnswers(prev => ({ ...prev, [qid]: [...prev[qid], letter] }));
    } else {
      setAnswers(prev => {
        const idx = prev[qid].indexOf(letter);
        if (idx === -1) return prev;
        const next = [...prev[qid]];
        next.splice(idx, 1);
        return { ...prev, [qid]: next };
      });
      setArranged(prev => ({ ...prev, [qid]: [...prev[qid], letter] }));
    }
  };

  const handleSubmit = () => {
    const allDone = dienTuDang3Data.every(q => answers[q.id].length > 0);
    if (!allDone) { Alert.alert('Chưa xong!', 'Hãy sắp xếp tất cả từ.'); return; }
    setSubmitted(true);
    const allCorrect = dienTuDang3Data.every(q => answers[q.id].join('') === q.ans.replace(/ /g, ''));
    setShowResult(true);
    if (!allCorrect) {
      setTimeout(() => {
        setSubmitted(false); setShowResult(false);
        setArranged(Object.fromEntries(dienTuDang3Data.map(q => [q.id, [...q.shuffled].sort(() => Math.random() - 0.5)])));
        setAnswers(Object.fromEntries(dienTuDang3Data.map(q => [q.id, []])));
      }, 2200);
    }
  };

  const allCorrect = submitted && dienTuDang3Data.every(q => answers[q.id].join('') === q.ans.replace(/ /g, ''));

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 3: Sắp xếp chữ cái thành từ</Text>
      {dienTuDang3Data.map(q => {
        const correct = submitted && answers[q.id].join('') === q.ans.replace(/ /g, '');
        const wrong = submitted && !correct;
        return (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.bigEmoji}>{q.emoji}</Text>
            <Text style={styles.questionText}>Câu {q.id}: Sắp xếp thành từ đúng</Text>
            {/* Answer area */}
            <View style={[styles.letterRow, correct && { backgroundColor: '#D1FAE5' }, wrong && { backgroundColor: '#FEE2E2' }]}>
              {answers[q.id].length === 0
                ? <Text style={styles.placeholder}>Nhấn chữ cái bên dưới để xếp...</Text>
                : answers[q.id].map((l, i) => (
                  <TouchableOpacity key={`a${i}`} onPress={() => moveLetter(q.id, l, 'answer')} style={[styles.letterChip, { backgroundColor: correct ? '#059669' : wrong ? '#DC2626' : THEME }]}>
                    <Text style={styles.letterChipText}>{l}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            {/* Letter bank */}
            <View style={styles.letterRow}>
              {arranged[q.id].map((l, i) => (
                <TouchableOpacity key={`b${i}`} onPress={() => moveLetter(q.id, l, 'bank')} style={[styles.letterChip, { backgroundColor: '#94A3B8' }]}>
                  <Text style={styles.letterChipText}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => {
        setSubmitted(false); setShowResult(false);
        setArranged(Object.fromEntries(dienTuDang3Data.map(q => [q.id, [...q.shuffled].sort(() => Math.random() - 0.5)])));
        setAnswers(Object.fromEntries(dienTuDang3Data.map(q => [q.id, []])));
      }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION 3: NGỮ PHÁP
// ─────────────────────────────────────────────────────────────
const NguPhapDang1: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!nguPhapDang1Data.every(q => answers[q.id])) { Alert.alert('Chưa xong!', 'Chọn tất cả đáp án.'); return; }
    setSubmitted(true);
    const ok = nguPhapDang1Data.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 2200);
  };

  const allCorrect = submitted && nguPhapDang1Data.every(q => answers[q.id] === q.ans);

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 1: Chọn từ điền vào câu</Text>
      {nguPhapDang1Data.map(q => {
        const parts = q.sentence.split('___');
        return (
          <View key={q.id} style={styles.questionCard}>
            <View style={styles.sentenceRow}>
              <Text style={styles.sentText}>{parts[0]}</Text>
              <View style={[styles.blankBox,
                submitted && answers[q.id] === q.ans && { borderColor: '#059669', backgroundColor: '#D1FAE5' },
                submitted && answers[q.id] !== q.ans && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={styles.blankText}>{answers[q.id] || '   '}</Text>
              </View>
              <Text style={styles.sentText}>{parts[1]}</Text>
            </View>
            <View style={styles.wordBankRow}>
              {q.wordBank.map(w => (
                <TouchableOpacity key={w} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: w }))} style={[styles.wordChip, answers[q.id] === w && { backgroundColor: THEME }]}>
                  <Text style={[styles.wordChipText, answers[q.id] === w && { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NguPhapDang2: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!nguPhapDang2Data.every(q => answers[q.id]?.trim())) { Alert.alert('Chưa xong!', 'Điền tất cả câu.'); return; }
    setSubmitted(true);
    const ok = nguPhapDang2Data.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 2200);
  };

  const allCorrect = submitted && nguPhapDang2Data.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 2: Viết lại câu</Text>
      {nguPhapDang2Data.map(q => {
        const correct = submitted && answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase();
        const wrong = submitted && !correct;
        const parts = q.rewrite.split('___');
        return (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.originalSent}>Gốc: {q.original}</Text>
            <View style={styles.sentenceRow}>
              <Text style={styles.sentText}>{parts[0]}</Text>
              <TextInput
                style={[styles.inlineInput, correct && { borderColor: '#059669', color: '#059669' }, wrong && { borderColor: '#DC2626', color: '#DC2626' }]}
                value={answers[q.id] || ''}
                onChangeText={t => !submitted && setAnswers(p => ({ ...p, [q.id]: t }))}
                editable={!submitted}
              />
              <Text style={styles.sentText}>{parts[1]}</Text>
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NguPhapDang3: React.FC = () => {
  const [arrangements, setArrangements] = useState<Record<number, { bank: string[], answer: string[] }>>(
    Object.fromEntries(nguPhapDang3Data.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const moveWord = (qid: number, word: string, from: 'bank' | 'answer') => {
    if (submitted) return;
    setArrangements(prev => {
      const cur = prev[qid];
      if (from === 'bank') {
        const idx = cur.bank.indexOf(word);
        if (idx === -1) return prev;
        const bank = [...cur.bank]; bank.splice(idx, 1);
        return { ...prev, [qid]: { bank, answer: [...cur.answer, word] } };
      } else {
        const idx = cur.answer.indexOf(word);
        if (idx === -1) return prev;
        const answer = [...cur.answer]; answer.splice(idx, 1);
        return { ...prev, [qid]: { bank: [...cur.bank, word], answer } };
      }
    });
  };

  const handleSubmit = () => {
    if (!nguPhapDang3Data.every(q => arrangements[q.id].answer.length > 0)) { Alert.alert('Chưa xong!', 'Sắp xếp tất cả câu.'); return; }
    setSubmitted(true);
    const ok = nguPhapDang3Data.every(q => arrangements[q.id].answer.join(' ') === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => {
      setSubmitted(false); setShowResult(false);
      setArrangements(Object.fromEntries(nguPhapDang3Data.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
    }, 2200);
  };

  const allCorrect = submitted && nguPhapDang3Data.every(q => arrangements[q.id].answer.join(' ') === q.ans);

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 3: Sắp xếp từ thành câu</Text>
      {nguPhapDang3Data.map(q => {
        const correct = submitted && arrangements[q.id].answer.join(' ') === q.ans;
        const wrong = submitted && !correct;
        return (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.questionText}>Câu {q.id}: Sắp xếp thành câu đúng</Text>
            <View style={[styles.wordRow, correct && { backgroundColor: '#D1FAE5' }, wrong && { backgroundColor: '#FEE2E2' }]}>
              {arrangements[q.id].answer.length === 0
                ? <Text style={styles.placeholder}>Nhấn từ bên dưới để xếp câu...</Text>
                : arrangements[q.id].answer.map((w, i) => (
                  <TouchableOpacity key={`a${i}`} onPress={() => moveWord(q.id, w, 'answer')} style={[styles.wordChip, { backgroundColor: correct ? '#059669' : wrong ? '#DC2626' : THEME }]}>
                    <Text style={[styles.wordChipText, { color: 'white' }]}>{w}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            <View style={styles.wordRow}>
              {arrangements[q.id].bank.map((w, i) => (
                <TouchableOpacity key={`b${i}`} onPress={() => moveWord(q.id, w, 'bank')} style={[styles.wordChip, { backgroundColor: '#94A3B8' }]}>
                  <Text style={[styles.wordChipText, { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => {
        setSubmitted(false); setShowResult(false);
        setArrangements(Object.fromEntries(nguPhapDang3Data.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
      }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NguPhapDang4: React.FC = () => {
  const [arrangements, setArrangements] = useState<Record<number, { bank: string[], answer: string[] }>>(
    Object.fromEntries(nguPhapDang4Data.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const moveWord = (qid: number, word: string, from: 'bank' | 'answer') => {
    if (submitted) return;
    setArrangements(prev => {
      const cur = prev[qid];
      if (from === 'bank') {
        const idx = cur.bank.indexOf(word);
        if (idx === -1) return prev;
        const bank = [...cur.bank]; bank.splice(idx, 1);
        return { ...prev, [qid]: { bank, answer: [...cur.answer, word] } };
      } else {
        const idx = cur.answer.indexOf(word);
        if (idx === -1) return prev;
        const answer = [...cur.answer]; answer.splice(idx, 1);
        return { ...prev, [qid]: { bank: [...cur.bank, word], answer } };
      }
    });
  };

  const handleSubmit = () => {
    if (!nguPhapDang4Data.every(q => arrangements[q.id].answer.length > 0)) { Alert.alert('Chưa xong!', 'Sắp xếp tất cả câu.'); return; }
    setSubmitted(true);
    const ok = nguPhapDang4Data.every(q => arrangements[q.id].answer.join(' ') === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => {
      setSubmitted(false); setShowResult(false);
      setArrangements(Object.fromEntries(nguPhapDang4Data.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
    }, 2200);
  };

  const allCorrect = submitted && nguPhapDang4Data.every(q => arrangements[q.id].answer.join(' ') === q.ans);

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 4: Nhìn hình – Sắp xếp câu</Text>
      {nguPhapDang4Data.map(q => {
        const correct = submitted && arrangements[q.id].answer.join(' ') === q.ans;
        const wrong = submitted && !correct;
        return (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.bigEmoji}>{q.emoji}</Text>
            <View style={[styles.wordRow, correct && { backgroundColor: '#D1FAE5' }, wrong && { backgroundColor: '#FEE2E2' }]}>
              {arrangements[q.id].answer.length === 0
                ? <Text style={styles.placeholder}>Nhấn từ bên dưới...</Text>
                : arrangements[q.id].answer.map((w, i) => (
                  <TouchableOpacity key={`a${i}`} onPress={() => moveWord(q.id, w, 'answer')} style={[styles.wordChip, { backgroundColor: correct ? '#059669' : wrong ? '#DC2626' : THEME }]}>
                    <Text style={[styles.wordChipText, { color: 'white' }]}>{w}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            <View style={styles.wordRow}>
              {arrangements[q.id].bank.map((w, i) => (
                <TouchableOpacity key={`b${i}`} onPress={() => moveWord(q.id, w, 'bank')} style={[styles.wordChip, { backgroundColor: '#94A3B8' }]}>
                  <Text style={[styles.wordChipText, { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => {
        setSubmitted(false); setShowResult(false);
        setArrangements(Object.fromEntries(nguPhapDang4Data.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
      }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION 4: HỘI THOẠI
// ─────────────────────────────────────────────────────────────
const HoiThoaiDang1: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!hoiThoaiDang1Data.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = hoiThoaiDang1Data.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 2200);
  };

  const allCorrect = submitted && hoiThoaiDang1Data.every(q => answers[q.id] === q.ans);

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 1: Hội thoại trắc nghiệm</Text>
      {hoiThoaiDang1Data.map(q => (
        <View key={q.id} style={styles.questionCard}>
          <Text style={styles.questionText}>💬 {q.q}</Text>
          {q.opts.map(opt => {
            const letter = opt[0];
            const chosen = answers[q.id] === letter;
            const correct = submitted && letter === q.ans;
            const wrong = submitted && chosen && letter !== q.ans;
            return (
              <TouchableOpacity key={opt} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: letter }))}
                style={[styles.optBtn, chosen && !submitted && { borderColor: THEME, backgroundColor: '#E0F2FE' }, correct && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, wrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.optText, wrong && { color: '#DC2626', fontWeight: '700' }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const HoiThoaiDang2: React.FC = () => {
  const [orders, setOrders] = useState<Record<number, string[]>>(
    Object.fromEntries(hoiThoaiDang2Data.map(d => [d.id, [...d.lines.map(l => l.key)].sort(() => Math.random() - 0.5)]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const moveUp = (did: number, idx: number) => {
    if (submitted || idx === 0) return;
    setOrders(prev => {
      const arr = [...prev[did]];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return { ...prev, [did]: arr };
    });
  };

  const moveDown = (did: number, idx: number) => {
    if (submitted) return;
    setOrders(prev => {
      const arr = [...prev[did]];
      if (idx >= arr.length - 1) return prev;
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
      return { ...prev, [did]: arr };
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const ok = hoiThoaiDang2Data.every(d => orders[d.id].join('') === d.ans.join(''));
    setShowResult(true);
    if (!ok) setTimeout(() => {
      setSubmitted(false); setShowResult(false);
      setOrders(Object.fromEntries(hoiThoaiDang2Data.map(d => [d.id, [...d.lines.map(l => l.key)].sort(() => Math.random() - 0.5)])));
    }, 2200);
  };

  const allCorrect = submitted && hoiThoaiDang2Data.every(d => orders[d.id].join('') === d.ans.join(''));

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 2: Sắp xếp hội thoại (↑↓ để xếp)</Text>
      {hoiThoaiDang2Data.map(d => {
        const correct = submitted && orders[d.id].join('') === d.ans.join('');
        const wrong = submitted && !correct;
        return (
          <View key={d.id} style={styles.questionCard}>
            <Text style={styles.questionText}>🗣️ {d.title}</Text>
            {orders[d.id].map((key, idx) => {
              const line = d.lines.find(l => l.key === key)!;
              return (
                <View key={key} style={[styles.dialogueLine, correct && { backgroundColor: '#D1FAE5' }, wrong && { backgroundColor: '#FEE2E2' }]}>
                  <View style={styles.arrowBtns}>
                    <TouchableOpacity onPress={() => moveUp(d.id, idx)}><Text style={styles.arrow}>▲</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => moveDown(d.id, idx)}><Text style={styles.arrow}>▼</Text></TouchableOpacity>
                  </View>
                  <Text style={styles.dialogueText}>{line.text}</Text>
                </View>
              );
            })}
            {wrong && <Text style={styles.correctHint}>✓ Thứ tự đúng: {d.ans.join(' → ')}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => {
        setSubmitted(false); setShowResult(false);
        setOrders(Object.fromEntries(hoiThoaiDang2Data.map(d => [d.id, [...d.lines.map(l => l.key)].sort(() => Math.random() - 0.5)])));
      }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const HoiThoaiDang3: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!hoiThoaiDang3Data.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = hoiThoaiDang3Data.every(q => answers[q.id] === q.blank);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 2200);
  };

  const allCorrect = submitted && hoiThoaiDang3Data.every(q => answers[q.id] === q.blank);

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 3: Điền từ vào hội thoại</Text>
      {hoiThoaiDang3Data.map(q => {
        const parts = q.dialogue.split(q.blank);
        const correct = submitted && answers[q.id] === q.blank;
        const wrong = submitted && answers[q.id] !== q.blank;
        return (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.questionText}>💬 {parts[0]}</Text>
            <View style={styles.wordBankRow}>
              {q.wordBank.map(w => (
                <TouchableOpacity key={w} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: w }))} style={[styles.wordChip, answers[q.id] === w && { backgroundColor: THEME }, correct && answers[q.id] === w && { backgroundColor: '#059669' }, wrong && answers[q.id] === w && { backgroundColor: '#DC2626' }]}>
                  <Text style={[styles.wordChipText, answers[q.id] === w && { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sentText}>→ {parts[1]}</Text>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.blank}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION 5: NGHE & ĐIỀN TỪ
// ─────────────────────────────────────────────────────────────
const NgheDang1: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!ngheDang1Data.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = ngheDang1Data.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 2200);
  };

  const allCorrect = submitted && ngheDang1Data.every(q => answers[q.id] === q.ans);

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 1: Nghe – Trắc nghiệm</Text>
      {ngheDang1Data.map(q => (
        <View key={q.id} style={styles.questionCard}>
          <View style={styles.audioPill}><Text style={styles.audioText}>{q.audio}</Text></View>
          {q.opts.map(opt => {
            const letter = opt[0];
            const chosen = answers[q.id] === letter;
            const correct = submitted && letter === q.ans;
            const wrong = submitted && chosen && letter !== q.ans;
            return (
              <TouchableOpacity key={opt} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: letter }))}
                style={[styles.optBtn, chosen && !submitted && { borderColor: THEME, backgroundColor: '#E0F2FE' }, correct && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, wrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.optText, wrong && { color: '#DC2626', fontWeight: '700' }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NgheDang2: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!ngheDang2Data.every(q => answers[q.id]?.trim())) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = ngheDang2Data.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 1000);
  };

  const allCorrect = submitted && ngheDang2Data.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 2: Nghe – Tự điền từ</Text>
      {ngheDang2Data.map(q => {
        const correct = submitted && answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase();
        const wrong = submitted && !correct;
        const parts = q.audio.split('___');
        return (
          <View key={q.id} style={styles.questionCard}>
            <View style={styles.audioPill}><Text style={styles.audioText}>{parts[0]}</Text>
              <TextInput
                style={[styles.inlineInput, correct && { borderColor: '#059669', color: '#059669' }, wrong && { borderColor: '#DC2626', color: '#DC2626' }]}
                value={answers[q.id] || ''}
                onChangeText={t => !submitted && setAnswers(p => ({ ...p, [q.id]: t }))}
                editable={!submitted}
                placeholder="..."
              />
              <Text style={styles.audioText}>{parts[1]}</Text>
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NgheDang3: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!ngheDang3Data.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = ngheDang3Data.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 2200);
  };

  const allCorrect = submitted && ngheDang3Data.every(q => answers[q.id] === q.ans);

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 3: Nghe – Chọn hình ảnh</Text>
      {ngheDang3Data.map(q => (
        <View key={q.id} style={styles.questionCard}>
          <View style={styles.audioPill}><Text style={styles.audioText}>{q.audio}</Text></View>
          <View style={styles.emojiGrid}>
            {q.emojis.map(em => {
              const chosen = answers[q.id] === em;
              const correct = submitted && em === q.ans;
              const wrong = submitted && chosen && em !== q.ans;
              return (
                <TouchableOpacity key={em} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: em }))}
                  style={[styles.emojiCard, chosen && !submitted && { borderColor: THEME }, correct && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, wrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                  <Text style={styles.emojiCardText}>{em}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────
const SECTIONS: { key: SectionKey; label: string; emoji: string }[] = [
  { key: 'tracNghiem', label: 'Trắc nghiệm', emoji: '📝' },
  { key: 'dienTu', label: 'Điền từ', emoji: '✏️' },
  { key: 'nguPhap', label: 'Ngữ pháp', emoji: '📐' },
  { key: 'hoiThoai', label: 'Hội thoại', emoji: '💬' },
  { key: 'nghe', label: 'Nghe', emoji: '🎧' },
];

const Phan2Bai5: React.FC<Props> = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('tracNghiem');
  const [dienTuTab, setDienTuTab] = useState(1);
  const [nguPhapTab, setNguPhapTab] = useState(1);
  const [hoiThoaiTab, setHoiThoaiTab] = useState(1);
  const [ngheTab, setNgheTab] = useState(1);

  const renderContent = () => {
    switch (activeSection) {
      case 'tracNghiem': return <TracNghiemSection />;
      case 'dienTu':
        return (
          <View>
            <View style={styles.subTabRow}>
              {[1, 2, 3].map(n => (
                <TouchableOpacity key={n} onPress={() => setDienTuTab(n)} style={[styles.subTab, dienTuTab === n && { backgroundColor: THEME }]}>
                  <Text style={[styles.subTabText, dienTuTab === n && { color: 'white' }]}>Dạng {n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {dienTuTab === 1 && <DienTuDang1 />}
            {dienTuTab === 2 && <DienTuDang2 />}
            {dienTuTab === 3 && <DienTuDang3 />}
          </View>
        );
      case 'nguPhap':
        return (
          <View>
            <View style={styles.subTabRow}>
              {[1, 2, 3, 4].map(n => (
                <TouchableOpacity key={n} onPress={() => setNguPhapTab(n)} style={[styles.subTab, nguPhapTab === n && { backgroundColor: THEME }]}>
                  <Text style={[styles.subTabText, nguPhapTab === n && { color: 'white' }]}>Dạng {n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {nguPhapTab === 1 && <NguPhapDang1 />}
            {nguPhapTab === 2 && <NguPhapDang2 />}
            {nguPhapTab === 3 && <NguPhapDang3 />}
            {nguPhapTab === 4 && <NguPhapDang4 />}
          </View>
        );
      case 'hoiThoai':
        return (
          <View>
            <View style={styles.subTabRow}>
              {[1, 2, 3].map(n => (
                <TouchableOpacity key={n} onPress={() => setHoiThoaiTab(n)} style={[styles.subTab, hoiThoaiTab === n && { backgroundColor: THEME }]}>
                  <Text style={[styles.subTabText, hoiThoaiTab === n && { color: 'white' }]}>Dạng {n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {hoiThoaiTab === 1 && <HoiThoaiDang1 />}
            {hoiThoaiTab === 2 && <HoiThoaiDang2 />}
            {hoiThoaiTab === 3 && <HoiThoaiDang3 />}
          </View>
        );
      case 'nghe':
        return (
          <View>
            <View style={styles.subTabRow}>
              {[1, 2, 3].map(n => (
                <TouchableOpacity key={n} onPress={() => setNgheTab(n)} style={[styles.subTab, ngheTab === n && { backgroundColor: THEME }]}>
                  <Text style={[styles.subTabText, ngheTab === n && { color: 'white' }]}>Dạng {n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {ngheTab === 1 && <NgheDang1 />}
            {ngheTab === 2 && <NgheDang2 />}
            {ngheTab === 3 && <NgheDang3 />}
          </View>
        );
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: THEME }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBai}>BÀI 5</Text>
          <Text style={styles.headerTitle}>Bài tập tổng hợp Phần 2</Text>
          <Text style={styles.headerSub}>Comprehensive Practice Part 2</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Section Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabContainer}>
        {SECTIONS.map(s => (
          <TouchableOpacity key={s.key} onPress={() => setActiveSection(s.key)} style={[styles.tab, activeSection === s.key && { backgroundColor: THEME, borderColor: THEME }]}>
            <Text style={[styles.tabText, activeSection === s.key && { color: 'white' }]}>{s.emoji} {s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, marginTop: 30 },
  backBtn: { padding: 8, width: 40 },
  backIcon: { fontSize: 20, color: 'white' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerBai: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '700', letterSpacing: 1 },
  headerTitle: { fontSize: 15, fontWeight: '800', color: 'white', textAlign: 'center', marginTop: 2 },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  tabScroll: { maxHeight: 54, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tabContainer: { paddingHorizontal: 10, paddingVertical: 8, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#CBD5E1', backgroundColor: 'white' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#475569' },

  subTabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  subTab: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#E2E8F0', alignItems: 'center' },
  subTabText: { fontSize: 13, fontWeight: '700', color: '#475569' },

  content: { flex: 1 },
  contentInner: { padding: 16 },

  sectionSubTitle: { fontSize: 14, fontWeight: '800', color: THEME, marginBottom: 14, letterSpacing: 0.3 },

  questionCard: {
    backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 14,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6,
  },
  catBadge: { fontSize: 11, color: THEME, fontWeight: '700', marginBottom: 6, letterSpacing: 0.5 },
  questionText: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 12, lineHeight: 20 },
  optBtn: { borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, marginBottom: 8 },
  optText: { fontSize: 13, color: '#334155' },

  sentenceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 },
  sentText: { fontSize: 14, color: '#334155', lineHeight: 20 },
  blankBox: { borderBottomWidth: 2, borderColor: THEME, minWidth: 80, alignItems: 'center', marginHorizontal: 4, paddingHorizontal: 8, paddingVertical: 4 },
  blankText: { fontSize: 14, color: '#1E293B', fontWeight: '600' },

  wordBankRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, minHeight: 44, backgroundColor: '#F1F5F9', borderRadius: 10, padding: 10, marginBottom: 10 },
  wordChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: '#CBD5E1' },
  wordChipText: { fontSize: 13, fontWeight: '600', color: '#334155' },

  bigEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  hintText: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 12, fontStyle: 'italic' },
  typeInput: {
    borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 10, padding: 12,
    fontSize: 14, color: '#1E293B', backgroundColor: '#F8FAFC',
  },
  inlineInput: { borderBottomWidth: 2, borderColor: THEME, minWidth: 80, paddingHorizontal: 6, fontSize: 14, color: '#1E293B', marginHorizontal: 4 },
  correctHint: { fontSize: 12, color: '#059669', fontWeight: '600', marginTop: 6 },
  originalSent: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginBottom: 10, backgroundColor: '#F1F5F9', padding: 8, borderRadius: 8 },

  letterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, minHeight: 44, backgroundColor: '#F1F5F9', borderRadius: 10, padding: 10, marginBottom: 10 },
  letterChip: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  letterChipText: { fontSize: 14, fontWeight: '700', color: 'white' },
  placeholder: { fontSize: 12, color: '#94A3B8', alignSelf: 'center' },

  dialogueLine: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, marginBottom: 8 },
  arrowBtns: { marginRight: 10, gap: 2 },
  arrow: { fontSize: 16, color: THEME, fontWeight: '700', textAlign: 'center' },
  dialogueText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 18 },

  audioPill: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#DBEAFE', borderRadius: 12, padding: 12, marginBottom: 12 },
  audioText: { fontSize: 13, color: '#1D4ED8', fontWeight: '600', lineHeight: 20 },

  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  emojiCard: { width: 70, height: 70, borderRadius: 14, borderWidth: 2.5, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  emojiCardText: { fontSize: 28 },

  submitBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8, elevation: 3 },
  submitText: { fontSize: 15, fontWeight: '800', color: 'white', letterSpacing: 0.5 },

  banner: { borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12, marginTop: 4 },
  bannerTitle: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  retryBtn: { marginTop: 10, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { fontSize: 13, fontWeight: '700', color: 'white' },
});

export default Phan2Bai5;
