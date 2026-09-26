import React, { useCallback } from 'react';
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
const LESSON_ID = 3;

interface Props {
  navigation: any;
}

const Phan1Bai3: React.FC<Props> = ({ navigation }) => {
  const playSound = useCallback(async (key: string) => {
    console.log('Play sound:', key);
    // TODO: thay bằng file âm thanh thật
  }, []);

  const exampleTones = [
    { word: 'ba', key: 'ba_ngang' },
    { word: 'bà', key: 'ba_huyen' },
    { word: 'bá', key: 'ba_sac' },
    { word: 'bả', key: 'ba_hoi' },
    { word: 'bã', key: 'ba_nga' },
    { word: 'bạ', key: 'ba_nang' },
  ];

  const practiceLines = [
    'Ma, mà, má, mả, mã, mạ ',
    'Ba, bà, bá, bả, bã, bạ ',
    'Pa, pà, pá, pả, pã, pạ',
    'Va, và, vá, vả, vã, vạ', 
    'pha, phà, phá, phả, (phã), phạ',
    'Na, nà, ná, nả, nã, nạ', ' ta, tà, tá, tả, tã, tạ',
    'Tha, thà, thá, thả, (thã), thạ',
    'Nha, nhà, nhá, nhả, nhã, nhạ',
    'Tra, trà, trá, trả, trã, trạ', 'cha, chà, chá, chả, chã, chạ',
    'Xa, xà, xá, xả, xã, xạ', 'sa, sà, sá, sả, (sã), sạ',
    'Nga, ngà, ngá, ngả, ngã, ngạ',
    'Nghe, nghè, nghé, nghề, (nghẽ), nghệ',
    'Ga, gà, gá, gả, gã, gạ', 'ca, cà, cá, cả, (cã), cạ',
    'Ki, kì, kí, kỷ, kỹ, ky', 'gia, già, giá, giả, giã (giạ)',
    'Kha, khà, khá, khả, khã, khạ',
    'La, là, lá, lả, lã, lạ',
    'Ha, hà, há, hả, (hã), hạ',
    'Mi, mì, mí, mỉ, mĩ, mị', 'bi, bì, bí, bỉ, bĩ, bị',
    'Pi, pì, pí, pỉ, (pĩ), (pị)',
    'Vi, vì, ví, vỉ, vĩ, vị', 'phi, phì, phí, phỉ, (phĩ), phị',
    'Ni, nì, ní, nỉ, (nĩ), nị' , 
    'ti, tì, tí, tỉ, tĩ, tị',
    'Thi, thì, thí, thỉ, (thĩ), thị',
    'Nhi, nhì, nhí, nhỉ, nhĩ, nhị',
    'Tri, trì, trí, trỉ, trĩ, trị',
    'Xi, xì, xí, xỉ, (xĩ), xị',
    'si, sì, sí, sỉ, sĩ, sị',
    'Nghi, nghỉ, (nghí), nghĩ, nghĩ, nghị',
    'Gi, gì, gí, gỉ, gĩ, gị' , 
    'ki, kì, kí, kỉ, kĩ, kị',
    'Khi, khì, khí, khỉ, (khĩ), khị',
    'Li, lì, lí, lỉ, (lĩ), lị',
    'Hi, hì, hí, hỉ, hĩ, hị',
    'Mu, mù, mú, mủ, mũ, mụ', 
    'bu, bù, bú, bủ, (bũ), bụ',
    'Pu, pù, pú, pủ, (pũ), (pụ)',
    'Vu, vù, vú, (vủ), vũ, vụ', 
    'phu, phù, phú, phủ, phũ, phụ',
    'Nu, nù, nú, (nủ), (nũ), nụ',
    'tu, tù, tú, tủ, (tũ), tụ',
    'Thu, thù, thú, thủ, (thũ), thụ',
    'Nhu, (nhù), nhú, nhủ, nhũ, nhụ',
    'Tru, trù, trú, (trủ), (trũ), trụ',
    'Xu, xù, xú, (xủ), (xũ), xụ', 
    'su, sù, sú, sử, sũ, sụ',
    'Ngu, ngù, (ngú), ngủ, ngũ, ngụ',
    'Gu, gù, gú, gủ, (gũ), gụ', 
    'cu, cù, cú, củ, cũ, cụ',
    'Khu, khù, khú, (khủ), (khũ), khụ',
    'Lu, lù, lú, lủ, lũ, lụ',
    'Hu, hù, hú, hủ, hũ, hụ',
  ];

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
          <Text style={styles.headerTitle}>Thanh điệu</Text>
          <Text style={styles.headerSub}>Tones</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ========== KHUNG 1: LÝ THUYẾT ========== */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderEn}>The Tonal System</Text>
            <Pressable onPress={() => playSound('tones_intro')} style={styles.speakerBtn}>
              <Text style={styles.speaker}>🔊</Text>
            </Pressable>
          </View>
          <Text style={styles.cardHeaderVi}>Hệ thống thanh điệu</Text>

          <Text style={styles.paragraphEn}>
            There are 6 tones in Standard Vietnamese. The relationship between these six tones is described in the following chart:
          </Text>
          <Text style={styles.paragraph}>
            Tiếng Việt có 6 thanh điệu. Quan hệ giữa 6 thanh được minh họa trong bảng sau:
          </Text>

          {/* ===== BẢNG THANH ĐIỆU (đã chỉnh layout) ===== */}
      
          <View style={styles.table}>
            {/* Header row 1 */}
            <View style={styles.tableRow}>
              <View style={[styles.cell, styles.corner, { flex: 1.2 }]}>
                <Text style={styles.headerWhite}>Âm vực</Text>
                <Text style={styles.headerWhiteSmall}>Register</Text>
              </View>
              <View style={[styles.cell, styles.headerMain, { flex: 3.8 }]}>
                <Text style={styles.headerWhite}>Đường nét – Contour</Text>
              </View>
            </View>

            {/* Header row 2 */}
            <View style={styles.tableRow}>
              <View style={[styles.cell, styles.corner, { flex: 1.2 }]} />
              <View style={[styles.cell, styles.plainHeader, { flex: 1.35 }]}>
                <Text style={styles.subHeader}>Bằng</Text>
                <Text style={styles.subHeaderEn}>Plain</Text>
              </View>
              <View style={[styles.cell, styles.unevenHeader, { flex: 2.5 }]}>
                <Text style={styles.subHeader}>Trắc</Text>
                <Text style={styles.subHeaderEn}>Uneven</Text>
              </View>
            </View>

            {/* Row Cao – High */}
            <View style={styles.tableRow}>
              <View style={[styles.cell, styles.register, { flex: 1.2 }]}>
                <Text style={styles.registerText}>Cao</Text>
                <Text style={styles.registerEn}>High</Text>
              </View>
              <View style={[styles.cell, styles.plain, { flex: 1.5 }]}>
                <Text style={styles.tone}>ngang</Text>
                <Text style={styles.toneNote}>(thanh không dấu)</Text>
                <Text style={styles.toneEn}>unmarked</Text>
              </View>
              <View style={[styles.cell, styles.uneven, { flex: 1.25 }]}>
                <Text style={styles.tone}>ngã ( ~ )</Text>
                <Text style={styles.toneEn}>broken</Text>
              </View>
              <View style={[styles.cell, styles.uneven, { flex: 1.25 }]}>
                <Text style={styles.tone}>sắc ( ´ )</Text>
                <Text style={styles.toneEn}>rising</Text>
              </View>
            </View>

            {/* Row Thấp – Low */}
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.cell, styles.register, { flex: 1.2 }]}>
                <Text style={styles.registerText}>Thấp</Text>
                <Text style={styles.registerEn}>Low</Text>
              </View>
              <View style={[styles.cell, styles.plain, { flex: 1.5 }]}>
                <Text style={styles.tone}>huyền ( ` )</Text>
                <Text style={styles.toneEn}>falling</Text>
              </View>
              <View style={[styles.cell, styles.uneven, { flex: 1.25 }]}>
                <Text style={styles.tone}>hỏi ( ? )</Text>
                <Text style={styles.toneEn}>asking</Text>
              </View>
              <View style={[styles.cell, styles.uneven, { flex: 1.25 }]}>
                <Text style={styles.tone}>nặng ( . )</Text>
                <Text style={styles.toneEn}>heavy</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          <Text style={styles.notesTitleEn}>Notes:</Text>
          <Text style={styles.notesTitleVi}>Lưu ý:</Text>
          <Text style={styles.paragraphEn}>
            In the Southern dialect, there are only 5 tones. The two tones “hỏi” and “ngã” are pronounced identically. However, this is not a big obstacle in communication between Northern and Southern dialects.
          </Text>
          <Text style={styles.paragraph}>
            Trong tiếng địa phương Nam Bộ, chỉ có 5 thanh. Hai thanh "hỏi" và "ngã" được phát âm giống nhau. Tuy nhiên điều này không gây trở ngại lớn trong việc giao tiếp giữa các tiếng địa phương với nhau.
          </Text>
        </View>

        {/* ========== KHUNG LƯU Ý MÀU XANH ========== */}
        <View style={styles.noteBox}>
          <View style={styles.noteBadge}>
            <Text style={styles.noteBadgeText}>Lưu ý phần 3 (Practice Tones)</Text>
          </View>
          <Text style={styles.noteEn}>
            Words in parentheses are rare, found only in regional dialects, minority languages, or archaic vocabulary.
          </Text>
          <Text style={styles.noteVi}>
            Các chữ trong ngoặc đơn là các chữ hiếm gặp, chỉ có trong tiếng địa phương, trong ngôn ngữ dân tộc thiểu số hoặc từ ngữ cổ.
          </Text>
        </View>

        {/* ========== KHUNG 2: LUYỆN ĐỌC ========== */}
        <View style={styles.storyBox}>
          <View style={styles.tabHeader}>
            <Text style={styles.practiceTitleEn}>3. Practice Tones</Text>
            <Pressable onPress={() => playSound('luyen_thanh_dieu')}>
              <Text style={styles.speaker}>🔊</Text>
            </Pressable>
          </View>
          <Text style={styles.practiceTitleVi}>3. Luyện thanh điệu</Text>

          <Text style={styles.exampleLabelEn}>Example:</Text>
          <Text style={styles.exampleLabelVi}>Ví dụ:</Text>

          <View style={styles.exampleRow}>
            {exampleTones.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.exampleItem}
                onPress={() => playSound(item.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.exampleWord}>{item.word}</Text>
                <Text style={styles.miniSpeaker}>🔊</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.applyLabelEn}>Apply with the remaining words:</Text>
          <Text style={styles.applyLabelVi}>Áp dụng với các từ còn lại:</Text>

          <View style={styles.practiceList}>
            {practiceLines.map((line, idx) => (
              <View key={idx} style={styles.practiceLine}>
                <Text style={styles.practiceLineText}>{line}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

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
  backIcon: { fontSize: 22, color: 'white', fontWeight: '600' },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: 'white', textAlign: 'center' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  scroll: { paddingHorizontal: 16, paddingTop: 16 },

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
  cardHeaderEn: { fontSize: 17, fontWeight: '800', color: THEME },
  cardHeaderVi: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 12 },
  speakerBtn: { padding: 6 },
  speaker: { fontSize: 20 },
  miniSpeaker: { fontSize: 13 },

  paragraphEn: { fontSize: 14, lineHeight: 22, color: '#1E293B', marginBottom: 6 },
  paragraph: { fontSize: 13, lineHeight: 21, color: '#475569', marginBottom: 14 },

  // ===== TABLE (đã sửa layout) =====
  table: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginVertical: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    backgroundColor: '#F59E0B',
  },
  headerMain: {
    backgroundColor: '#F59E0B',
  },
  plainHeader: {
    backgroundColor: '#FEF3C7',
  },
  unevenHeader: {
    backgroundColor: '#FDE68A',
  },
  register: {
    backgroundColor: '#FEF3C7',
  },
  plain: {
    backgroundColor: '#FFFBEB',
  },
  uneven: {
    backgroundColor: '#FFF7ED',
  },
  headerWhite: {
    fontSize: 13,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
  },
  headerWhiteSmall: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    textAlign: 'center',
  },
  subHeaderEn: {
    fontSize: 10,
    color: '#B45309',
    textAlign: 'center',
  },
  registerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#78350F',
    textAlign: 'center',
  },
  registerEn: {
    fontSize: 10,
    color: '#92400E',
    textAlign: 'center',
  },
  tone: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  toneNote: {
    fontSize: 10,
    color: THEME,
    fontWeight: '600',
    marginTop: 2,
  },
  toneEn: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 1,
  },

  notesTitleEn: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginTop: 8 },
  notesTitleVi: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 6 },

  // Note box
  noteBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  noteBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  noteBadgeText: { color: 'white', fontSize: 12, fontWeight: '800' },
  noteEn: { fontSize: 13, lineHeight: 20, color: '#1E40AF', marginBottom: 6 },
  noteVi: { fontSize: 12, lineHeight: 19, color: '#1E3A8A' },

  // Practice
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
  practiceTitleEn: { fontSize: 15, fontWeight: '800', color: THEME },
  practiceTitleVi: { fontSize: 13, color: '#64748B', marginBottom: 14 },

  exampleLabelEn: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  exampleLabelVi: { fontSize: 12, color: '#64748B', marginBottom: 10 },
  exampleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  exampleItem: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  exampleWord: { fontSize: 16, fontWeight: '700', color: '#1E293B' },

  applyLabelEn: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  applyLabelVi: { fontSize: 12, color: '#64748B', marginBottom: 12 },

  practiceList: { gap: 8,width:'85%',marginHorizontal:'7%' },
  practiceLine: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  practiceLineText: { fontSize: 16, lineHeight: 22, color: '#334155' },
});

export default Phan1Bai3;