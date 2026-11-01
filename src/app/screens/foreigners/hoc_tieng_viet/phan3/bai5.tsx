// Phần 3 - Bài 5: Bài tập tổng hợp (Comprehensive Practice)
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, TextInput, Alert,
} from 'react-native';

const THEME = '#059669';
type SectionKey = 'tracNghiem' | 'dienTu' | 'nguPhap' | 'hoiThoai' | 'nghe';
interface Props { navigation: any; }

// ─────────────────────────────────────────────────────────────
// DATA - Phần 3: Chủ đề hội thoại (tự giới thiệu, hỏi tên, quốc tịch, nghề nghiệp, nơi ở)
// ─────────────────────────────────────────────────────────────

// 1. TRẮC NGHIỆM
const tracNghiemData = [
  { id: 1, cat: '📚 Từ vựng', q: '"Tên" nghĩa tiếng Anh là gì?', opts: ['A. age', 'B. name', 'C. job', 'D. address', 'E. country'], ans: 'B' },
  { id: 2, cat: '📖 Ngữ pháp', q: '"Anh ___ người nước nào?" – Chọn đúng:', opts: ['A. là', 'B. có', 'C. làm', 'D. ở', 'E. đi'], ans: 'A' },
  { id: 3, cat: '🔊 Phát âm', q: 'Từ "Việt Nam" có bao nhiêu thanh điệu?', opts: ['A. 1', 'B. 2', 'C. 3', 'D. 0', 'E. 4'], ans: 'B' },
  { id: 4, cat: '📚 Từ vựng', q: '"Nghề nghiệp" nghĩa tiếng Anh là:', opts: ['A. nationality', 'B. occupation', 'C. address', 'D. hobby', 'E. family'], ans: 'B' },
  { id: 5, cat: '📖 Ngữ pháp', q: 'Câu hỏi tên đúng là:', opts: ['A. Anh tên gì?', 'B. Anh gì tên?', 'C. Tên anh gì?', 'D. Gì tên anh?', 'E. Tên gì anh?'], ans: 'A' },
  { id: 6, cat: '🔊 Phát âm', q: 'Từ "xin lỗi" phát âm đúng thanh điệu là:', opts: ['A. ngang – sắc', 'B. ngang – ngã', 'C. hỏi – nặng', 'D. sắc – huyền', 'E. hỏi – sắc'], ans: 'B' },
  { id: 7, cat: '📚 Từ vựng', q: '"Quê hương" nghĩa là:', opts: ['A. hometown', 'B. workplace', 'C. school', 'D. country', 'E. street'], ans: 'A' },
  { id: 8, cat: '📖 Ngữ pháp', q: '"Cô ___ làm gì?" – Chọn đúng:', opts: ['A. đang', 'B. là', 'C. có', 'D. ở', 'E. muốn'], ans: 'A' },
  { id: 9, cat: '🔊 Phát âm', q: 'Từ "người" thuộc thanh điệu:', opts: ['A. ngang', 'B. huyền', 'C. sắc', 'D. nặng', 'E. hỏi'], ans: 'B' },
  { id: 10, cat: '📚 Từ vựng', q: '"Sống" trong "Bạn sống ở đâu?" nghĩa là:', opts: ['A. work', 'B. study', 'C. live', 'D. travel', 'E. eat'], ans: 'C' },
];

// 2. ĐIỀN TỪ
const dienTuDang1Data = [
  { id: 1, sentence: 'Xin ___, anh tên gì?', wordBank: ['lỗi', 'chào', 'cảm ơn', 'vui'], ans: 'lỗi' },
  { id: 2, sentence: 'Tôi ___ người Nhật.', wordBank: ['là', 'có', 'ở', 'làm'], ans: 'là' },
  { id: 3, sentence: 'Cô ấy ___ bác sĩ ở bệnh viện Chợ Rẫy.', wordBank: ['làm', 'là', 'có', 'ở'], ans: 'làm' },
  { id: 4, sentence: 'Bây giờ anh sống ___ đâu?', wordBank: ['ở', 'từ', 'đến', 'tại'], ans: 'ở' },
];

