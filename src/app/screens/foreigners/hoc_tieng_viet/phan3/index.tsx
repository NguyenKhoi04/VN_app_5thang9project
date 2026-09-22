// Phần 3: Bài học theo chủ đề - Duolingo Roadmap đặc biệt
// Hiển thị tên chủ đề to (font 20) + tiếng Anh (font 13)
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const THEME = '#059669';

const lessons = [
  {
    id: 1,
    titleVN: 'XIN LỖI, ANH TÊN GÌ?',
    titleEN: 'Excuse me, What is your name?',
    emoji: '👋',
    status: 'current' as const,
    screenName: 'Phan3Bai1',
  },
  {
    id: 2,
    titleVN: 'CÔ LÀ NGƯỜI NƯỚC NÀO?',
    titleEN: 'Where are you from?',
    emoji: '🌍',
    status: 'current' as const,
    screenName: 'Phan3Bai2',
  },
  {
    id: 3,
    titleVN: 'ANH LÀM NGHỀ GÌ?',
    titleEN: 'What do you do?',
    emoji: '💼',
    status: 'current' as const,
    screenName: 'Phan3Bai3',
  },
  {
    id: 4,
    titleVN: 'NHÀ BẠN Ở ĐÂU?',
    titleEN: 'Where do you live?',
    emoji: '🏠',
    status: 'current' as const,
    screenName: 'Phan3Bai4',
  },
];

const PulseRing: React.FC = () => {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.22, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: THEME + '35',
        transform: [{ scale: pulse }],
      }}
    />
  );
};

interface Props { navigation: any; }

const Phan3Roadmap: React.FC<Props> = ({ navigation }) => {
  const reversed = [...lessons].reverse();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: THEME }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>PHẦN 3: Bài học theo chủ đề</Text>
          <Text style={styles.headerSub}>Thematic Lessons</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Trophy */}
        <View style={styles.trophyRow}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={[styles.trophyText, { color: THEME }]}>Hoàn thành tất cả chủ đề</Text>
          <Text style={styles.trophyTextEn}>Complete all topics</Text>
        </View>

        {reversed.map((lesson, idx) => {
          const isLeft = idx % 2 === 0;
          const isCurrent = lesson.status === 'current';
          const isLocked = false; // tất cả bài đã mở khóa


          return (
            <View key={lesson.id} style={styles.nodeWrapper}>
              {/* Dashed connector */}
              {idx < reversed.length - 1 && (
                <View style={[styles.connector, { left: isLeft ? width * 0.28 : width * 0.58 }]} />
              )}

              <View style={[styles.row, { flexDirection: isLeft ? 'row' : 'row-reverse' }]}>
                {/* Node */}
                <View style={[styles.nodeArea, { marginHorizontal: 20 }]}>
                  {isCurrent && <PulseRing />}
                  <TouchableOpacity
                    disabled={isLocked}
                    onPress={() => navigation.navigate(lesson.screenName)}
                    style={[
                      styles.nodeCircle,
                      {
                        backgroundColor: isLocked ? '#CBD5E1' : THEME,
                        borderColor: isCurrent ? 'white' : 'transparent',
                        borderWidth: isCurrent ? 4 : 0,
                        opacity: isLocked ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.nodeEmoji}>{isLocked ? '🔒' : lesson.emoji}</Text>
                    <Text style={styles.nodeBai}>Bài {lesson.id}</Text>
                  </TouchableOpacity>
                </View>

                {/* Topic card */}
                <TouchableOpacity
                  disabled={isLocked}
                  onPress={() => navigation.navigate(lesson.screenName)}
                  style={[
                    styles.topicCard,
                    {
                      opacity: isLocked ? 0.55 : 1,
                      borderColor: isCurrent ? THEME : '#E2E8F0',
                      borderWidth: isCurrent ? 2 : 1,
                    },
                  ]}
                >
                  {isCurrent && (
                    <View style={[styles.currentBadge, { backgroundColor: THEME }]}>
                      <Text style={styles.currentBadgeText}>⭐ Đang học • Current</Text>
                    </View>
                  )}
                  {/* BÀI number */}
                  <Text style={[styles.topicBai, { color: THEME }]}>BÀI {lesson.id}</Text>
                  {/* Title VN - font 20 */}
                  <Text style={styles.topicTitleVN}>{lesson.titleVN}</Text>
                  {/* Title EN - font 13 */}
                  <Text style={styles.topicTitleEN}>{lesson.titleEN}</Text>
                  {!isLocked && (
                    <Text style={[styles.startHint, { color: THEME }]}>Bắt đầu › Start</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Start */}
        <View style={[styles.startBanner, { borderColor: THEME }]}>
          <Text style={styles.startEmoji}>🚀</Text>
          <Text style={[styles.startText, { color: THEME }]}>Bắt đầu từ đây!</Text>
          <Text style={styles.startSub}>Start here!</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, marginTop: 30 },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 22, color: 'white' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 14, fontWeight: '800', color: 'white', textAlign: 'center' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  scroll: { paddingHorizontal: 16, paddingTop: 20 },
  trophyRow: { alignItems: 'center', marginBottom: 30 },
  trophy: { fontSize: 40 },
  trophyText: { fontSize: 14, fontWeight: '700', marginTop: 6 },
  trophyTextEn: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  nodeWrapper: { marginBottom: 60, position: 'relative' },
  connector: {
    position: 'absolute',
    bottom: -48,
    width: 3,
    height: 40,
    borderLeftWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#86EFAC',
    zIndex: 0,
  },
  row: { alignItems: 'center', gap: 10 },
  nodeArea: { alignItems: 'center', zIndex: 1 },
  nodeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  nodeEmoji: { fontSize: 30 },
  nodeBai: { fontSize: 9, color: 'white', fontWeight: '800', marginTop: 2 },
  topicCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  currentBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  currentBadgeText: { fontSize: 10, color: 'white', fontWeight: '700' },
  topicBai: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  topicTitleVN: { fontSize: 20, fontWeight: '900', color: '#1E293B', lineHeight: 26, marginBottom: 6 },
  topicTitleEN: { fontSize: 13, color: '#64748B', fontStyle: 'italic', lineHeight: 18 },
  startHint: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  startBanner: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  startEmoji: { fontSize: 32 },
  startText: { fontSize: 16, fontWeight: '800', marginTop: 8 },
  startSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
});

export default Phan3Roadmap;
