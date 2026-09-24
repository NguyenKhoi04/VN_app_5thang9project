import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { Audio } from 'expo-av';
const THEME = '#4F46E5';
const LESSON_ID = 1;

interface LetterItem {
  upper: string;
  lower: string;
  hasSound: boolean;
  soundKey?: string; // key để map file âm thanh
}

const alphabet: LetterItem[] = [
  { upper: 'A', lower: 'a', hasSound: true, soundKey: 'a' },
  { upper: 'Ă', lower: 'ă', hasSound: false },
  { upper: 'Â', lower: 'â', hasSound: false },
  { upper: 'B', lower: 'b', hasSound: true, soundKey: 'b' },
  { upper: 'C', lower: 'c', hasSound: true, soundKey: 'c' },
  { upper: 'D', lower: 'd', hasSound: true, soundKey: 'd' },
  { upper: 'Đ', lower: 'đ', hasSound: true, soundKey: 'd2' },
  { upper: 'E', lower: 'e', hasSound: true, soundKey: 'e' },
  { upper: 'Ê', lower: 'ê', hasSound: true, soundKey: 'e2' },
  { upper: 'G', lower: 'g', hasSound: true, soundKey: 'g' },
  { upper: 'H', lower: 'h', hasSound: true, soundKey: 'h' },
  { upper: 'I', lower: 'i', hasSound: true, soundKey: 'i' },
  { upper: 'K', lower: 'k', hasSound: true, soundKey: 'k' },
  { upper: 'L', lower: 'l', hasSound: true, soundKey: 'l' },
  { upper: 'M', lower: 'm', hasSound: true, soundKey: 'm' },
  { upper: 'N', lower: 'n', hasSound: true, soundKey: 'n' },
  { upper: 'O', lower: 'o', hasSound: true, soundKey: 'o' },
  { upper: 'Ô', lower: 'ô', hasSound: true, soundKey: 'o2' },
  { upper: 'Ơ', lower: 'ơ', hasSound: true, soundKey: 'o3' },
  { upper: 'P', lower: 'p', hasSound: true, soundKey: 'p' },
  { upper: 'Q', lower: 'q', hasSound: true, soundKey: 'q' },
  { upper: 'R', lower: 'r', hasSound: true, soundKey: 'r' },
  { upper: 'S', lower: 's', hasSound: true, soundKey: 's' },
  { upper: 'T', lower: 't', hasSound: true, soundKey: 't' },
  { upper: 'Ư', lower: 'ư', hasSound: true, soundKey: 'u2' },
  { upper: 'V', lower: 'v', hasSound: true, soundKey: 'v' },
  { upper: 'X', lower: 'x', hasSound: true, soundKey: 'x' },
  { upper: 'Y', lower: 'y', hasSound: true, soundKey: 'y' },
];

// Map file âm thanh (bạn thay đường dẫn thật của mình)
const SOUND_MAP: Record<string, any> = {
  a: require('../../../../../../text-to-speech/alphabet_a.wav'),
  b: require('../../../../../../text-to-speech/alphabet_b.wav'),
  c: require('../../../../../../text-to-speech/alphabet_c.wav'),
  d: require('../../../../../../text-to-speech/alphabet_d.wav'),
  d2: require('../../../../../../text-to-speech/alphabet_d2.wav'),
  e: require('../../../../../../text-to-speech/alphabet_e.wav'),
  e2: require('../../../../../../text-to-speech/alphabet_e2.wav'),
  g: require('../../../../../../text-to-speech/alphabet_g.wav'),
  h: require('../../../../../../text-to-speech/alphabet_h.wav'),
  i: require('../../../../../../text-to-speech/alphabet_i.wav'),
  k: require('../../../../../../text-to-speech/alphabet_k.wav'),
  l: require('../../../../../../text-to-speech/alphabet_l.wav'),
  m: require('../../../../../../text-to-speech/alphabet_m.wav'),
  n: require('../../../../../../text-to-speech/alphabet_n.wav'),
  o: require('../../../../../../text-to-speech/alphabet_o.wav'),
  o2: require('../../../../../../text-to-speech/alphabet_o2.wav'),
  o3: require('../../../../../../text-to-speech/alphabet_o3.wav'),
  // p: require('../../../../../../text-to-speech/alphabet_p.wav'),
  // q: require('../../../../../../text-to-speech/alphabet_q.wav'),
  // r: require('../../../../../../text-to-speech/alphabet_r.wav'),
  // s: require('../../../../../../text-to-speech/alphabet_s.wav'),
  // t: require('../../../../../../text-to-speech/alphabet.wav'),
  // u2: require('../../../../../../text-to-speech/alphabet_u2.wav'),
  // v: require('../../../../../../text-to-speech/alphabet_v.wav'),
  // x: require('../../../../../../text-to-speech/alphabet_x.wav'),
  // y: require('../../../../../../text-to-speech/alphabet_y.wav'),
};

