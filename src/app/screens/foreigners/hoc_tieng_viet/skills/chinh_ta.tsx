// Kỹ năng 6: Viết chính tả
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import BaseSkillContent, { ContentCard, PlayButton } from '../BaseSkillContent';
import { API_ENDPOINTS } from '../../../../../config/api';

interface Props { navigation: any; route: any; }

const DEFAULT_WORDS = [
  { word: 'xin chào', hint: 'Greeting • Lời chào', audio: '🎵' },
  { word: 'cảm ơn', hint: 'Thank you • Cảm ơn', audio: '🎵' },
  { word: 'tạm biệt', hint: 'Goodbye • Tạm biệt', audio: '🎵' },
  { word: 'Việt Nam', hint: 'Country name • Tên quốc gia', audio: '🎵' },
  { word: 'tiếng Việt', hint: 'Vietnamese language • Ngôn ngữ', audio: '🎵' },
];

const DEFAULT_TIPS = [
  { vn: 'Tiếng Việt có dấu thanh và dấu phụ', en: 'Vietnamese has tone marks and diacritics' },
  { vn: 'Ví dụ: a → ă → â (3 âm khác nhau)', en: 'Example: a → ă → â (3 different sounds)' },
  { vn: 'Viết hoa chữ cái đầu câu và tên riêng', en: 'Capitalize first letter of sentence and proper nouns' },
];

const ChinhTaScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId = 1, baiHocId, themeColor = '#4F46E5' } = route?.params || {};
  const currentBaiHocId = baiHocId || lessonId;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [dictationWords, setDictationWords] = useState(DEFAULT_WORDS);
  const [tips, setTips] = useState(DEFAULT_TIPS);

  useEffect(() => {
    let isMounted = true;
    fetch(API_ENDPOINTS.GET_NN_BAI_HOC_CHI_TIET_KY_NANG(currentBaiHocId, 6))
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted) return;
        if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
          const row = res.data[0];
          let wordsList: { word: string; hint: string; audio: string }[] = [];
          if (Array.isArray(row.noi_dung_chinh) && row.noi_dung_chinh.length > 0) {
            wordsList = row.noi_dung_chinh.map((item: any) => ({
              word: item.tu_vn || item.word || '',
              hint: item.goi_y_en || item.hint || 'Luyện viết từ',
              audio: '🎵',
            })).filter((x: any) => x.word);
          }
          if (wordsList.length === 0 && Array.isArray(res?.bai_tap_bo_tro) && res.bai_tap_bo_tro.length > 0) {
            wordsList = res.bai_tap_bo_tro.map((item: any) => ({
              word: item.tu_tv || '',
              hint: item.goi_y || 'Luyện viết từ',
              audio: '🎵',
            })).filter((x: any) => x.word);
          }
          if (wordsList.length > 0) {
            setDictationWords(wordsList);
            setCurrentIdx(0);
            setInput('');
            setChecked(false);
            setScore(0);
          }

          if (row.noi_dung_phu && Array.isArray(row.noi_dung_phu.danh_sach) && row.noi_dung_phu.danh_sach.length > 0) {
            setTips(row.noi_dung_phu.danh_sach.map((t: any) => ({
              vn: t.vn || '',
              en: t.en || '',
            })));
          }
        }
      })
      .catch((err) => {
        console.log('Using default dictation words fallback:', err.message);
      });
    return () => { isMounted = false; };
  }, [currentBaiHocId]);

  const current = dictationWords[currentIdx];
  const isCorrect = input.trim().toLowerCase() === current.word.toLowerCase();

  const handleCheck = () => {
    setChecked(true);
    if (isCorrect) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentIdx < dictationWords.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setInput('');
      setChecked(false);
    }
  };

  return (
    <BaseSkillContent
      navigation={navigation}
      skillTitle="Viết chính tả"
      skillSubtitle="Dictation Writing"
      skillNumber="6"
      emoji="✍️"
      themeColor={themeColor}
    >
      {/* Score & progress */}
      <View style={styles.scoreRow}>
        <View style={[styles.scoreBadge, { backgroundColor: themeColor }]}>
          <Text style={styles.scoreNum}>{score}</Text>
          <Text style={styles.scoreLabel}>Điểm{'\n'}Score</Text>
        </View>
        <View style={styles.progressBar}>
          <Text style={styles.progressLabel}>{currentIdx + 1} / {dictationWords.length} từ • words</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, {
              width: `${((currentIdx + 1) / dictationWords.length) * 100}%`,
              backgroundColor: themeColor,
            }]} />
          </View>
        </View>
      </View>

      {/* Dictation card */}
      <ContentCard>
        <Text style={styles.dictInstruct}>
          Nghe và viết lại từ • Listen and write the word
        </Text>

        <TouchableOpacity style={[styles.listenBtn, { backgroundColor: themeColor + '15', borderColor: themeColor }]}>
          <Text style={styles.listenIcon}>🔊</Text>
          <Text style={[styles.listenText, { color: themeColor }]}>Nhấn để nghe • Tap to listen</Text>
        </TouchableOpacity>

        <Text style={styles.hintText}>💡 {current.hint}</Text>

        <TextInput
          style={[
            styles.input,
            { borderColor: checked ? (isCorrect ? '#10B981' : '#EF4444') : '#E2E8F0' },
          ]}
          placeholder="Gõ từ vào đây... • Type here..."
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {checked && (
          <View style={[styles.resultBox, { backgroundColor: isCorrect ? '#ECFDF5' : '#FEF2F2', borderColor: isCorrect ? '#10B981' : '#EF4444' }]}>
            <Text style={styles.resultIcon}>{isCorrect ? '✅' : '❌'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.resultLabel, { color: isCorrect ? '#059669' : '#DC2626' }]}>
                {isCorrect ? 'Đúng! • Correct!' : 'Sai • Incorrect'}
              </Text>
              {!isCorrect && (
                <>
                  <Text style={styles.correctAnswer}>Đáp án đúng: {current.word}</Text>
                  <Text style={styles.correctAnswerEn}>Correct answer: {current.word}</Text>
                </>
              )}
            </View>
          </View>
        )}

        <View style={styles.btnRow}>
          {!checked ? (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: themeColor, opacity: input.length === 0 ? 0.5 : 1 }]}
              onPress={handleCheck}
              disabled={input.length === 0}
            >
              <Text style={styles.actionBtnText}>Kiểm tra • Check</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: currentIdx === dictationWords.length - 1 ? '#10B981' : themeColor }]}
              onPress={handleNext}
            >
              <Text style={styles.actionBtnText}>
                {currentIdx === dictationWords.length - 1 ? '🏁 Hoàn thành • Finish' : 'Từ tiếp theo • Next word ›'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ContentCard>

      {/* Writing tips */}
      <ContentCard title="✏️ Mẹo viết chính tả • Dictation Tips">
        {tips.map((t, idx) => (
          <View key={idx} style={{ marginBottom: 8 }}>
            <Text style={styles.tip}>• {t.vn}</Text>
            <Text style={styles.tipEn}>  {t.en}</Text>
          </View>
        ))}
      </ContentCard>
    </BaseSkillContent>
  );
};

const styles = StyleSheet.create({
  scoreRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  scoreBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum: { fontSize: 22, fontWeight: '900', color: 'white' },
  scoreLabel: { fontSize: 9, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  progressBar: { flex: 1 },
  progressLabel: { fontSize: 12, color: '#64748B', marginBottom: 6 },
  barTrack: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  dictInstruct: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 14, textAlign: 'center' },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 10,
  },
  listenIcon: { fontSize: 22 },
  listenText: { fontSize: 15, fontWeight: '700' },
  hintText: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 12 },
  input: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  resultIcon: { fontSize: 24 },
  resultLabel: { fontSize: 15, fontWeight: '700' },
  correctAnswer: { fontSize: 14, fontWeight: '700', color: '#059669', marginTop: 3 },
  correctAnswerEn: { fontSize: 11, color: '#64748B', fontStyle: 'italic' },
  btnRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  actionBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
  tip: { fontSize: 13, color: '#334155', lineHeight: 22 },
  tipEn: { fontSize: 11, color: '#64748B', fontStyle: 'italic' },
});

export default ChinhTaScreen;
