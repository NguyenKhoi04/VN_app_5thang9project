// Component nền chung cho các màn hình kỹ năng
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

interface BaseSkillProps {
  navigation: any;
  skillTitle: string;       // Tiếng Việt - font 15
  skillSubtitle: string;    // Tiếng Anh - font 10
  skillNumber: string;      // e.g. "1", "1.1", "3.2"
  emoji: string;
  themeColor: string;
  children: React.ReactNode;
}

const BaseSkillContent: React.FC<BaseSkillProps> = ({
  navigation,
  skillTitle,
  skillSubtitle,
  skillNumber,
  emoji,
  themeColor,
  children,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.skillTag}>Kỹ năng {skillNumber}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.headerTitle}>{skillTitle}</Text>
          </View>
          <Text style={styles.headerSub}>{skillSubtitle}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {children}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.doneBtn, { backgroundColor: themeColor }]} onPress={() => navigation.goBack()}>
          <Text style={styles.doneBtnText}>✓ Hoàn thành • Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export const ContentCard: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={cardStyles.card}>
    {title && <Text style={cardStyles.cardTitle}>{title}</Text>}
    {children}
  </View>
);

export const ItemRow: React.FC<{ vn: string; en: string; color: string }> = ({ vn, en, color }) => (
  <View style={cardStyles.itemRow}>
    <View style={[cardStyles.dot, { backgroundColor: color }]} />
    <View style={{ flex: 1 }}>
      <Text style={cardStyles.vnText}>{vn}</Text>
      <Text style={cardStyles.enText}>{en}</Text>
    </View>
  </View>
);

export const PlayButton: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <TouchableOpacity style={[cardStyles.playBtn, { borderColor: color }]} activeOpacity={0.8}>
    <Text style={[cardStyles.playIcon, { color }]}>▶</Text>
    <Text style={[cardStyles.playText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { padding: 8, width: 40 },
  backIcon: { fontSize: 22, color: 'white' },
  headerCenter: { flex: 1, alignItems: 'center' },
  skillTag: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600', letterSpacing: 0.5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  emoji: { fontSize: 22 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: 'white' },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
  scroll: { padding: 20 },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  doneBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  doneBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  vnText: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  enText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 8,
    alignSelf: 'flex-start',
  },
  playIcon: { fontSize: 16 },
  playText: { fontSize: 14, fontWeight: '600' },
});

export default BaseSkillContent;