const dienTuDang2Data = [
  { id: 1, emoji: '🇯🇵', hint: 'Quốc gia ở Đông Á nổi tiếng với sushi', ans: 'Nhật Bản' },
  { id: 2, emoji: '👨‍⚕️', hint: 'Người chữa bệnh cho bệnh nhân', ans: 'bác sĩ' },
  { id: 3, emoji: '🏠', hint: 'Nơi bạn sinh sống hàng ngày', ans: 'nhà' },
  { id: 4, emoji: '🏫', hint: 'Nơi học sinh đến học', ans: 'trường học' },
];

const dienTuDang3Data = [
  { id: 1, emoji: '👋', shuffled: ['I', 'S', 'N', 'L', 'Ỗ', ' ', 'X'], ans: 'XIN LỖI' },
  { id: 2, emoji: '🌍', shuffled: ['C', 'N', 'Ư', 'Ớ', 'C', ' ', 'N', 'À', 'O'], ans: 'NƯỚC NÀO' },
  { id: 3, emoji: '💼', shuffled: ['N', 'G', 'H', 'Ệ', 'I','P',' ', 'G', 'H', 'Ề','N'], ans: 'NGHỀ NGHIỆP' },
];

// 3. NGỮ PHÁP
const nguPhapDang1Data = [
  { id: 1, sentence: 'Tôi ___ tên là Hana.', wordBank: ['tự', 'xin', 'rất', 'cũng'], ans: 'tự' },
  { id: 2, sentence: 'Anh ấy ___ kỹ sư ở công ty lớn.', wordBank: ['là', 'làm', 'có', 'ở'], ans: 'là' },
  { id: 3, sentence: 'Bạn đến từ ___ nào?', wordBank: ['nước', 'đâu', 'chỗ', 'quê'], ans: 'nước' },
];

const nguPhapDang2Data = [
  { id: 1, original: 'Anh ấy là người Hàn Quốc. Anh ấy làm kỹ sư.', rewrite: 'Anh ấy là ___ Hàn Quốc làm kỹ sư.', ans: 'người' },
  { id: 2, original: 'Cô ấy sống ở Hà Nội. Nhà cô ở quận 1.', rewrite: 'Cô ấy sống ___ Hà Nội, quận 1.', ans: 'ở' },
  { id: 3, original: 'Tôi muốn học tiếng Việt. Tôi muốn học để làm việc.', rewrite: 'Tôi muốn học tiếng Việt ___ làm việc.', ans: 'để' },
  { id: 4, original: 'Anh tên gì? Tên anh là Pedro.', rewrite: 'Tên ___ là Pedro.', ans: 'anh' },
];

const nguPhapDang3Data = [
  { id: 1, words: ['gì', 'Anh', 'tên'], ans: 'Anh tên gì' },
  { id: 2, words: ['Nhật', 'người', 'tôi', 'Bản', 'là'], ans: 'Tôi là người Nhật Bản' },
  { id: 3, words: ['đâu', 'sống', 'ở', 'Bạn'], ans: 'Bạn sống ở đâu' },
];

const nguPhapDang4Data = [
  { id: 1, emoji: '🌍', words: ['nước', 'Anh', 'nào', 'người', 'là'], ans: 'Anh là người nước nào' },
  { id: 2, emoji: '💼', words: ['làm', 'Cô', 'gì', 'ấy'], ans: 'Cô ấy làm gì' },
  { id: 3, emoji: '🏠', words: ['ở', 'bây giờ', 'đâu', 'sống', 'Anh'], ans: 'Bây giờ anh sống ở đâu' },
];