interface Props {
  navigation: any;
  route: any;
}

const Phan1Bai1: React.FC<Props> = ({ navigation }) => {
  const playSound = useCallback(async (soundKey?: string) => {
    if (!soundKey || !SOUND_MAP[soundKey]) return;

    try {
      const { sound } = await Audio.Sound.createAsync(SOUND_MAP[soundKey]);
      await sound.playAsync();
      // Tự unload sau khi phát xong
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {
      console.warn('Không phát được âm thanh:', e);
    }
  }, []);

  const renderLetter = (item: LetterItem, index: number) => {
    const isRed = !item.hasSound;

    return (
      <TouchableOpacity
        key={`${item.upper}-${index}`}
        style={[styles.letterCell, isRed && styles.letterCellRed]}
        activeOpacity={item.hasSound ? 0.7 : 1}
        onPress={() => item.hasSound && playSound(item.soundKey)}
        disabled={!item.hasSound}
      >
        <Text
          style={[
            styles.letterText,
            isRed && styles.letterTextRed,
          ]}
        >
          {item.upper}
          {item.lower}
        </Text>

        {item.hasSound ? (
          <View style={styles.speakerBadge}>
            <Text style={styles.speakerIcon}>🔊</Text>
          </View>
        ) : (
          <View style={styles.noSoundBadge}>
            <Text style={styles.noSoundText}>—</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Chia thành hàng 3 cột
  const rows: LetterItem[][] = [];
  for (let i = 0; i < alphabet.length; i += 3) {
    rows.push(alphabet.slice(i, i + 3));
  }

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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Bảng chữ cái tiếng Việt</Text>
          <Text style={styles.headerSub}>The Vietnamese Alphabet</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Goal banner */}
        <View style={styles.goalBanner}>
          <Text style={styles.goalEmoji}>🔤</Text>
          <View style={styles.goalText}>
            <Text style={styles.goalTitle}>BÀI 1 · PHẦN 1</Text>
            <Text style={styles.goalDesc}>Học bảng chữ cái & phát âm</Text>
            <Text style={styles.goalDescEn}>Learn the alphabet & pronunciation</Text>
          </View>
        </View>

        {/* Bảng chữ cái */}
        <View style={styles.alphabetCard}>
          <Text style={styles.sectionTitle}>Bảng chữ cái</Text>
          <Text style={styles.sectionSub}>Nhấn vào chữ có loa để nghe phát âm</Text>

          <View style={styles.grid}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((item, colIndex) => renderLetter(item, rowIndex * 3 + colIndex))}
                {/* Điền ô trống nếu hàng cuối thiếu */}
                {row.length < 3 &&
                  Array.from({ length: 3 - row.length }).map((_, i) => (
                    <View key={`empty-${i}`} style={styles.emptyCell} />
                  ))}
              </View>
            ))}
          </View>
        </View>

        {/* Ghi chú */}
        <View style={styles.noteBox}>
          <Text style={styles.noteEn}>
            <Text style={styles.noteEnLabel}>Note: </Text>
            <Text style={styles.noteEnBody}>
              Any words highlighted in red cannot be pronounced.
            </Text>
          </Text>

          <Text style={styles.noteVi}>
            *Ghi chú: Từ nào được tô chữ màu đỏ là không phát âm ra tiếng được.
          </Text>
        </View>

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

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  goalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  goalEmoji: {
    fontSize: 34,
  },
  goalText: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  goalDesc: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  goalDescEn: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 2,
  },

  alphabetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 18,
  },

  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  letterCell: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 78,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  letterCellRed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  letterText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  letterTextRed: {
    color: '#DC2626',
  },
  speakerBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  speakerIcon: {
    fontSize: 14,
  },
  noSoundBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  noSoundText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  emptyCell: {
    flex: 1,
  },

  noteBox: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noteEn: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  noteEnLabel: {
    color: '#DC2626',
    fontWeight: '700',
  },
  noteEnBody: {
    color: '#1E293B',
    fontStyle: 'italic',
  },
  noteVi: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
});

export default Phan1Bai1;