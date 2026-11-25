// Kỹ năng 1: Phát âm (1.1 Tập phát âm, 1.2 Tập ghép và đọc, 1.3 Thanh điệu)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import BaseSkillContent, { ContentCard, ItemRow, PlayButton } from '../BaseSkillContent';
// @ts-ignore
import { API_ENDPOINTS } from '../../../../../config/api';

interface Props {
  navigation: any;
  route: any;
}

const TAB_LABELS = [
  { id: '1.1', label: '1.1 Tập phát âm', labelEn: 'Pronunciation Practice' },
  { id: '1.2', label: '1.2 Ghép âm', labelEn: 'Sound Combinations' },
  { id: '1.3', label: '1.3 Thanh điệu', labelEn: 'Tones' },
];

const DEFAULT_SUB_1_1 = {
  titleVn: 'Tập phát âm các âm cơ bản',
  titleEn: 'Practice basic sounds',
  items: [
    { am: 'a, ă, â', mo_ta_en: "Three 'a' sounds with different lengths" },
    { am: 'e, ê', mo_ta_en: "Short and long 'e' sounds" },
    { am: 'o, ô, ơ', mo_ta_en: "Three 'o' variant sounds" },
    { am: 'u, ư', mo_ta_en: "Round and unrounded 'u' sounds" },
  ],
  tip: {
    vn: 'Tiếng Việt có 11 nguyên âm đơn. Mỗi nguyên âm có âm vị riêng biệt.',
    en: 'Vietnamese has 11 single vowels. Each vowel has its own distinct phoneme.',
  },
};

const DEFAULT_SUB_1_2 = {
  titleVn: 'Tập ghép và đọc tổ hợp âm',
  titleEn: 'Sound Combination Practice',
  items: [
    { am: 'ba, be, bi, bo, bu', mo_ta_en: "'b' + vowel combinations" },
    { am: 'ca, co, cu', mo_ta_en: "'c' + vowel combinations" },
    { am: 'da, di, do', mo_ta_en: "'d' + vowel combinations" },
    { am: 'cha, chi, chu', mo_ta_en: "'ch' cluster combinations" },
  ],
  syllables: ['ba', 'bê', 'bò', 'cá', 'cô', 'dì', 'cha', 'chè'],
};

const DEFAULT_SUB_1_3 = {
  titleVn: '6 Thanh điệu tiếng Việt',
  titleEn: '6 Vietnamese Tones',
  tones: [
    { mark: '—', name: 'Thanh ngang (flat)', example: 'ma', en: 'ghost' },
    { mark: '`', name: 'Thanh huyền (falling)', example: 'mà', en: 'but' },
    { mark: '?', name: 'Thanh hỏi (rising-dipping)', example: 'mả', en: 'tomb' },
    { mark: '~', name: 'Thanh ngã (broken rising)', example: 'mã', en: 'horse' },
    { mark: "'", name: 'Thanh sắc (high rising)', example: 'má', en: 'mother' },
    { mark: '.', name: 'Thanh nặng (low falling)', example: 'mạ', en: 'rice seedling' },
  ],
};

const PhatAmScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId = 10, baiHocId, themeColor = '#0891B2', initialTab } = route?.params || {};
  const currentBaiHocId = baiHocId || lessonId;

  const [activeTab, setActiveTab] = useState(initialTab || '1.1');
  const [sub11, setSub11] = useState(DEFAULT_SUB_1_1);
  const [sub12, setSub12] = useState(DEFAULT_SUB_1_2);
  const [sub13, setSub13] = useState(DEFAULT_SUB_1_3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    let isMounted = true;
    const fetchSkillData = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS.GET_NN_BAI_HOC_CHI_TIET_KY_NANG(currentBaiHocId, 1));
        const json = await res.json();
        if (isMounted && json?.success && Array.isArray(json?.data)) {
          const rows: any[] = json.data;

          // 1.1 Tập phát âm
          const row11 = rows.find((r) => r.ky_hieu === '1.1' || r.id === 7);
          if (row11) {
            setSub11({
              titleVn: row11.tieu_de_vn || DEFAULT_SUB_1_1.titleVn,
              titleEn: row11.tieu_de_en || DEFAULT_SUB_1_1.titleEn,
              items: Array.isArray(row11.noi_dung_chinh) ? row11.noi_dung_chinh : DEFAULT_SUB_1_1.items,
              tip: row11.noi_dung_phu || DEFAULT_SUB_1_1.tip,
            });
          }

          // 1.2 Ghép âm
          const row12 = rows.find((r) => r.ky_hieu === '1.2' || r.id === 8);
          if (row12) {
            setSub12({
              titleVn: row12.tieu_de_vn || DEFAULT_SUB_1_2.titleVn,
              titleEn: row12.tieu_de_en || DEFAULT_SUB_1_2.titleEn,
              items: Array.isArray(row12.noi_dung_chinh) ? row12.noi_dung_chinh : DEFAULT_SUB_1_2.items,
              syllables: row12.noi_dung_phu?.am_tiet || DEFAULT_SUB_1_2.syllables,
            });
          }

          // 1.3 Thanh điệu
          const row13 = rows.find((r) => r.ky_hieu === '1.3' || r.id === 9);
          if (row13 && Array.isArray(row13.noi_dung_chinh)) {
            const mappedTones = row13.noi_dung_chinh.map((t: any) => ({
              mark: t.ky_hieu || '—',
              name: t.ten || '',
              example: t.vi_du?.split('-')[0]?.trim() || '',
              en: t.vi_du?.split('-')[1]?.trim() || '',
            }));
            setSub13({
              titleVn: row13.tieu_de_vn || DEFAULT_SUB_1_3.titleVn,
              titleEn: row13.tieu_de_en || DEFAULT_SUB_1_3.titleEn,
              tones: mappedTones.length > 0 ? mappedTones : DEFAULT_SUB_1_3.tones,
            });
          }
        }
      } catch (err) {
        console.log('Error fetching Skill 1 data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSkillData();
    return () => { isMounted = false; };
  }, [currentBaiHocId]);

  const renderTab = () => {
    switch (activeTab) {
      case '1.1':
        return (
          <>
            <ContentCard title={`🗣️ ${sub11.titleVn} • ${sub11.titleEn}`}>
              {sub11.items.map((item: any, i: number) => (
                <ItemRow key={i} vn={item.am} en={item.mo_ta_en || ''} color={themeColor} />
              ))}
              <PlayButton label="Nghe phát âm mẫu • Listen to model" color={themeColor} />
            </ContentCard>
            {sub11.tip && (
              <ContentCard title="💡 Mẹo phát âm • Pronunciation Tips">
                <Text style={styles.tipText}>
                  {sub11.tip.vn}{'\n'}
                  <Text style={styles.tipEn}>{sub11.tip.en}</Text>
                </Text>
              </ContentCard>
            )}
          </>
        );
      case '1.2':
        return (
          <>
            <ContentCard title={`🔗 ${sub12.titleVn} • ${sub12.titleEn}`}>
              {sub12.items.map((item: any, i: number) => (
                <ItemRow key={i} vn={item.am} en={item.mo_ta_en || ''} color={themeColor} />
              ))}
              <PlayButton label="Nghe và luyện tập • Listen and practice" color={themeColor} />
            </ContentCard>
            <ContentCard title="✏️ Bài tập ghép âm • Combination Exercise">
              <Text style={styles.exerciseText}>Ghép phụ âm + nguyên âm để tạo thành âm tiết:{'\n'}
                <Text style={styles.exerciseEn}>Combine consonant + vowel to create syllables:</Text>
              </Text>
              <View style={styles.combineGrid}>
                {sub12.syllables.map((syl: string, i: number) => (
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
            <ContentCard title={`🎵 ${sub13.titleVn} • ${sub13.titleEn}`}>
              {sub13.tones.map((tone: any, i: number) => (
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

      {loading ? (
        <ActivityIndicator size="small" color={themeColor} style={{ marginVertical: 20 }} />
      ) : null}

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
