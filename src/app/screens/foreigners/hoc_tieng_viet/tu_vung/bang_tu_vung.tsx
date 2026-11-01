// Bảng từ vựng - 3 cột: Tiếng Việt | Từ loại | Tiếng Anh + Tìm kiếm
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';

interface VocabWord {
  vn: string;
  type: 'N' | 'V' | 'ADJ' | 'ADV';
  en: string;
}

// Vocabulary data per lesson
const VOCAB_DATA: Record<number, VocabWord[]> = {
  1: [
    { vn: 'xin chào', type: 'V', en: 'hello / greet' },
    { vn: 'xin lỗi', type: 'V', en: 'excuse me / sorry' },
    { vn: 'tên', type: 'N', en: 'name' },
    { vn: 'tôi', type: 'N', en: 'I / me' },
    { vn: 'anh', type: 'N', en: 'you (older male) / older brother' },
    { vn: 'chị', type: 'N', en: 'you (older female) / older sister' },
    { vn: 'bạn', type: 'N', en: 'you (friend/peer) / friend' },
    { vn: 'là', type: 'V', en: 'to be (am/is/are)' },
    { vn: 'gì', type: 'N', en: 'what' },
    { vn: 'cảm ơn', type: 'V', en: 'thank you' },
    { vn: 'vâng', type: 'ADV', en: 'yes (polite)' },
    { vn: 'không', type: 'ADV', en: 'no / not' },
  ],
  2: [
    { vn: 'người', type: 'N', en: 'person / people' },
    { vn: 'nước', type: 'N', en: 'country / water' },
    { vn: 'nào', type: 'N', en: 'which / what' },
    { vn: 'Việt Nam', type: 'N', en: 'Vietnam' },
    { vn: 'Anh', type: 'N', en: 'England / British' },
    { vn: 'Mỹ', type: 'N', en: 'America / American' },
    { vn: 'Hàn Quốc', type: 'N', en: 'South Korea' },
    { vn: 'Nhật Bản', type: 'N', en: 'Japan' },
    { vn: 'Pháp', type: 'N', en: 'France / French' },
    { vn: 'cô', type: 'N', en: 'you (younger female) / Miss' },
    { vn: 'ông', type: 'N', en: 'you (elderly male) / Mr.' },
    { vn: 'bà', type: 'N', en: 'you (elderly female) / Mrs.' },
    { vn: 'còn', type: 'ADV', en: 'and (you)? / still' },
    { vn: 'quốc tịch', type: 'N', en: 'nationality' },
    { vn: 'tiếng', type: 'N', en: 'language / sound' },
  ],
  3: [
    { vn: 'làm', type: 'V', en: 'to do / to work / to make' },
    { vn: 'nghề', type: 'N', en: 'occupation / profession' },
    { vn: 'giáo viên', type: 'N', en: 'teacher' },
    { vn: 'bác sĩ', type: 'N', en: 'doctor' },
    { vn: 'kỹ sư', type: 'N', en: 'engineer' },
    { vn: 'sinh viên', type: 'N', en: 'university student' },
    { vn: 'học sinh', type: 'N', en: 'student (school)' },
    { vn: 'nhân viên', type: 'N', en: 'staff / employee' },
    { vn: 'kinh doanh', type: 'N', en: 'business' },
    { vn: 'ở', type: 'V', en: 'to live / to stay / at' },
    { vn: 'công ty', type: 'N', en: 'company' },
    { vn: 'trường', type: 'N', en: 'school' },
    { vn: 'bệnh viện', type: 'N', en: 'hospital' },
    { vn: 'hiện nay', type: 'ADV', en: 'currently / nowadays' },
    { vn: 'đang', type: 'ADV', en: 'currently (doing)' },
    { vn: 'thích', type: 'V', en: 'to like' },
    { vn: 'rất', type: 'ADV', en: 'very / very much' },
    { vn: 'thú vị', type: 'ADJ', en: 'interesting' },
  ],
  4: [
    { vn: 'nhà', type: 'N', en: 'house / home' },
    { vn: 'ở đâu', type: 'ADV', en: 'where (location)' },
    { vn: 'địa chỉ', type: 'N', en: 'address' },
    { vn: 'đường', type: 'N', en: 'road / street' },
    { vn: 'thành phố', type: 'N', en: 'city' },
    { vn: 'tỉnh', type: 'N', en: 'province' },
    { vn: 'quận', type: 'N', en: 'district (urban)' },
    { vn: 'huyện', type: 'N', en: 'district (rural)' },
    { vn: 'gần', type: 'ADJ', en: 'near / close' },
    { vn: 'xa', type: 'ADJ', en: 'far' },
    { vn: 'cách', type: 'V', en: 'to be (distance) away from' },
    { vn: 'đây', type: 'ADV', en: 'here / this place' },
    { vn: 'đó', type: 'ADV', en: 'there / that place' },
    { vn: 'trung tâm', type: 'N', en: 'center / downtown' },
  ],
};

