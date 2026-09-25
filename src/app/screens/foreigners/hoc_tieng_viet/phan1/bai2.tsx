import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';

const THEME = '#4F46E5';
const LESSON_ID = 2;

interface Props {
  navigation: any;
}

const Phan1Bai2: React.FC<Props> = ({ navigation }) => {
  const [mode, setMode] = useState<'vowels' | 'consonants'>('vowels');

  const playSound = useCallback(async (key: string) => {
    // Placeholder – thay bằng file thật trong assets/sounds/
    console.log('Play sound:', key);
    // Ví dụ:
    // try {
    //   const { sound } = await Audio.Sound.createAsync(SOUND_MAP[key]);
    //   await sound.playAsync();
    //   sound.setOnPlaybackStatusUpdate((s) => {
    //     if (s.isLoaded && s.didJustFinish) sound.unloadAsync();
    //   });
    // } catch (e) {}
  }, []);

  // ========== RENDER MODE 1: NGUYÊN ÂM ==========
  const renderMode1 = () => (
    <View>
      {/* Theory card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderEn}>1. Vowels</Text>
          <Pressable onPress={() => playSound('nguyen_am_intro')} style={styles.speakerBtn}>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>
        </View>
        <Text style={styles.cardHeaderVi}>1. Nguyên âm</Text>

        <Text style={styles.paragraphEn}>
          Vietnamese is a language with many vowels, including monophthongs and diphthongs. The monophthongs are: a, ă, â, u, o, ô, ư, i, ê, e.
        </Text>
        <Text style={styles.paragraph}>
          Tiếng Việt là ngôn ngữ có nhiều nguyên âm, bao gồm các nguyên âm đơn và nguyên âm đôi. Các nguyên âm đơn gồm: a, ă, â, u, o, ô, ư, i, ê, e.
        </Text>

        <Text style={styles.paragraphEn}>
          Among them, the sounds u, ô, o are rounded (lips are rounded when pronouncing). The remaining sounds are unrounded. When pronouncing, depending on whether the tongue moves forward or backward, they can be classified as: front vowels: i, ê, e; central vowels: ư; back vowels: u, ô, o. Depending on the height of the tongue: close vowels (high tongue): i, ư, u; relatively close: ê, ơ; relatively open: e; open: a.
        </Text>
        <Text style={styles.paragraph}>
          Trong đó, các âm: u, ô, o là các âm tròn môi (khi phát âm môi tròn lại). Các âm còn lại là các âm không tròn môi. Khi phát âm, tùy thuộc vào vị trí lưỡi về phía trước hay lui về phía sau, có thể tách ra: các nguyên âm dòng trước: i, ê, e; nguyên âm dòng giữa: ư; nguyên âm dòng sau: u, ô, o. Tùy thuộc vào độ nâng của lưỡi, có thể tách ra: nguyên âm có độ mở hẹp (lưỡi nâng cao): i, ư, u; nguyên âm có độ mở tương đối hẹp: ê, ơ; nguyên âm có độ mở tương đối rộng: e; nguyên âm có độ mở rộng: a.
        </Text>

        <Text style={styles.paragraphEn}>
          The pronunciation of vowels can be illustrated by the following chart:
        </Text>
        <Text style={styles.paragraph}>
          Khi phát âm các nguyên âm có thể hình dung qua bảng sau:
        </Text>

        {/* Vowel trapezoid approximation */}
        <View style={styles.vowelChart}>
          <View style={styles.chartRow}>
            <Text style={styles.chartLabelLeft}>i</Text>
            <View style={styles.chartLine} />
            <Text style={styles.chartLabelRight}>u</Text>
          </View>
          <View style={[styles.chartRow, { marginLeft: 20 }]}>
            <Text style={styles.chartLabelLeft}>ê</Text>
            <View style={styles.chartLine} />
            <Text style={styles.chartLabelRight}>ư   ô</Text>
          </View>
          <View style={[styles.chartRow, { marginLeft: 40 }]}>
            <Text style={styles.chartLabelLeft}>e</Text>
            <View style={styles.chartLine} />
            <Text style={styles.chartLabelRight}>ơ   o</Text>
          </View>
          <View style={[styles.chartRow, { marginLeft: 60 }]}>
            <Text style={styles.chartLabelCenter}>a</Text>
          </View>
          <Text style={styles.chartNote}>← front · central · back →</Text>
        </View>

        <Text style={styles.paragraphEn}>
          The diphthongs include: iê (yê), uô, ươ, ia (ya), ua, ưa.
        </Text>
        <Text style={styles.paragraph}>
          Các nguyên âm đôi gồm: iê (yê), uô, ươ, ia (ya), ua, ưa.
        </Text>
      </View>

      {/* Luyện đọc nguyên âm */}
      <View style={styles.storyBox}>
        <View style={styles.tabHeader}>
          <Text style={styles.practiceTitleEn}>Practice Reading – Vowels</Text>
          <Pressable onPress={() => playSound('luyen_doc_nguyen_am')}>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>
        </View>
        <Text style={styles.practiceTitleVi}>Luyện đọc nguyên âm</Text>

        <View style={styles.practiceGrid}>
          {[
            'a', 'ă', 'â', 'u', 'o', 'ô', 'ư', 'i', 'ê', 'e',
            'uô', 'ua', 'ươ', 'ưa', 'iê (yê)', 'ia (ya)',
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.practiceItem}
              onPress={() => playSound(`vowel_${item.replace(/[^a-zăâêôơư]/gi, '')}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.practiceText}>{item}</Text>
              <Text style={styles.miniSpeaker}>🔊</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  // ========== RENDER MODE 2: PHỤ ÂM ==========
  const renderMode2 = () => (
    <View>
      {/* Theory card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderEn}>2. Consonants</Text>
          <Pressable onPress={() => playSound('phu_am_intro')} style={styles.speakerBtn}>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>
        </View>
        <Text style={styles.cardHeaderVi}>2. Phụ âm</Text>

        <Text style={styles.paragraphEn}>
          Vietnamese is a language very rich in consonants, including single consonants and double consonants. Single consonants include: p, m, b, v, f, n, t, d (gi, r), đ, k (c, q), g, h, l, s, x, v. Double consonants: ph, ch, tr, th, nh, ng, ngh, kh.
        </Text>
        <Text style={styles.paragraph}>
          Tiếng Việt là ngôn ngữ rất giàu phụ âm, bao gồm phụ âm đơn và phụ âm kép. Các phụ âm đơn gồm: p, m, b, v, f, n, t, d (gi, r), đ, k (c, q), g, h, l, s, x, v. Các phụ âm kép: ph, ch, tr, th, nh, ng, ngh, kh.
        </Text>

        <Text style={styles.paragraphEn}>
          When pronouncing consonants, based on the involvement of articulators, they can be classified into labial, dental, lingual, nasal, and glottal sounds. Based on voicing, they can be voiced or voiceless. Based on whether the airflow is free or blocked, they can be aspirated or unaspirated. Based on tongue vibration, they can be trilled or non-trilled. Based on tongue curling, they can be retroflex or non-retroflex.
        </Text>
        <Text style={styles.paragraph}>
          Khi phát âm các phụ âm, căn cứ vào sự tham gia của các bộ vị cấu âm có thể tách ra âm môi, âm răng, âm lưỡi, âm mũi, âm họng. Căn cứ vào tiếng thanh hay không có thể tách ra âm hữu thanh và âm vô thanh. Căn cứ vào việc luồng hơi đi ra tự do hay bị chặn lại ở một điểm nào đó rồi mới đi tiếp, sẽ có âm bật hơi hay không bật hơi. Căn cứ vào việc khi phát âm lưỡi có bị rung hay không ta có âm rung và không rung. Căn cứ vào việc khi phát âm lưỡi có bị cong hay không, ta có âm quặt lưỡi và không quặt lưỡi.
        </Text>

        {/* 2.1 – 2.11 */}
        <Text style={styles.subSectionTitleEn}>Detailed classification</Text>
        <Text style={styles.subSectionTitleVi}>Phân loại chi tiết</Text>

        {[
          { id: '2.1.', en: 'Nasal bilabial (voiced): /m/; Bilabial (air does not pass through nose): /b/', vi: 'Âm mũi, môi – môi (hữu thanh): /m/; âm môi – môi (hơi không qua mũi): /b/' },
          { id: '2.2.', en: 'Bilabial (voiceless): /p/', vi: 'Âm môi – môi (vô thanh): /p/' },
          { id: '2.3.', en: 'Labiodental voiced: /v/; Labiodental voiceless: /f/', vi: 'Âm môi răng / hữu thanh: /v/; âm môi răng / vô thanh: /f/' },
          { id: '2.4.', en: 'Alveolar voiced: /n/; Alveolar voiceless: /t/', vi: 'Âm đầu lưỡi răng hữu thanh: /n/; âm đầu lưỡi răng vô thanh: /t/' },
          { id: '2.5.', en: 'Palatal nasal: /nh/; Palatal fricative (air does not pass through nose), voiced: /x/; voiceless: /ch/', vi: 'Âm mũi / mặt lưỡi: /nh/; âm xát / mặt lưỡi (hơi không qua mũi), hữu thanh: /x/; vô thanh: /ch/' },
          { id: '2.6.', en: 'Non-retroflex fricative: /x/; Retroflex fricative: /s/, /tr/', vi: 'Âm xát / không quặt lưỡi: /x/; âm xát / quặt lưỡi: /s/, /tr/' },
          { id: '2.7.', en: 'Velar (air through nose): /ng/; Velar (air does not pass through nose) voiced: /g/; voiceless: /k/', vi: 'Âm gốc lưỡi (hơi qua mũi): /ng/; âm gốc lưỡi (hơi không qua mũi) hữu thanh: /g/; vô thanh: /k/' },
          { id: '2.8.', en: 'Glottal fricative (throat): /h/', vi: 'Âm tắc thanh hầu (âm họng): /h/' },
          { id: '2.9.', en: 'Lateral (air passes both sides of the tongue): /l/', vi: 'Âm bên (hơi đi qua hai bên lưỡi): /l/' },
          { id: '2.10.', en: 'Aspirated (voiceless): /pʰ/, /tʰ/', vi: 'Âm bật hơi (vô thanh): /pʰ/, /tʰ/' },
          { id: '2.11.', en: 'Trill: /r/', vi: 'Âm rung: /r/' },
        ].map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Pressable onPress={() => playSound(`phu_am_${item.id}`)} style={styles.listSpeaker}>
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={styles.listId}>{item.id}</Text>
              <Text style={styles.listEn}>{item.en}</Text>
              <Text style={styles.listVi}>{item.vi}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Phoneme table */}
      <View style={styles.card}>
        <Text style={styles.paragraphEn}>
          When approaching Vietnamese phonemes, note that one sound (phoneme) can be represented by different letters. See the table below:
        </Text>
        <Text style={styles.paragraph}>
          Khi tiếp cận ngữ âm tiếng Việt, cần lưu ý: Một âm (âm vị) có thể được thể hiện qua nhiều chữ viết khác nhau. Để có thể hình dung cụ thể, xin xem bảng dưới đây:
        </Text>

        {/* Table header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 0.7,textAlign: 'center'  }]}>IPA</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 0.7,textAlign: 'center'  }]}>Letters</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 0.8, textAlign: 'center' }]}>Pronunciation</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 0.7, textAlign: 'center' }]}>Sound</Text>
        </View>

        {[
          { ipa: '/b/', letters: 'b', pronunciation: 'bờm', sound: 'b' },
          { ipa: '/k/', letters: 'c, k or q', pronunciation: 'cờ, ca or quờ', sound: 'k' },
          { ipa: '/ɗ/', letters: 'chữ đ', pronunciation: 'đờ', sound: 'd2' },
          { ipa: '/ɣ/', letters: 'g or gh', pronunciation: 'gờ or ghờ', sound: 'g_gh' },
          { ipa: '/h/', letters: 'h', pronunciation: 'hờ', sound: 'h' },
          { ipa: '/l/', letters: 'l', pronunciation: 'lờ', sound: 'l' },
          { ipa: '/m/', letters: 'm', pronunciation: 'mờ', sound: 'm' },
          { ipa: '/n/', letters: 'n', pronunciation: 'nờ', sound: 'n' },
          { ipa: '/p/', letters: 'p', pronunciation: 'bờ', sound: 'p' },
          { ipa: '/f/', letters: 'ph', pronunciation: 'phờ', sound: 'ph' },
          { ipa: '/ʐ/', letters: 'r', pronunciation: 'rờ', sound: 'r' },
          { ipa: '/s/', letters: 's', pronunciation: 'sờ', sound: 's' },
          { ipa: '/t/', letters: 't', pronunciation: 'tờ', sound: 't' },
          { ipa: '/v/', letters: 'v', pronunciation: 'vờ', sound: 'v' },
          { ipa: '/s/', letters: 'x', pronunciation: 'xờ or ít', sound: 'x' },
          { ipa: '/c/', letters: 'ch', pronunciation: 'chờ', sound: 'ch' },
          { ipa: '/z/', letters: 'd or  gi', pronunciation: 'đờ or giờ', sound: 'd_gi' },
          { ipa: '/χ/ or /k`/ or /kʰ/', letters: 'kh', pronunciation: 'khờ', sound: 'kh' },
          { ipa: '/ŋ/', letters: 'ng or ngh', pronunciation: 'ngờ or nghờ', sound: 'ng_ngh' },
          { ipa: '/ɲ/', letters: 'nh', pronunciation: 'nhờ', sound: 'nh' },
          { ipa: '/f/', letters: 'ph', pronunciation: 'phờ', sound: 'ph' },
          { ipa: '/θ/ or /t`/ or  /tʰ/', letters: 'th', pronunciation: 'thờ', sound: 'th' },
          { ipa: '/ʈ/ or /ʈ͡ʂ/', letters: 'tr', pronunciation: 'trờ', sound: 'tr' },
        ].map((row, idx) => (
          <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
            <Text style={[styles.tableCell, { flex: 0.7, fontWeight: '600',textAlign: 'center'  }]}>{row.ipa}</Text>
            <Text style={[styles.tableCell, { flex: 0.7,textAlign: 'center' }]}>{row.letters}</Text>
            <Text style={[styles.tableCell, { flex: 0.8, textAlign: 'center' }]}>{row.pronunciation}</Text>
            <Pressable
              style={{ flex: 0.7, alignItems: 'center' }}
              onPress={() => playSound(`table_${row.ipa}`)}
            >
              <Text style={styles.miniSpeaker}>🔊</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* Luyện đọc phụ âm */}
      <View style={styles.storyBox}>
        <View style={styles.tabHeader}>
          <Text style={styles.practiceTitleEn}>Practice Reading – Consonants</Text>
          <Pressable onPress={() => playSound('luyen_doc_phu_am')}>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>
        </View>
        <Text style={styles.practiceTitleVi}>Luyện đọc phụ âm</Text>

        <View style={styles.practiceGrid}>
          {[
            'p', 'ph', 'm', 'b', 'v', 'n', 't', 'th',
            'd / gi / r', 'đ', 'k / c / kh', 'g', 'gh',
            'h', 'l', 's', 'x', 'ch', 'nh', 'ng',
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.practiceItem}
              onPress={() => playSound(`consonant_${idx}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.practiceText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: THEME }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Nguyên âm và phụ âm</Text>
          <Text style={styles.headerSub}>Vowels and Consonants</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Mode tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, mode === 'vowels' && styles.tabActive]}
          onPress={() => setMode('vowels')}
        >
          <Text style={[styles.tabText, mode === 'vowels' && styles.tabTextActive]}>
            Nguyên âm
          </Text>
          <Text style={[styles.tabTextEn, mode === 'vowels' && styles.tabTextActive]}>
            Vowels
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, mode === 'consonants' && styles.tabActive]}
          onPress={() => setMode('consonants')}
        >
          <Text style={[styles.tabText, mode === 'consonants' && styles.tabTextActive]}>
            Phụ âm
          </Text>
          <Text style={[styles.tabTextEn, mode === 'consonants' && styles.tabTextActive]}>
            Consonants
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {mode === 'vowels' ? renderMode1() : renderMode2()}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: 'white',
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextEn: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  tabTextActive: {
    color: THEME,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardHeaderEn: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME,
  },
  cardHeaderVi: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  speakerBtn: {
    padding: 6,
  },
  speaker: {
    fontSize: 20,
  },
  miniSpeaker: {
    fontSize: 14,
  },

  paragraphEn: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1E293B',
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 21,
    color: '#475569',
    marginBottom: 14,
  },

  // Vowel chart
  vowelChart: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartLabelLeft: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME,
    width: 28,
  },
  chartLabelRight: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 8,
  },
  chartLabelCenter: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME,
    textAlign: 'center',
    flex: 1,
  },
  chartLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#94A3B8',
  },
  chartNote: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
  },

  // Practice box
  storyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    shadowColor: THEME,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  practiceTitleEn: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME,
  },
  practiceTitleVi: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },
  practiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  practiceItem: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  practiceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },

  // List items 2.1-2.11
  subSectionTitleEn: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 2,
  },
  subSectionTitleVi: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 10,
  },
  listSpeaker: {
    marginTop: 2,
  },
  listId: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME,
    marginBottom: 2,
  },
  listEn: {
    fontSize: 13,
    lineHeight: 19,
    color: '#1E293B',
  },
  listVi: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    marginTop: 2,
  },

  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: THEME,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  tableHeaderText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  tableCell: {
    fontSize: 12,
    color: '#334155',
  },
});

export default Phan1Bai2;