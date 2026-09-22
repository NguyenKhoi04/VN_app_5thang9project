// Kỹ năng 1: Phát âm (1.1 Tập phát âm, 1.2 Tập ghép và đọc, 1.3 Thanh điệu)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BaseSkillContent, { ContentCard, ItemRow, PlayButton } from '../BaseSkillContent';

interface Props {
  navigation: any;
  route: any;
}

const TAB_LABELS = [
  { id: '1.1', label: '1.1 Tập phát âm', labelEn: 'Pronunciation Practice' },
  { id: '1.2', label: '1.2 Ghép âm', labelEn: 'Sound Combinations' },
  { id: '1.3', label: '1.3 Thanh điệu', labelEn: 'Tones' },
];

const PhatAmScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId = 1, themeColor = '#4F46E5' } = route?.params || {};
  const [activeTab, setActiveTab] = useState('1.1');

  const renderTab = () => {
    switch (activeTab) {
      case '1.1':
        return (
          <>
            <ContentCard title="🗣️ Tập phát âm các âm cơ bản • Practice basic sounds">
              <ItemRow vn="a, ă, â" en="Three 'a' sounds with different tones" color={themeColor} />
              <ItemRow vn="e, ê" en="Short and long 'e' sounds" color={themeColor} />
              <ItemRow vn="o, ô, ơ" en="Three 'o' variant sounds" color={themeColor} />
              <ItemRow vn="u, ư" en="Round and unrounded 'u' sounds" color={themeColor} />
              <PlayButton label="Nghe phát âm mẫu • Listen to model" color={themeColor} />
            </ContentCard>
            <ContentCard title="💡 Mẹo phát âm • Pronunciation Tips">
              <Text style={styles.tipText}>
                Tiếng Việt có 11 nguyên âm đơn. Mỗi nguyên âm có âm vị riêng biệt.{'\n'}
                <Text style={styles.tipEn}>Vietnamese has 11 single vowels. Each vowel has its own distinct phoneme.</Text>
              </Text>
            </ContentCard>
          </>
        );
      case '1.2':
        return (
          <>
            <ContentCard title="🔗 Tập ghép và đọc tổ hợp âm • Sound Combination Practice">
              <ItemRow vn="ba, be, bi, bo, bu" en="'b' + vowel combinations" color={themeColor} />
              <ItemRow vn="ca, co, cu" en="'c' + vowel combinations" color={themeColor} />
              <ItemRow vn="da, di, do" en="'d' + vowel combinations" color={themeColor} />
              <ItemRow vn="cha, chi, chu" en="'ch' cluster combinations" color={themeColor} />
              <PlayButton label="Nghe và luyện tập • Listen and practice" color={themeColor} />
            </ContentCard>
            <ContentCard title="✏️ Bài tập ghép âm • Combination Exercise">
              <Text style={styles.exerciseText}>Ghép phụ âm + nguyên âm để tạo thành âm tiết:{'\n'}
                <Text style={styles.exerciseEn}>Combine consonant + vowel to create syllables:</Text>
              </Text>
              <View style={styles.combineGrid}>
                {['ba', 'bê', 'bò', 'cá', 'cô', 'dì', 'cha', 'chè'].map((syl, i) => (
                  <TouchableOpacity key={i} style={[styles.syllableChip, { borderColor: themeColor }]}>
                    <Text style={[styles.syllableText, { color: themeColor }]}>{syl}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ContentCard>
          </>
        );
      case '1.3':
        return (
          <>
            <ContentCard title="🎵 6 Thanh điệu tiếng Việt • 6 Vietnamese Tones">
              {[
                { mark: '—', name: 'Thanh ngang (flat)', example: 'ma', en: 'ghost' },
                { mark: '`', name: 'Thanh huyền (falling)', example: 'mà', en: 'but' },
                { mark: '?', name: 'Thanh hỏi (rising-dipping)', example: 'mả', en: 'tomb' },
                { mark: '~', name: 'Thanh ngã (broken rising)', example: 'mã', en: 'horse' },
                { mark: '\'', name: 'Thanh sắc (high rising)', example: 'má', en: 'mother' },
                { mark: '.', name: 'Thanh nặng (low falling)', example: 'mạ', en: 'rice seedling' },
              ].map((tone, i) => (
                <View key={i} style={styles.toneRow}>
                  <View style={[styles.toneBadge, { backgroundColor: themeColor }]}>
                    <Text style={styles.toneMark}>{tone.mark}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toneName}>{tone.name}</Text>
                    <Text style={[styles.toneExample, { color: themeColor }]}>{tone.example} - {tone.en}</Text>
                  </View>
                </View>
              ))}
              <PlayButton label="Nghe 6 thanh điệu • Listen to all 6 tones" color={themeColor} />
            </ContentCard>
          </>
        );
    }
  };

  return (
    <BaseSkillContent
      navigation={navigation}
      skillTitle="Phát âm"
      skillSubtitle="Pronunciation"
      skillNumber="1"
      emoji="🗣️"
      themeColor={themeColor}
    >
      {/* Sub-skill tabs */}
      <View style={styles.tabRow}>
        {TAB_LABELS.map((tab) => (
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

      {renderTab()}
    </BaseSkillContent>
  );
};

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', gap: 6, marginBottom: 16, flexWrap: 'wrap' },
  tab: {
    flex: 1,
    minWidth: 90,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabText: { fontSize: 11, fontWeight: '700', color: '#475569', textAlign: 'center' },
  tabSub: { fontSize: 9, color: '#94A3B8', marginTop: 2, textAlign: 'center' },

  tipText: { fontSize: 14, color: '#334155', lineHeight: 22 },
  tipEn: { fontSize: 12, color: '#64748B', fontStyle: 'italic' },

  exerciseText: { fontSize: 13, color: '#334155', lineHeight: 20, marginBottom: 12 },
  exerciseEn: { fontSize: 11, color: '#64748B', fontStyle: 'italic' },
  combineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  syllableChip: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
  },
  syllableText: { fontSize: 18, fontWeight: '700' },

  toneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12 },
  toneBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toneMark: { fontSize: 18, color: 'white', fontWeight: '800' },
  toneName: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  toneExample: { fontSize: 12, marginTop: 2 },
});

export default PhatAmScreen;