const TYPE_COLORS: Record<string, string> = {
  N: '#4F46E5',
  V: '#059669',
  ADJ: '#D97706',
  ADV: '#DC2626',
};

interface Props { navigation: any; route: any; }

const BangTuVung: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId = 1, lessonTitle = '', lessonTitleEn = '' } = route?.params || {};
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  const words = VOCAB_DATA[lessonId] || [];

  const filtered = useMemo(() => {
    return words.filter((w) => {
      const matchSearch =
        search === '' ||
        w.vn.toLowerCase().includes(search.toLowerCase()) ||
        w.en.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === null || w.type === filterType;
      return matchSearch && matchType;
    });
  }, [words, search, filterType]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBai}>Bài {lessonId} • Lesson {lessonId}</Text>
          <Text style={styles.headerTitle} numberOfLines={2}>{lessonTitle}</Text>
          <Text style={styles.headerSub}>{lessonTitleEn}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm từ vựng... • Search words..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94A3B8"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Type filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filterType === null && styles.filterChipActive]}
          onPress={() => setFilterType(null)}
        >
          <Text style={[styles.filterText, filterType === null && { color: 'white' }]}>Tất cả • All</Text>
        </TouchableOpacity>
        {(['N', 'V', 'ADJ', 'ADV'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterChip, filterType === type && { backgroundColor: TYPE_COLORS[type] }]}
            onPress={() => setFilterType(filterType === type ? null : type)}
          >
            <Text style={[styles.filterText, filterType === type && { color: 'white' }]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Count */}
      <Text style={styles.countLabel}>{filtered.length} từ • words</Text>

      {/* Table header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.colHead, { flex: 2.5 }]}>Tiếng Việt</Text>
        <Text style={[styles.colHead, { flex: 1, textAlign: 'center' }]}>Từ loại{'\n'}Type</Text>
        <Text style={[styles.colHead, { flex: 2.5, textAlign: 'right' }]}>Tiếng Anh</Text>
      </View>

      {/* Table rows */}
      <FlatList
        data={filtered}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <View style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
            <Text style={[styles.colVN, { flex: 2.5 }]}>{item.vn}</Text>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[item.type] }]}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
            </View>
            <Text style={[styles.colEN, { flex: 2.5 }]}>{item.en}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>Không tìm thấy từ nào</Text>
            <Text style={styles.emptyTextEn}>No words found</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBEB' },
  header: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 22, color: 'white' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerBai: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  headerTitle: { fontSize: 15, fontWeight: '800', color: 'white', textAlign: 'center', marginTop: 2 },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', marginTop: 2 },

  searchRow: { padding: 16, paddingBottom: 0 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1E293B' },
  clearBtn: { fontSize: 16, color: '#94A3B8', paddingLeft: 8 },

  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  filterChipActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#475569' },

  countLabel: { fontSize: 12, color: '#92400E', paddingHorizontal: 20, marginBottom: 4, fontWeight: '600' },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  colHead: { fontSize: 12, fontWeight: '800', color: 'white' },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
  },
  tableRowAlt: { backgroundColor: '#FFFBEB' },
  colVN: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  typeBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  typeText: { fontSize: 11, fontWeight: '800', color: 'white' },
  colEN: { fontSize: 13, color: '#475569', textAlign: 'right' },

  emptyBox: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#92400E', marginTop: 12 },
  emptyTextEn: { fontSize: 13, color: '#B45309', marginTop: 4, fontStyle: 'italic' },
});

export default BangTuVung;
