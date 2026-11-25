// Kỹ năng 4: Ngữ pháp
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BaseSkillContent, { ContentCard } from '../BaseSkillContent';
import { API_ENDPOINTS } from '../../../../../config/api';

interface Props { navigation: any; route: any; }

const DEFAULT_STRUCTURE = {
  cong_thuc: 'S + V + O',
  mo_ta_vn: 'Chủ ngữ + Vị ngữ + Tân ngữ',
  mo_ta_en: 'Subject + Verb + Object',
  vi_du_vn: 'Tôi học tiếng Việt.',
  vi_du_en: 'I study Vietnamese.',
  thanh_phan: [
    { tu: 'Tôi', nghia: 'I', nhom_vn: 'Chủ ngữ', nhom_en: 'Subject' },
    { tu: 'học', nghia: 'study', nhom_vn: 'Vị ngữ', nhom_en: 'Verb' },
    { tu: 'tiếng Việt', nghia: 'Vietnamese', nhom_vn: 'Tân ngữ', nhom_en: 'Object' },
  ],
};

const DEFAULT_RULES = [
  { rule: 'Tính từ đứng SAU danh từ', ruleEn: 'Adjectives come AFTER nouns', example: 'nhà đẹp (beautiful house)', exampleLiteral: 'house beautiful' },
  { rule: 'Không có biến đổi động từ theo thì', ruleEn: 'No verb conjugation by tense', example: 'tôi ăn / tôi đã ăn / tôi sẽ ăn', exampleLiteral: 'I eat / I past eat / I will eat' },
  { rule: 'Phủ định: không + động từ', ruleEn: 'Negation: không + verb', example: 'Tôi không biết. (I don\'t know.)', exampleLiteral: 'I không know.' },
];

const DEFAULT_QUIZ = {
  question: 'Chọn câu đúng • Choose the correct sentence',
  options: [
    { vn: 'Tôi tên là Nam.', en: 'My name is Nam. ✓', correct: true },
    { vn: 'Nam tên là tôi.', en: 'Incorrect word order', correct: false },
    { vn: 'Tên tôi là Nam.', en: 'Also correct (formal)', correct: true },
    { vn: 'Là Nam tôi tên.', en: 'Incorrect word order', correct: false },
  ],
};

const NguPhapScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId = 1, baiHocId, themeColor = '#4F46E5' } = route?.params || {};
  const currentBaiHocId = baiHocId || lessonId;
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [structure, setStructure] = useState(DEFAULT_STRUCTURE);
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [quiz, setQuiz] = useState(DEFAULT_QUIZ);

  useEffect(() => {
    let isMounted = true;
    fetch(API_ENDPOINTS.GET_NN_BAI_HOC_CHI_TIET_KY_NANG(currentBaiHocId, 4))
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted) return;
        if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
          const row = res.data[0];
          // Cấu trúc câu
          if (row.noi_dung_chinh && typeof row.noi_dung_chinh === 'object') {
            setStructure({
              cong_thuc: row.noi_dung_chinh.cong_thuc || 'S + V + O',
              mo_ta_vn: row.noi_dung_chinh.mo_ta_vn || 'Chủ ngữ + Vị ngữ + Tân ngữ',
              mo_ta_en: row.noi_dung_chinh.mo_ta_en || 'Subject + Verb + Object',
              vi_du_vn: row.noi_dung_chinh.vi_du_vn || 'Tôi học tiếng Việt.',
              vi_du_en: row.noi_dung_chinh.vi_du_en || 'I study Vietnamese.',
              thanh_phan: Array.isArray(row.noi_dung_chinh.thanh_phan) ? row.noi_dung_chinh.thanh_phan : DEFAULT_STRUCTURE.thanh_phan,
            });
          }

          // Quy tắc ngữ pháp
          if (row.noi_dung_phu && Array.isArray(row.noi_dung_phu.danh_sach) && row.noi_dung_phu.danh_sach.length > 0) {
            setRules(row.noi_dung_phu.danh_sach.map((r: any) => ({
              rule: r.vn || '',
              ruleEn: r.en || '',
              example: r.vd || '',
              exampleLiteral: r.literal || '',
            })));
          }

          // Bài kiểm tra nhỏ
          if (row.bai_kiem_tra && typeof row.bai_kiem_tra === 'object') {
            const b = row.bai_kiem_tra;
            const qVn = b.cau_hoi_vn || 'Chọn câu đúng';
            const qEn = b.cau_hoi_en || 'Choose the correct sentence';
            const opts = Array.isArray(b.lua_chon) ? b.lua_chon : [];
            const correctAns = b.dap_an_dung || '';
            if (opts.length > 0) {
              setQuiz({
                question: `${qVn} • ${qEn}`,
                options: opts.map((optStr: string) => ({
                  vn: optStr,
                  en: optStr === correctAns ? 'Correct ✓' : 'Incorrect',
                  correct: optStr === correctAns,
                })),
              });
              setQuizAnswer(null);
              setShowResult(false);
            }
          }
        }
      })
      .catch((err) => {
        console.log('Using default grammar fallback:', err.message);
      });
    return () => { isMounted = false; };
  }, [currentBaiHocId]);

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
          <Text style={styles.structureFormula}>{structure.cong_thuc}</Text>
          <Text style={styles.structureSub}>{structure.mo_ta_vn}{'\n'}{structure.mo_ta_en}</Text>
        </View>
        <View style={styles.exampleRow}>
          {structure.thanh_phan.map((tp, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <Text style={styles.plus}>+</Text>}
              <View style={[styles.partBox, { backgroundColor: idx === 0 ? '#EEF2FF' : idx === 1 ? '#F0FDF4' : '#FFF7ED' }]}>
                <Text style={styles.partLabel}>{tp.nhom_vn}{'\n'}{tp.nhom_en}</Text>
                <Text style={[styles.partWord, { color: idx === 0 ? '#4F46E5' : idx === 1 ? '#059669' : '#D97706' }]}>{tp.tu}</Text>
                <Text style={styles.partWordEn}>{tp.nghia}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.fullSentence}>→ {structure.vi_du_vn}</Text>
        <Text style={styles.fullSentenceEn}>→ {structure.vi_du_en}</Text>
      </ContentCard>

      {/* Grammar rules */}
      <ContentCard title="📖 Quy tắc ngữ pháp • Grammar Rules">
        {rules.map((item, i) => (
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
