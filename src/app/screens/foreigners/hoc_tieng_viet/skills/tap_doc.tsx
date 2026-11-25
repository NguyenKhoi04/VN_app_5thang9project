// Kỹ năng 3: Tập đọc (3.1 Đọc các chữ, 3.2 Tập đối thoại)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BaseSkillContent, { ContentCard, PlayButton } from '../BaseSkillContent';
import { API_ENDPOINTS } from '../../../../../config/api';

interface Props { navigation: any; route: any; }

const DEFAULT_WORDS = ['xin', 'chào', 'cảm', 'ơn', 'tạm', 'biệt', 'vâng', 'không'];
const DEFAULT_SAMPLE_SENTENCES = [
  { vn: 'Bảng chữ cái tiếng Việt có 29 chữ cái.', en: 'The Vietnamese alphabet has 29 letters.' },
  { vn: 'Tiếng Việt là tiếng đơn âm.', en: 'Vietnamese is a monosyllabic language.' },
];
const DEFAULT_DIALOGUE = [
  { speaker: 'A', vn: 'Xin chào! Anh tên gì?', en: 'Hello! What is your name?', side: 'left' },
  { speaker: 'B', vn: 'Xin chào! Tôi tên là Nam.', en: 'Hello! My name is Nam.', side: 'right' },
  { speaker: 'A', vn: 'Anh là người nước nào?', en: 'What nationality are you?', side: 'left' },
  { speaker: 'B', vn: 'Tôi là người Việt Nam. Còn bạn?', en: "I'm Vietnamese. And you?", side: 'right' },
  { speaker: 'A', vn: 'Tôi là người Anh.', en: "I'm British.", side: 'left' },
];

const TapDocScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId = 1, baiHocId, targetSubTab, initialTab, themeColor = '#4F46E5' } = route?.params || {};
  const currentBaiHocId = baiHocId || lessonId;
  const [activeTab, setActiveTab] = useState(targetSubTab || initialTab || '3.1');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [words, setWords] = useState<string[]>(DEFAULT_WORDS);
  const [sampleSentences, setSampleSentences] = useState(DEFAULT_SAMPLE_SENTENCES);
  const [dialogue, setDialogue] = useState(DEFAULT_DIALOGUE);

  useEffect(() => {
    let isMounted = true;
    fetch(API_ENDPOINTS.GET_NN_BAI_HOC_CHI_TIET_KY_NANG(currentBaiHocId, 3))
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted) return;
        if (res?.success && Array.isArray(res?.data)) {
          // Tab 3.1
          const row31 = res.data.find((r: any) => r.ky_hieu === '3.1' || r.id === 10);
          if (row31?.noi_dung_chinh && Array.isArray(row31.noi_dung_chinh.tu)) {
            setWords(row31.noi_dung_chinh.tu);
          }
          if (row31?.noi_dung_phu && Array.isArray(row31.noi_dung_phu.cau)) {
            setSampleSentences(row31.noi_dung_phu.cau);
          }

          // Tab 3.2
          const row32 = res.data.find((r: any) => r.ky_hieu === '3.2' || r.id === 11);
          if (Array.isArray(row32?.noi_dung_chinh) && row32.noi_dung_chinh.length > 0) {
            const mapped = row32.noi_dung_chinh.map((item: any) => ({
              speaker: item.vai || item.speaker || 'A',
              vn: item.vn || item.cau_vn || '',
              en: item.en || item.cau_en || '',
              side: (item.vai === 'B' || item.side === 'right') ? 'right' : 'left',
            }));
            setDialogue(mapped);
          } else if (Array.isArray(res?.bai_tap_bo_tro) && res.bai_tap_bo_tro.length > 0) {
            const mapped = res.bai_tap_bo_tro.map((item: any, idx: number) => ({
              speaker: idx % 2 === 0 ? 'A' : 'B',
              vn: item.tu_tv,
              en: item.goi_y || '',
              side: idx % 2 === 0 ? 'left' : 'right',
            }));
            setDialogue(mapped);
          }
        }
      })
      .catch((err) => {
        console.log('Using default reading words fallback:', err.message);
      });
    return () => { isMounted = false; };
  }, [currentBaiHocId]);

  return (
    <BaseSkillContent
      navigation={navigation}
      skillTitle="Tập đọc"
      skillSubtitle="Reading Practice"
      skillNumber="3"
      emoji="📖"
      themeColor={themeColor}
    >
      {/* Tabs */}
      <View style={styles.tabRow}>
        {[
          { id: '3.1', label: '3.1 Đọc chữ', labelEn: 'Read Characters' },
          { id: '3.2', label: '3.2 Đối thoại', labelEn: 'Dialogue' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && { backgroundColor: themeColor }]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && { color: 'white' }]}>{tab.label}</Text>
            <Text style={[styles.tabSub, activeTab === tab.id && { color: 'rgba(255,255,255,0.8)' }]}>{tab.labelEn}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === '3.1' ? (
        <>
          <ContentCard title="📝 Đọc các chữ và từ • Read characters and words">
            <Text style={styles.instruction}>
              Nhấn vào từ để nghe phát âm • Tap a word to hear pronunciation
            </Text>
            <View style={styles.wordGrid}>
              {words.map((word, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.wordChip,
                    { borderColor: selectedWord === word ? themeColor : '#E2E8F0' },
                    selectedWord === word && { backgroundColor: themeColor + '15' },
                  ]}
                  onPress={() => setSelectedWord(word === selectedWord ? null : word)}
                >
                  <Text style={[styles.wordText, { color: selectedWord === word ? themeColor : '#1E293B' }]}>
                    {word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedWord && (
              <View style={[styles.selectedBox, { backgroundColor: themeColor + '10', borderColor: themeColor }]}>
                <Text style={[styles.selectedWord, { color: themeColor }]}>{selectedWord}</Text>
                <PlayButton label="Nghe phát âm • Listen" color={themeColor} />
              </View>
            )}
          </ContentCard>

          <ContentCard title="📋 Câu đọc mẫu • Sample Reading Sentences">
            {sampleSentences.map((item, i) => (
              <View key={i} style={styles.sentenceRow}>
                <Text style={styles.sentenceVn}>{item.vn}</Text>
                <Text style={styles.sentenceEn}>{item.en}</Text>
                <PlayButton label="Nghe • Listen" color={themeColor} />
              </View>
            ))}
          </ContentCard>
        </>
      ) : (
        <>
          <ContentCard title="💬 Tập đối thoại • Dialogue Practice">
            <PlayButton label="Nghe toàn bộ đoạn hội thoại • Listen to full dialogue" color={themeColor} />
          </ContentCard>
          <View style={styles.dialogueBox}>
            {dialogue.map((line, i) => (
              <View key={i} style={[styles.bubbleRow, { justifyContent: line.side === 'right' ? 'flex-end' : 'flex-start' }]}>
                {line.side === 'left' && (
                  <View style={[styles.avatar, { backgroundColor: themeColor }]}>
                    <Text style={styles.avatarText}>{line.speaker}</Text>
                  </View>
                )}
                <View style={[
                  styles.bubble,
                  line.side === 'right'
                    ? { backgroundColor: themeColor, marginRight: 8 }
                    : { backgroundColor: 'white', marginLeft: 8 },
                ]}>
                  <Text style={[styles.bubbleVn, { color: line.side === 'right' ? 'white' : '#1E293B' }]}>
                    {line.vn}
                  </Text>
                  <Text style={[styles.bubbleEn, { color: line.side === 'right' ? 'rgba(255,255,255,0.8)' : '#94A3B8' }]}>
                    {line.en}
                  </Text>
                </View>
                {line.side === 'right' && (
                  <View style={[styles.avatar, { backgroundColor: '#0891B2' }]}>
                    <Text style={styles.avatarText}>{line.speaker}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      )}
    </BaseSkillContent>
  );
};

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  tabSub: { fontSize: 9, color: '#94A3B8', marginTop: 2 },
  instruction: { fontSize: 12, color: '#64748B', marginBottom: 12, fontStyle: 'italic' },
  wordGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wordChip: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  wordText: { fontSize: 18, fontWeight: '700' },
  selectedBox: {
    marginTop: 12,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  selectedWord: { fontSize: 32, fontWeight: '800', marginBottom: 8 },
  sentenceRow: { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sentenceVn: { fontSize: 15, fontWeight: '600', color: '#1E293B', lineHeight: 22 },
  sentenceEn: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginTop: 2, marginBottom: 6 },
  dialogueBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '800', color: 'white' },
  bubble: {
    maxWidth: '72%',
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  bubbleVn: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  bubbleEn: { fontSize: 11, marginTop: 3, fontStyle: 'italic' },
});

export default TapDocScreen;
