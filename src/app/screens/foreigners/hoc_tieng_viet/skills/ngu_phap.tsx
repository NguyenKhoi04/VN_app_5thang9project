// Kỹ năng 4: Ngữ pháp
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BaseSkillContent, { ContentCard } from '../BaseSkillContent';

interface Props { navigation: any; route: any; }

const NguPhapScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId = 1, themeColor = '#4F46E5' } = route?.params || {};
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const quiz = {
    question: 'Chọn câu đúng • Choose the correct sentence',
    options: [
      { vn: 'Tôi tên là Nam.', en: 'My name is Nam. ✓', correct: true },
      { vn: 'Nam tên là tôi.', en: 'Incorrect word order', correct: false },
      { vn: 'Tên tôi là Nam.', en: 'Also correct (formal)', correct: true },
      { vn: 'Là Nam tôi tên.', en: 'Incorrect word order', correct: false },
    ],
  };

  return (
    <BaseSkillContent
      navigation={navigation}
      skillTitle="Ngữ pháp"
      skillSubtitle="Grammar"
      skillNumber="4"
      emoji="📐"
      themeColor={themeColor}
    >
      {/* Sentence structure */}
      <ContentCard title="📌 Cấu trúc câu cơ bản • Basic Sentence Structure">
        <View style={[styles.structureBox, { borderLeftColor: themeColor }]}>
          <Text style={styles.structureFormula}>S + V + O</Text>
          <Text style={styles.structureSub}>Chủ ngữ + Vị ngữ + Tân ngữ{'\n'}Subject + Verb + Object</Text>
        </View>
        <View style={styles.exampleRow}>
          <View style={[styles.partBox, { backgroundColor: '#EEF2FF' }]}>
            <Text style={styles.partLabel}>Chủ ngữ{'\n'}Subject</Text>
            <Text style={[styles.partWord, { color: '#4F46E5' }]}>Tôi</Text>
            <Text style={styles.partWordEn}>I</Text>
          </View>
          <Text style={styles.plus}>+</Text>
          <View style={[styles.partBox, { backgroundColor: '#F0FDF4' }]}>
            <Text style={styles.partLabel}>Vị ngữ{'\n'}Verb</Text>
            <Text style={[styles.partWord, { color: '#059669' }]}>học</Text>
            <Text style={styles.partWordEn}>study</Text>
          </View>
          <Text style={styles.plus}>+</Text>
          <View style={[styles.partBox, { backgroundColor: '#FFF7ED' }]}>
            <Text style={styles.partLabel}>Tân ngữ{'\n'}Object</Text>
            <Text style={[styles.partWord, { color: '#D97706' }]}>tiếng Việt</Text>
            <Text style={styles.partWordEn}>Vietnamese</Text>
          </View>
        </View>
        <Text style={styles.fullSentence}>→ Tôi học tiếng Việt.</Text>
        <Text style={styles.fullSentenceEn}>→ I study Vietnamese.</Text>
      </ContentCard>

      {/* Grammar rules */}
      <ContentCard title="📖 Quy tắc ngữ pháp • Grammar Rules">
        {[
          { rule: 'Tính từ đứng SAU danh từ', ruleEn: 'Adjectives come AFTER nouns', example: 'nhà đẹp (beautiful house)', exampleLiteral: 'house beautiful' },
          { rule: 'Không có biến đổi động từ theo thì', ruleEn: 'No verb conjugation by tense', example: 'tôi ăn / tôi đã ăn / tôi sẽ ăn', exampleLiteral: 'I eat / I past eat / I will eat' },
          { rule: 'Phủ định: không + động từ', ruleEn: 'Negation: không + verb', example: 'Tôi không biết. (I don\'t know.)', exampleLiteral: 'I không know.' },
        ].map((item, i) => (
          <View key={i} style={styles.ruleCard}>
            <View style={[styles.ruleDot, { backgroundColor: themeColor }]}>
              <Text style={styles.ruleDotText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ruleText}>{item.rule}</Text>
              <Text style={styles.ruleEn}>{item.ruleEn}</Text>
              <View style={[styles.exBox, { borderLeftColor: themeColor }]}>
                <Text style={styles.exText}>VD: {item.example}</Text>
                <Text style={styles.exLiteral}>Literal: {item.exampleLiteral}</Text>
              </View>
            </View>
          </View>
        ))}
      </ContentCard>

      {/* Quiz */}
      <ContentCard title="✅ Bài kiểm tra nhỏ • Quick Quiz">
        <Text style={styles.quizQ}>{quiz.question}</Text>
        {quiz.options.map((opt, i) => {
          const isSelected = quizAnswer === i;
          const isCorrect = opt.correct;
          let bg = '#F8FAFC';
          let border = '#E2E8F0';
          if (showResult && isSelected) {
            bg = isCorrect ? '#ECFDF5' : '#FEF2F2';
            border = isCorrect ? '#10B981' : '#EF4444';
          } else if (isSelected) {
            bg = themeColor + '15';
            border = themeColor;
          }
          return (
            <TouchableOpacity
              key={i}
              style={[styles.option, { backgroundColor: bg, borderColor: border }]}
              onPress={() => { setQuizAnswer(i); setShowResult(false); }}
            >
              <Text style={styles.optionVn}>{opt.vn}</Text>
              {showResult && <Text style={styles.optionResult}>{opt.en}</Text>}
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={[styles.checkBtn, { backgroundColor: themeColor, opacity: quizAnswer === null ? 0.5 : 1 }]}
          onPress={() => setShowResult(true)}
          disabled={quizAnswer === null}
        >
          <Text style={styles.checkBtnText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      </ContentCard>
    </BaseSkillContent>
  );
};

const styles = StyleSheet.create({
  structureBox: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    marginBottom: 16,
  },
  structureFormula: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  structureSub: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 },
  exampleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  partBox: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  partLabel: { fontSize: 9, color: '#64748B', textAlign: 'center', lineHeight: 13 },
  partWord: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  partWordEn: { fontSize: 9, color: '#94A3B8' },
  plus: { fontSize: 18, color: '#94A3B8', fontWeight: '300' },
  fullSentence: { fontSize: 17, fontWeight: '700', color: '#1E293B', marginTop: 8 },
  fullSentenceEn: { fontSize: 13, color: '#64748B', fontStyle: 'italic', marginTop: 3 },
  ruleCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  ruleDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  ruleDotText: { fontSize: 13, fontWeight: '800', color: 'white' },
  ruleText: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  ruleEn: { fontSize: 11, color: '#64748B', marginTop: 2 },
  exBox: { borderLeftWidth: 2, paddingLeft: 10, marginTop: 6 },
  exText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  exLiteral: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginTop: 2 },
  quizQ: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 12 },
  option: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  optionVn: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  optionResult: { fontSize: 11, color: '#64748B', marginTop: 4, fontStyle: 'italic' },
  checkBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  checkBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
});

export default NguPhapScreen;
