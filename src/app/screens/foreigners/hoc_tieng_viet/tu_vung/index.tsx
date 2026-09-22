// Bảng từ vựng - Chọn bài (Bài 1, 2, 3, 4)
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const LESSONS = [
  { id: 1, titleVN: 'Xin lỗi, anh tên gì?', titleEN: 'Excuse me, What is your name?', emoji: '👋', count: 12 },
  { id: 2, titleVN: 'Cô là người nước nào?', titleEN: 'Where are you from?', emoji: '🌍', count: 15 },
  { id: 3, titleVN: 'Anh làm nghề gì?', titleEN: 'What do you do?', emoji: '💼', count: 18 },
  { id: 4, titleVN: 'Nhà bạn ở đâu?', titleEN: 'Where do you live?', emoji: '🏠', count: 14 },
];

interface Props { navigation: any; }

const TuVungIndex: React.FC<Props> = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backIcon}>◀</Text>
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerEmoji}>📖</Text>
        <Text style={styles.headerTitle}>BẢNG TỪ VỰNG</Text>
        <Text style={styles.headerSub}>Vocabulary Table</Text>
      </View>
      <View style={{ width: 40 }} />
    </View>

    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.intro}>
        Chọn bài để xem từ vựng{'\n'}
        <Text style={styles.introEn}>Select a lesson to view vocabulary</Text>
      </Text>

      {LESSONS.map((lesson) => (
        <TouchableOpacity
          key={lesson.id}
          style={styles.card}
          onPress={() => navigation.navigate('BangTuVung', { lessonId: lesson.id, lessonTitle: lesson.titleVN, lessonTitleEn: lesson.titleEN })}
          activeOpacity={0.85}
        >
          <View style={styles.cardLeft}>
            <Text style={styles.cardEmoji}>{lesson.emoji}</Text>
            <Text style={styles.cardBai}>Bài {lesson.id}</Text>
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.cardTitle}>{lesson.titleVN}</Text>
            <Text style={styles.cardSub}>{lesson.titleEN}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>📚 {lesson.count} từ vựng • words</Text>
            </View>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Chú thích từ loại • Word Type Legend</Text>
        {[
          { code: 'N', name: 'Danh từ', nameEn: 'Noun' },
          { code: 'V', name: 'Động từ', nameEn: 'Verb' },
          { code: 'ADJ', name: 'Tính từ', nameEn: 'Adjective' },
          { code: 'ADV', name: 'Phó từ', nameEn: 'Adverb' },
        ].map((item) => (
          <View key={item.code} style={styles.legendRow}>
            <View style={styles.legendBadge}>
              <Text style={styles.legendCode}>{item.code}</Text>
            </View>
            <Text style={styles.legendName}>{item.name} • {item.nameEn}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBEB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 22, color: 'white' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerEmoji: { fontSize: 24 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: 'white' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  scroll: { padding: 20 },
  intro: { fontSize: 16, fontWeight: '700', color: '#78350F', textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  introEn: { fontSize: 13, color: '#92400E', fontStyle: 'italic' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  cardLeft: {
    width: 72,
    height: 90,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 28 },
  cardBai: { fontSize: 10, color: 'white', fontWeight: '800', marginTop: 4 },
  cardRight: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 3 },
  cardSub: { fontSize: 11, color: '#64748B', fontStyle: 'italic', marginBottom: 8 },
  countBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: { fontSize: 11, color: '#92400E', fontWeight: '600' },
  arrow: { fontSize: 26, color: '#F59E0B', paddingRight: 14 },
  legend: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  legendTitle: { fontSize: 13, fontWeight: '700', color: '#78350F', marginBottom: 12 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  legendBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 44,
    alignItems: 'center',
  },
  legendCode: { fontSize: 12, fontWeight: '800', color: 'white' },
  legendName: { fontSize: 13, color: '#334155' },
});

export default TuVungIndex;