// 4. HỘI THOẠI
const hoiThoaiDang1Data = [
  { id: 1, q: 'A: "Xin lỗi, anh tên gì?" – B đáp:', opts: ['A. Tôi tên là Kenji.', 'B. Tôi là người Nhật.', 'C. Tôi sống ở Hà Nội.', 'D. Tôi làm kỹ sư.', 'E. Tôi đến từ Tokyo.'], ans: 'A' },
  { id: 2, q: 'A: "Cô là người nước nào?" – B đáp:', opts: ['A. Tôi là người Hàn Quốc.', 'B. Tôi tên là Min.', 'C. Tôi làm giáo viên.', 'D. Tôi sống ở Sài Gòn.', 'E. Tôi học tiếng Việt.'], ans: 'A' },
  { id: 3, q: 'A: "Dạo này bạn làm gì?" – B đáp:', opts: ['A. Tôi đang làm việc ở công ty.', 'B. Tôi tên là Ana.', 'C. Tôi ở Hà Nội.', 'D. Tôi là người Pháp.', 'E. Tôi học lớp 3.'], ans: 'A' },
  { id: 4, q: '"Bây giờ cô sống ở đâu?" – Đây là câu hỏi về:', opts: ['A. Nơi sinh sống', 'B. Tên', 'C. Quốc tịch', 'D. Nghề nghiệp', 'E. Tuổi'], ans: 'A' },
];

const hoiThoaiDang2Data = [
  {
    id: 1, title: 'Tự giới thiệu',
    lines: [
      { key: 'D', text: 'A: Xin lỗi, anh tên gì?' },
      { key: 'A', text: 'B: Tôi tên là Pedro, tôi là người Tây Ban Nha.' },
      { key: 'C', text: 'A: Anh làm nghề gì?' },
      { key: 'B', text: 'B: Tôi làm kỹ sư ở một công ty ở Hà Nội.' },
    ],
    ans: ['D', 'A', 'C', 'B'],
  },
  {
    id: 2, title: 'Gặp nhau lần đầu',
    lines: [
      { key: 'C', text: 'X: Chào! Tôi tên là Min. Còn bạn?' },
      { key: 'B', text: 'Y: Tôi tên là Hana, tôi người Nhật.' },
      { key: 'A', text: 'X: Bạn sống ở đâu?' },
      { key: 'D', text: 'Y: Tôi sống ở quận 1, TP.HCM.' },
    ],
    ans: ['C', 'B', 'A', 'D'],
  },
];

const hoiThoaiDang3Data = [
  { id: 1, dialogue: 'A: Anh ___ người nước nào? B: Tôi là người Mỹ.', blank: 'là', wordBank: ['là', 'làm', 'có', 'sống'] },
  { id: 2, dialogue: 'A: Dạo này cô ___ gì? B: Tôi đang học tiếng Việt.', blank: 'làm', wordBank: ['làm', 'là', 'ở', 'đến'] },
  { id: 3, dialogue: 'A: Bạn sống ___ đâu? B: Tôi sống ở Đà Nẵng.', blank: 'ở', wordBank: ['ở', 'từ', 'đến', 'tại'] },
];

// 5. NGHE
const ngheDang1Data = [
  { id: 1, audio: '🔊 "Xin lỗi, anh tên gì?"', opts: ['A. Hỏi tên', 'B. Hỏi tuổi', 'C. Hỏi địa chỉ', 'D. Hỏi quốc tịch', 'E. Hỏi nghề nghiệp'], ans: 'A' },
  { id: 2, audio: '🔊 "Cô là người Hàn Quốc."', opts: ['A. Nhật Bản', 'B. Hàn Quốc', 'C. Trung Quốc', 'D. Mỹ', 'E. Pháp'], ans: 'B' },
  { id: 3, audio: '🔊 "Anh ấy làm bác sĩ."', opts: ['A. Kỹ sư', 'B. Giáo viên', 'C. Bác sĩ', 'D. Luật sư', 'E. Kế toán'], ans: 'C' },
  { id: 4, audio: '🔊 "Tôi đang sống ở Hà Nội."', opts: ['A. Thành phố Hồ Chí Minh', 'B. Đà Nẵng', 'C. Huế', 'D. Hà Nội', 'E. Cần Thơ'], ans: 'D' },
];

const ngheDang2Data = [
  { id: 1, audio: '🔊 "Tôi ___ Pedro, mình sống ở nước Tây Ban Nha."', ans: 'tên là' },
  { id: 2, audio: '🔊 "Dạo này anh ___ gì thế?"', ans: 'làm' },
  { id: 3, audio: '🔊 "Bây giờ tôi sống ___ Hà Nội."', ans: 'ở' },
];

