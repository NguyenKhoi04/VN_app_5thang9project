// Kỹ năng 5: Nhận diện và thay thế
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BaseSkillContent, { ContentCard } from '../BaseSkillContent';
import { API_ENDPOINTS } from '../../../../../config/api';

interface Props { navigation: any; route: any; }

const DEFAULT_TEMPLATE = {
  base: 'Tôi tên là ___.',
  baseEn: 'My name is ___.',
  substitutions: [
    { vn: 'Nam', en: '(male name)' },
    { vn: 'Lan', en: '(female name)' },
    { vn: 'Peter', en: '(foreign name)' },
    { vn: 'An', en: '(neutral name)' },
  ],
};

const DEFAULT_RECOGNITION = [
  {
    sentence: 'Anh ấy là giáo viên người Pháp.',
    en: 'He is a French teacher.',
    parts: [
      { text: 'Anh ấy', role: 'Chủ ngữ', roleEn: 'Subject', color: '#4F46E5' },
      { text: 'là', role: 'Vị ngữ', roleEn: 'Verb', color: '#059669' },
      { text: 'giáo viên người Pháp', role: 'Tân ngữ', roleEn: 'Predicate', color: '#D97706' },
    ],
  },
];

const DEFAULT_BLANKS = [
  { sentence: 'Anh là người ___?', sentenceEn: 'Are you ___?', answer: 'Việt Nam', answerEn: 'Vietnamese' },
  { sentence: 'Tôi học ___ năm.', sentenceEn: 'I have studied for ___ year(s).', answer: 'một', answerEn: 'one' },
  { sentence: 'Nhà tôi ở ___.', sentenceEn: 'My home is in ___.', answer: 'Hà Nội', answerEn: 'Hanoi' },
];

const NhanDienScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId = 1, baiHocId, themeColor = '#4F46E5' } = route?.params || {};
  const currentBaiHocId = baiHocId || lessonId;
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [recognitionList, setRecognitionList] = useState(DEFAULT_RECOGNITION);
  const [blanks, setBlanks] = useState(DEFAULT_BLANKS);

  useEffect(() => {
    let isMounted = true;
    fetch(API_ENDPOINTS.GET_NN_BAI_HOC_CHI_TIET_KY_NANG(currentBaiHocId, 5))
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted) return;
        if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
          const row = res.data[0];

          // 1. Mẫu câu thay thế
          if (row.noi_dung_chinh && typeof row.noi_dung_chinh === 'object') {
            const subs = Array.isArray(row.noi_dung_chinh.tu_thay_the)
              ? row.noi_dung_chinh.tu_thay_the.map((s: any) => ({
                  vn: s.tu || s.vn || '',
                  en: s.mo_ta_en || s.en || '',
                }))
              : DEFAULT_TEMPLATE.substitutions;
            setTemplate({
              base: row.noi_dung_chinh.mau_cau_vn || 'Tôi tên là ___.',
              baseEn: row.noi_dung_chinh.mau_cau_en || 'My name is ___.',
              substitutions: subs,
            });
            setSelectedSub(null);
          }

          // 2. Nhận diện cấu trúc
          if (row.noi_dung_phu && typeof row.noi_dung_phu === 'object') {
            const colors = ['#4F46E5', '#059669', '#D97706', '#DC2626'];
            const p = row.noi_dung_phu;
            if (p.cau_vn && Array.isArray(p.thanh_phan)) {
              setRecognitionList([{
                sentence: p.cau_vn,
                en: p.cau_en || '',
                parts: p.thanh_phan.map((item: any, idx: number) => ({
                  text: item.tu || '',
                  role: item.nhom_vn || '',
                  roleEn: item.nhom_en || '',
                  color: colors[idx % colors.length],
                })),
              }]);
            }
          }

          // 3. Điền vào chỗ trống
          if (row.bai_kiem_tra && Array.isArray(row.bai_kiem_tra.danh_sach)) {
            setBlanks(row.bai_kiem_tra.danh_sach.map((b: any) => ({
              sentence: b.cau_vn || '',
              sentenceEn: b.cau_en || '',
              answer: b.dap_an || '',
              answerEn: b.dap_an_en || '',
            })));
            setShowAnswer(false);
          }
        }
      })
      .catch((err) => {
        console.log('Using default substitution fallback:', err.message);
      });
    return () => { isMounted = false; };
  }, [currentBaiHocId]);

  return (
    <BaseSkillContent
      navigation={navigation}
      skillTitle="Nhận diện và thay thế"
      skillSubtitle="Recognition and Substitution"
      skillNumber="5"
      emoji="🔄"
      themeColor={themeColor}
    >
      {/* Pattern substitution */}
      <ContentCard title="🔄 Thay thế từ trong mẫu câu • Word Substitution in Patterns">
        <Text style={styles.patternLabel}>Mẫu câu • Pattern:</Text>
        <View style={[styles.patternBox, { borderColor: themeColor }]}>
          <Text style={styles.patternText}>{template.base}</Text>
          <Text style={styles.patternTextEn}>{template.baseEn}</Text>
        </View>
        <Text style={styles.patternLabel}>Thay thế "___ " với • Replace "___ " with:</Text>
        <View style={styles.subGrid}>
          {template.substitutions.map((sub, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.subChip,
                { borderColor: selectedSub === i ? themeColor : '#E2E8F0' },
                selectedSub === i && { backgroundColor: themeColor + '15' },
              ]}
              onPress={() => setSelectedSub(i === selectedSub ? null : i)}
            >
              <Text style={[styles.subVn, { color: selectedSub === i ? themeColor : '#1E293B' }]}>{sub.vn}</Text>
              <Text style={styles.subEn}>{sub.en}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedSub !== null && (
          <View style={[styles.resultBox, { borderColor: themeColor, backgroundColor: themeColor + '10' }]}>
            <Text style={[styles.resultText, { color: themeColor }]}>
              → {template.base.replace('___', template.substitutions[selectedSub].vn)}
            </Text>
            <Text style={styles.resultEn}>
              → {template.baseEn.replace('___', template.substitutions[selectedSub].vn)}
            </Text>
          </View>
        )}
      </ContentCard>

      {/* Pattern recognition */}
      <ContentCard title="🔍 Nhận diện cấu trúc • Pattern Recognition">
        {recognitionList.map((item, idx) => (
          <View key={idx} style={styles.recognitionCard}>
            <Text style={styles.recSentence}>{item.sentence}</Text>
            <Text style={styles.recEn}>{item.en}</Text>
            <View style={styles.partsRow}>
              {item.parts.map((part, pi) => (
                <View key={pi} style={[styles.partTag, { backgroundColor: part.color + '20', borderColor: part.color }]}>
                  <Text style={[styles.partTagText, { color: part.color }]}>{part.text}</Text>
                  <Text style={styles.partTagRole}>{part.role}</Text>
                  <Text style={styles.partTagRoleEn}>{part.roleEn}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ContentCard>

      {/* Fill in blank */}
      <ContentCard title="✏️ Điền vào chỗ trống • Fill in the Blank">
        {blanks.map((blank, i) => (
          <View key={i} style={styles.blankRow}>
            <Text style={styles.blankSentence}>{blank.sentence}</Text>
            <Text style={styles.blankEn}>{blank.sentenceEn}</Text>
            {showAnswer && (
              <View style={[styles.answerBox, { borderColor: '#10B981' }]}>
                <Text style={styles.answerText}>→ {blank.answer}</Text>
                <Text style={styles.answerEn}>{blank.answerEn}</Text>
              </View>
            )}
          </View>
        ))}
        <TouchableOpacity
          style={[styles.revealBtn, { backgroundColor: showAnswer ? '#10B981' : themeColor }]}
          onPress={() => setShowAnswer(!showAnswer)}
        >
          <Text style={styles.revealBtnText}>
            {showAnswer ? '✓ Xem đáp án • Answers shown' : '💡 Xem đáp án • Reveal Answers'}
          </Text>
        </TouchableOpacity>
      </ContentCard>
    </BaseSkillContent>
  );
};

const styles = StyleSheet.create({
  patternLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 8 },
  patternBox: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
  },
  patternText: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  patternTextEn: { fontSize: 13, color: '#64748B', fontStyle: 'italic', marginTop: 4 },
  subGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  subChip: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  subVn: { fontSize: 16, fontWeight: '700' },
  subEn: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  resultBox: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  resultText: { fontSize: 20, fontWeight: '800' },
  resultEn: { fontSize: 13, color: '#64748B', fontStyle: 'italic', marginTop: 4 },
  recognitionCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14 },
  recSentence: { fontSize: 17, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  recEn: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginBottom: 12 },
  partsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  partTag: { borderWidth: 1.5, borderRadius: 10, padding: 8, alignItems: 'center' },
  partTagText: { fontSize: 14, fontWeight: '700' },
  partTagRole: { fontSize: 10, fontWeight: '600', color: '#475569', marginTop: 3 },
  partTagRoleEn: { fontSize: 9, color: '#94A3B8' },
  blankRow: { marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  blankSentence: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  blankEn: { fontSize: 11, color: '#64748B', fontStyle: 'italic', marginTop: 3 },
  answerBox: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  answerText: { fontSize: 16, fontWeight: '700', color: '#059669' },
  answerEn: { fontSize: 11, color: '#64748B', marginTop: 2 },
  revealBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  revealBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
});

export default NhanDienScreen;
