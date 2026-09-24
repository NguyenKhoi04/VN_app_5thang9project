// Màn hình chính: Chọn Phần học (1, 2, 3) hoặc Bảng từ vựng
import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';

interface SectionCardProps {
  number: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  bgColor: string;
  onPress: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  number,
  title,
  subtitle,
  emoji,
  color,
  bgColor,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.card, { backgroundColor: bgColor, transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.cardLeft, { backgroundColor: color }]}>
          <Text style={styles.cardEmoji}>{emoji}</Text>
          <Text style={styles.cardNumber}>{number}</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>4 bài học • 6 kỹ năng</Text>
          </View>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

interface Props {
  navigation: any;
}

const HocTiengViet: React.FC<Props> = ({ navigation }) => {
  const sections = [
    {
      number: 'PHẦN 1',
      title: 'Ngữ âm và chữ viết',
      subtitle: 'Phonetics and Writing\n(Writing system)',
      emoji: '✍️',
      color: '#4F46E5',
      bgColor: '#EEF2FF',
      screen: 'Phan1Roadmap',
    },
    {
      number: 'PHẦN 2',
      title: 'Luyện Phát âm',
      subtitle: 'Pronunciation Drills\n(Sounds & Tones)',
      emoji: '🎙️',
      color: '#0891B2',
      bgColor: '#ECFEFF',
      screen: 'Phan2Roadmap',
    },
    {
      number: 'PHẦN 3',
      title: 'Bài học theo chủ đề',
      subtitle: 'Thematic Lessons\n(Topic-based)',
      emoji: '📚',
      color: '#059669',
      bgColor: '#ECFDF5',
      screen: 'Phan3Roadmap',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerFlag}>🇻🇳</Text>
          <Text style={styles.headerTitle}>Tiếng Việt</Text>
          <Text style={styles.headerSub}>Vietnamese Language Course</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Chương trình học</Text>
          <Text style={styles.bannerSub}>Learning Program</Text>
          <Text style={styles.bannerDesc}>
            Chọn phần học phù hợp với bạn{'\n'}
            <Text style={styles.bannerDescEn}>Choose the section that suits you</Text>
          </Text>
        </View>

        {/* Section Cards */}
        {sections.map((sec) => (
          <SectionCard
            key={sec.number}
            number={sec.number}
            title={sec.title}
            subtitle={sec.subtitle}
            emoji={sec.emoji}
            color={sec.color}
            bgColor={sec.bgColor}
            onPress={() => navigation.navigate(sec.screen)}
          />
        ))}

        {/* Vocabulary Special Section */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>PHẦN ĐẶC BIỆT • SPECIAL SECTION</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.vocabCard}
          onPress={() => navigation.navigate('TuVungIndex')}
          activeOpacity={0.85}
        >
          <View style={styles.vocabLeft}>
            <Text style={styles.vocabEmoji}>📖</Text>
          </View>
          <View style={styles.vocabRight}>
            <Text style={styles.vocabTitle}>BẢNG TỪ VỰNG</Text>
            <Text style={styles.vocabSub}>Vocabulary Table</Text>
            <Text style={styles.vocabDesc}>
              Tiếng Việt | Từ loại | Tiếng Anh{'\n'}
              <Text style={styles.vocabDescEn}>Vietnamese | Word Type | English</Text>
            </Text>
            <Text style={styles.searchHint}>🔍 Tìm kiếm từ • Search words</Text>
          </View>
          <Text style={[styles.arrow, { color: '#D97706' }]}>›</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0000FF',
    marginTop: 30,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 22, color: 'white' },
  headerCenter: { alignItems: 'center' },
  headerFlag: { fontSize: 28 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: 'white' },
  headerSub: { fontSize: 11, color: '#BFDBFE', marginTop: 2 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },

  banner: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: 'white' },
  bannerSub: { fontSize: 13, color: '#BFDBFE', marginBottom: 8 },
  bannerDesc: { fontSize: 14, color: 'white', textAlign: 'center', lineHeight: 22 },
  bannerDescEn: { fontSize: 12, color: '#93C5FD' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardLeft: {
    width: 80,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 28, marginBottom: 4 },
  cardNumber: { fontSize: 10, fontWeight: '800', color: 'white', letterSpacing: 0.5 },
  cardRight: { flex: 1, paddingVertical: 14, paddingHorizontal: 14 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 8 },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 10, color: 'white', fontWeight: '700' },
  arrow: { fontSize: 28, color: '#94A3B8', paddingRight: 14, fontWeight: '300' },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { fontSize: 10, color: '#94A3B8', fontWeight: '700', marginHorizontal: 10, letterSpacing: 0.5 },

  vocabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  vocabLeft: {
    width: 70,
    height: 110,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vocabEmoji: { fontSize: 32 },
  vocabRight: { flex: 1, paddingVertical: 14, paddingHorizontal: 14 },
  vocabTitle: { fontSize: 16, fontWeight: '800', color: '#92400E', marginBottom: 2 },
  vocabSub: { fontSize: 12, color: '#B45309', marginBottom: 6 },
  vocabDesc: { fontSize: 12, color: '#78350F', lineHeight: 18, marginBottom: 4 },
  vocabDescEn: { fontSize: 10, color: '#92400E' },
  searchHint: { fontSize: 11, color: '#B45309', fontStyle: 'italic' },
});

export default HocTiengViet;