const ngheDang3Data = [
  { id: 1, audio: '🔊 "Đây là bác sĩ."', emojis: ['👨‍⚕️', '👨‍🏫', '👨‍💼', '👨‍🍳', '👮'], ans: '👨‍⚕️' },
  { id: 2, audio: '🔊 "Cô ấy là người Nhật Bản."', emojis: ['🇯🇵', '🇰🇷', '🇨🇳', '🇺🇸', '🇫🇷'], ans: '🇯🇵' },
  { id: 3, audio: '🔊 "Anh đi khám bệnh ở bệnh viện Từ Dũ Thành phố Hồ Chí Minh."', emojis: ['🏠', '🏫', '🏥', '🏢', '✈️'], ans: '🏥' },
];

// ─────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────
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
// TRẮC NGHIỆM
// ─────────────────────────────────────────────────────────────
const TracNghiemSection: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!tracNghiemData.every(q => answers[q.id])) { Alert.alert('Chưa xong!', 'Chọn tất cả đáp án.'); return; }
    setSubmitted(true);
    const ok = tracNghiemData.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
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
              <TouchableOpacity key={opt} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: letter }))}
                style={[styles.optBtn, chosen && !submitted && { borderColor: THEME, backgroundColor: '#D1FAE5' }, isCorrect && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, isWrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
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
// ĐIỀN TỪ
// ─────────────────────────────────────────────────────────────
const DienTuDang1: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!dienTuDang1Data.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = dienTuDang1Data.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 12000);
  };

  const allCorrect = submitted && dienTuDang1Data.every(q => answers[q.id] === q.ans);

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 1: Chọn từ điền vào chỗ trống</Text>
      {dienTuDang1Data.map(q => {
        const parts = q.sentence.split('___');
        const isCorrect = submitted && answers[q.id] === q.ans;
        const isWrong = submitted && answers[q.id] !== q.ans;
        return (
          <View key={q.id} style={styles.questionCard}>
            <View style={styles.sentenceRow}>
              <Text style={styles.sentText}>{parts[0]}</Text>
              <View style={[styles.blankBox, isCorrect && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, isWrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.blankText, isWrong && { color: '#DC2626' }]}>{answers[q.id] || '   '}</Text>
              </View>
              <Text style={styles.sentText}>{parts[1] || ''}</Text>
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

const DienTuDang2: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!dienTuDang2Data.every(q => answers[q.id]?.trim())) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = dienTuDang2Data.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
  };

  const allCorrect = submitted && dienTuDang2Data.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 2: Nhìn hình – Gõ từ</Text>
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
              onChangeText={t => !submitted && setAnswers(p => ({ ...p, [q.id]: t }))}
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

const DienTuDang3: React.FC = () => {
  const [arranged, setArranged] = useState<Record<number, string[]>>(
    Object.fromEntries(dienTuDang3Data.map(q => [q.id, [...q.shuffled].sort(() => Math.random() - 0.5)]))
  );
  const [answers, setAnswers] = useState<Record<number, string[]>>(
    Object.fromEntries(dienTuDang3Data.map(q => [q.id, []]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const moveLetter = (qid: number, letter: string, from: 'bank' | 'answer') => {
    if (submitted) return;
    if (from === 'bank') {
      setArranged(prev => {
        const idx = prev[qid].indexOf(letter); if (idx === -1) return prev;
        const n = [...prev[qid]]; n.splice(idx, 1);
        return { ...prev, [qid]: n };
      });
      setAnswers(prev => ({ ...prev, [qid]: [...prev[qid], letter] }));
    } else {
      setAnswers(prev => {
        const idx = prev[qid].indexOf(letter); if (idx === -1) return prev;
        const n = [...prev[qid]]; n.splice(idx, 1);
        return { ...prev, [qid]: n };
      });
      setArranged(prev => ({ ...prev, [qid]: [...prev[qid], letter] }));
    }
  };

  const handleSubmit = () => {
    if (!dienTuDang3Data.every(q => answers[q.id].length > 0)) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = dienTuDang3Data.every(q => answers[q.id].join('') === q.ans.replace(/ /g, ''));
    setShowResult(true);
    if (!ok) setTimeout(() => {
      setSubmitted(false); setShowResult(false);
      setArranged(Object.fromEntries(dienTuDang3Data.map(q => [q.id, [...q.shuffled].sort(() => Math.random() - 0.5)])));
      setAnswers(Object.fromEntries(dienTuDang3Data.map(q => [q.id, []])));
    }, 120000);
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
            <View style={[styles.letterRow, correct && { backgroundColor: '#D1FAE5' }, wrong && { backgroundColor: '#FEE2E2' }]}>
              {answers[q.id].length === 0
                ? <Text style={styles.placeholder}>Nhấn chữ cái để xếp...</Text>
                : answers[q.id].map((l, i) => (
                  <TouchableOpacity key={`a${i}`} onPress={() => moveLetter(q.id, l, 'answer')} style={[styles.letterChip, { backgroundColor: correct ? '#059669' : wrong ? '#DC2626' : THEME }]}>
                    <Text style={styles.letterChipText}>{l}</Text>
                  </TouchableOpacity>
                ))}
            </View>
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
// NGỮ PHÁP
// ─────────────────────────────────────────────────────────────
const NguPhapDang1: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!nguPhapDang1Data.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = nguPhapDang1Data.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
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
              <View style={[styles.blankBox, submitted && answers[q.id] === q.ans && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, submitted && answers[q.id] !== q.ans && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={styles.blankText}>{answers[q.id] || '   '}</Text>
              </View>
              <Text style={styles.sentText}>{parts[1] || ''}</Text>
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
    if (!nguPhapDang2Data.every(q => answers[q.id]?.trim())) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = nguPhapDang2Data.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
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
              <Text style={styles.sentText}>{parts[1] || ''}</Text>
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
        const idx = cur.bank.indexOf(word); if (idx === -1) return prev;
        const bank = [...cur.bank]; bank.splice(idx, 1);
        return { ...prev, [qid]: { bank, answer: [...cur.answer, word] } };
      } else {
        const idx = cur.answer.indexOf(word); if (idx === -1) return prev;
        const answer = [...cur.answer]; answer.splice(idx, 1);
        return { ...prev, [qid]: { bank: [...cur.bank, word], answer } };
      }
    });
  };

  const handleSubmit = () => {
    if (!nguPhapDang3Data.every(q => arrangements[q.id].answer.length > 0)) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = nguPhapDang3Data.every(q => arrangements[q.id].answer.join(' ') === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => {
      setSubmitted(false); setShowResult(false);
      setArrangements(Object.fromEntries(nguPhapDang3Data.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
    }, 120000);
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
        const idx = cur.bank.indexOf(word); if (idx === -1) return prev;
        const bank = [...cur.bank]; bank.splice(idx, 1);
        return { ...prev, [qid]: { bank, answer: [...cur.answer, word] } };
      } else {
        const idx = cur.answer.indexOf(word); if (idx === -1) return prev;
        const answer = [...cur.answer]; answer.splice(idx, 1);
        return { ...prev, [qid]: { bank: [...cur.bank, word], answer } };
      }
    });
  };

  const handleSubmit = () => {
    if (!nguPhapDang4Data.every(q => arrangements[q.id].answer.length > 0)) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = nguPhapDang4Data.every(q => arrangements[q.id].answer.join(' ') === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => {
      setSubmitted(false); setShowResult(false);
      setArrangements(Object.fromEntries(nguPhapDang4Data.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
    }, 120000);
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
// HỘI THOẠI
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
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
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
                style={[styles.optBtn, chosen && !submitted && { borderColor: THEME, backgroundColor: '#D1FAE5' }, correct && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, wrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
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
    }, 120000);
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
                    <TouchableOpacity onPress={() => moveUp(d.id, idx)}><Text style={[styles.arrow, { color: THEME }]}>▲</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => moveDown(d.id, idx)}><Text style={[styles.arrow, { color: THEME }]}>▼</Text></TouchableOpacity>
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
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
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
            <Text style={styles.questionText}>💬 {parts[0]}[___]{parts[1]}</Text>
            <View style={styles.wordBankRow}>
              {q.wordBank.map(w => (
                <TouchableOpacity key={w} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: w }))}
                  style={[styles.wordChip, answers[q.id] === w && { backgroundColor: THEME }, correct && answers[q.id] === w && { backgroundColor: '#059669' }, wrong && answers[q.id] === w && { backgroundColor: '#DC2626' }]}>
                  <Text style={[styles.wordChipText, answers[q.id] === w && { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
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
// NGHE
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
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
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
                style={[styles.optBtn, chosen && !submitted && { borderColor: THEME, backgroundColor: '#D1FAE5' }, correct && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, wrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
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
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
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
            <View style={[styles.audioPill, { flexWrap: 'wrap' }]}>
              <Text style={styles.audioText}>{parts[0]}</Text>
              <TextInput
                style={[styles.inlineInput, correct && { borderColor: '#059669', color: '#059669' }, wrong && { borderColor: '#DC2626', color: '#DC2626' }]}
                value={answers[q.id] || ''}
                onChangeText={t => !submitted && setAnswers(p => ({ ...p, [q.id]: t }))}
                editable={!submitted}
                placeholder="..."
              />
              <Text style={styles.audioText}>{parts[1] || ''}</Text>
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
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
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

const Phan3Bai5: React.FC<Props> = ({ navigation }) => {
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
      <View style={[styles.header, { backgroundColor: THEME }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBai}>BÀI 5</Text>
          <Text style={styles.headerTitle}>Bài tập tổng hợp Phần 3</Text>
          <Text style={styles.headerSub}>Comprehensive Practice Part 3</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabContainer}>
        {SECTIONS.map(s => (
          <TouchableOpacity key={s.key} onPress={() => setActiveSection(s.key)} style={[styles.tab, activeSection === s.key && { backgroundColor: THEME, borderColor: THEME }]}>
            <Text style={[styles.tabText, activeSection === s.key && { color: 'white' }]}>{s.emoji} {s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
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
  sentText: { fontSize: 14, color: '#334155', lineHeight: 22 },
  blankBox: { borderBottomWidth: 2, borderColor: THEME, minWidth: 70, alignItems: 'center', marginHorizontal: 4, paddingHorizontal: 8, paddingVertical: 4 },
  blankText: { fontSize: 14, color: '#1E293B', fontWeight: '600' },

  wordBankRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, minHeight: 44, backgroundColor: '#F1F5F9', borderRadius: 10, padding: 10, marginBottom: 10 },
  wordChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: '#CBD5E1' },
  wordChipText: { fontSize: 13, fontWeight: '600', color: '#334155' },

  bigEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  hintText: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 12, fontStyle: 'italic' },
  typeInput: { borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 10, padding: 12, fontSize: 14, color: '#1E293B', backgroundColor: '#F8FAFC' },
  inlineInput: { borderBottomWidth: 2, borderColor: THEME, minWidth: 70, paddingHorizontal: 6, fontSize: 14, color: '#1E293B', marginHorizontal: 4 },
  correctHint: { fontSize: 12, color: '#059669', fontWeight: '600', marginTop: 6 },
  originalSent: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginBottom: 10, backgroundColor: '#F1F5F9', padding: 8, borderRadius: 8 },

  letterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, minHeight: 44, backgroundColor: '#F1F5F9', borderRadius: 10, padding: 10, marginBottom: 10 },
  letterChip: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  letterChipText: { fontSize: 14, fontWeight: '700', color: 'white' },
  placeholder: { fontSize: 12, color: '#94A3B8', alignSelf: 'center' },

  dialogueLine: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, marginBottom: 8 },
  arrowBtns: { marginRight: 10 },
  arrow: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  dialogueText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 18 },

  audioPill: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#D1FAE5', borderRadius: 12, padding: 12, marginBottom: 12 },
  audioText: { fontSize: 13, color: '#065F46', fontWeight: '600', lineHeight: 20 },

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

export default Phan3Bai5;
