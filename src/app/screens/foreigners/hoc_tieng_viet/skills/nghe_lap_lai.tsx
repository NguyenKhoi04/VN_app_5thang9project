// Kỹ năng 2: Nghe và lập lại
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BaseSkillContent, { ContentCard, PlayButton } from '../BaseSkillContent';

interface Props { navigation: any; route: any; }

const NgheLapLaiScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId = 1, themeColor = '#4F46E5' } = route?.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recorded, setRecorded] = useState(false);

  const phrases = [
    { vn: 'Xin chào!', en: 'Hello!' },
    { vn: 'Cảm ơn bạn.', en: 'Thank you.' },
    { vn: 'Tạm biệt!', en: 'Goodbye!' },
    { vn: 'Vâng, được.', en: 'Yes, okay.' },
    { vn: 'Không, cảm ơn.', en: 'No, thank you.' },
  ];

  const current = phrases[currentIndex];

  return (
    <BaseSkillContent
      navigation={navigation}
      skillTitle="Nghe và lập lại"
      skillSubtitle="Listen and Repeat"
      skillNumber="2"
      emoji="👂"
      themeColor={themeColor}
    >
      {/* Progress */}
      <ContentCard title="Tiến độ • Progress">
        <View style={styles.progressRow}>
          {phrases.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor: i < currentIndex ? themeColor : i === currentIndex ? themeColor + 'AA' : '#E2E8F0',
                  width: i === currentIndex ? 28 : 16,
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>{currentIndex + 1} / {phrases.length} câu • sentences</Text>
      </ContentCard>

      {/* Current phrase */}
      <View style={[styles.phraseCard, { borderColor: themeColor, borderWidth: 2 }]}>
        <Text style={styles.phraseVn}>{current.vn}</Text>
        <Text style={styles.phraseEn}>{current.en}</Text>
        <PlayButton label="Nghe câu mẫu • Listen" color={themeColor} />
      </View>

      {/* Record button */}
      <TouchableOpacity
        style={[styles.recordBtn, { backgroundColor: recorded ? '#10B981' : themeColor }]}
        onPress={() => setRecorded(!recorded)}
        activeOpacity={0.8}
      >
        <Text style={styles.recordIcon}>{recorded ? '✓' : '🎤'}</Text>
        <Text style={styles.recordText}>
          {recorded ? 'Đã ghi âm ✓ • Recorded' : 'Nhấn để đọc • Tap to speak'}
        </Text>
      </TouchableOpacity>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, { opacity: currentIndex === 0 ? 0.4 : 1 }]}
          onPress={() => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setRecorded(false); } }}
          disabled={currentIndex === 0}
        >
          <Text style={[styles.navBtnText, { color: themeColor }]}>◀ Câu trước</Text>
          <Text style={styles.navBtnSub}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, { opacity: currentIndex === phrases.length - 1 ? 0.4 : 1 }]}
          onPress={() => { if (currentIndex < phrases.length - 1) { setCurrentIndex(currentIndex + 1); setRecorded(false); } }}
          disabled={currentIndex === phrases.length - 1}
        >
          <Text style={[styles.navBtnText, { color: themeColor }]}>Câu sau ▶</Text>
          <Text style={styles.navBtnSub}>Next</Text>
        </TouchableOpacity>
      </View>

      <ContentCard title="💡 Hướng dẫn • Instructions">
        <Text style={styles.hint}>
          1. Nhấn "Nghe câu mẫu" để nghe phát âm chuẩn.{'\n'}
          <Text style={styles.hintEn}>1. Tap "Listen" to hear correct pronunciation.{'\n'}</Text>
          2. Nhấn "Ghi âm" để luyện tập đọc theo.{'\n'}
          <Text style={styles.hintEn}>2. Tap "Record" to practice repeating.{'\n'}</Text>
          3. So sánh giọng đọc của bạn với mẫu.{'\n'}
          <Text style={styles.hintEn}>3. Compare your pronunciation with the model.</Text>
        </Text>
      </ContentCard>
    </BaseSkillContent>
  );
};

const styles = StyleSheet.create({
  progressRow: { flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 8 },
  progressDot: { height: 8, borderRadius: 4 },
  progressText: { fontSize: 12, color: '#64748B' },
  phraseCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  phraseVn: { fontSize: 28, fontWeight: '800', color: '#1E293B', textAlign: 'center', marginBottom: 8 },
  phraseEn: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 12, fontStyle: 'italic' },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 18,
    gap: 10,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  recordIcon: { fontSize: 24 },
  recordText: { fontSize: 16, fontWeight: '700', color: 'white' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14, gap: 10 },
  navBtn: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  navBtnText: { fontSize: 14, fontWeight: '700' },
  navBtnSub: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  hint: { fontSize: 13, color: '#334155', lineHeight: 22 },
  hintEn: { fontSize: 11, color: '#64748B', fontStyle: 'italic' },
});

export default NgheLapLaiScreen;
