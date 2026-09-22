// Kỹ năng 3: Tập đọc (3.1 Đọc các chữ, 3.2 Tập đối thoại)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BaseSkillContent, { ContentCard, PlayButton } from '../BaseSkillContent';

interface Props { navigation: any; route: any; }

const TapDocScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId = 1, themeColor = '#4F46E5' } = route?.params || {};
  const [activeTab, setActiveTab] = useState('3.1');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const words = ['xin', 'chào', 'cảm', 'ơn', 'tạm', 'biệt', 'vâng', 'không'];
  const dialogue = [
    { speaker: 'A', vn: 'Xin chào! Anh tên gì?', en: 'Hello! What is your name?', side: 'left' },
    { speaker: 'B', vn: 'Xin chào! Tôi tên là Nam.', en: 'Hello! My name is Nam.', side: 'right' },
    { speaker: 'A', vn: 'Anh là người nước nào?', en: 'What nationality are you?', side: 'left' },
    { speaker: 'B', vn: 'Tôi là người Việt Nam. Còn bạn?', en: "I'm Vietnamese. And you?", side: 'right' },
    { speaker: 'A', vn: 'Tôi là người Anh.', en: "I'm British.", side: 'left' },
  ];

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
            {[
              { vn: 'Bảng chữ cái tiếng Việt có 29 chữ cái.', en: 'The Vietnamese alphabet has 29 letters.' },
              { vn: 'Tiếng Việt là tiếng đơn âm.', en: 'Vietnamese is a monosyllabic language.' },
            ].map((item, i) => (
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
