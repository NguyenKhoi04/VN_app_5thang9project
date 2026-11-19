// src/app/screens/life_topics/LifeTopicsScreen.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LIFE_TOPICS } from '@/services/aiDetectionService';

export default function LifeTopicsScreen({ navigation }: any) {
  const topics = Object.values(LIFE_TOPICS);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Chủ Đề Trong Cuộc Sống</Text>
          <Text style={styles.headerSubtitle}>Life Topics • AI Camera Nhận diện</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner giới thiệu tính năng AI */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>🤖 TÍNH NĂNG AI MỚI</Text>
          </View>
          <Text style={styles.aiBannerTitle}>
            Học Từ Vựng & Gọi Tên Sự Vật Qua Camera
          </Text>
          <Text style={styles.aiBannerDesc}>
            Đặt đồ vật thật trước camera (kích thước 200x200), công nghệ AI sẽ tự
            động quét, nhận diện hình ảnh và phát ra giọng đọc tiếng Việt chuẩn xác!
          </Text>
        </View>

        <Text style={styles.sectionHeading}>Chọn Chủ Đề Em Muốn Khám Phá ✨</Text>

        {/* 2 Chủ đề: Trái cây & Động vật */}
        <View style={styles.topicsGrid}>
          {topics.map((topic) => {
            const isFruit = topic.id === 'fruits';
            const themeColor = isFruit ? '#EF4444' : '#10B981';
            const bgGradient = isFruit ? '#FEF2F2' : '#ECFDF5';
            const borderColor = isFruit ? '#FCA5A5' : '#6EE7B7';

            return (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicCard,
                  { backgroundColor: bgGradient, borderColor: borderColor },
                ]}
                onPress={() =>
                  navigation.navigate('TopicDetail', { topicId: topic.id })
                }
                activeOpacity={0.85}
              >
                <View style={styles.topicHeader}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: themeColor + '20' },
                    ]}
                  >
                    <Text style={styles.topicIcon}>{topic.icon}</Text>
                  </View>
                  <View style={styles.badgeCount}>
                    <Text style={[styles.badgeCountText, { color: themeColor }]}>
                      {topic.items.length} Sự vật
                    </Text>
                  </View>
                </View>

                <Text style={styles.topicTitleVi}>{topic.titleVi}</Text>
                <Text style={styles.topicTitleEn}>{topic.titleEn}</Text>
                <Text style={styles.topicDesc}>{topic.description}</Text>

                {/* Danh sách 5 icon con */}
                <View style={styles.itemIconsRow}>
                  {topic.items.map((item) => (
                    <View key={item.id} style={styles.miniItemBox}>
                      <Text style={styles.miniItemEmoji}>{item.emoji}</Text>
                      <Text style={styles.miniItemName} numberOfLines={1}>
                        {item.vietnamese.replace('Quả ', '').replace('Con ', '')}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Nút Khám phá */}
                <View
                  style={[styles.exploreBtn, { backgroundColor: themeColor }]}
                >
                  <Text style={styles.exploreBtnText}>
                    🔍 Mở Camera Quét AI
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTextWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#BAE6FD',
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  aiBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    marginBottom: 20,
  },
  aiBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  aiBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  aiBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 6,
  },
  aiBannerDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  topicsGrid: {
    gap: 16,
  },
  topicCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicIcon: {
    fontSize: 30,
  },
  badgeCount: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  topicTitleVi: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  topicTitleEn: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  topicDesc: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 14,
    lineHeight: 18,
  },
  itemIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  miniItemBox: {
    alignItems: 'center',
    flex: 1,
  },
  miniItemEmoji: {
    fontSize: 22,
  },
  miniItemName: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    marginTop: 2,
  },
  exploreBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

