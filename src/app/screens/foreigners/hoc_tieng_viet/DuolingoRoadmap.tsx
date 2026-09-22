// Component dùng chung: Duolingo-style roadmap - Redesigned
// Dùng cho Phần 1, 2
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

export interface LessonNode {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  status: 'locked' | 'current' | 'completed';
  screenName: string;
}

interface RoadmapProps {
  navigation: any;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionColor: string;
  lessons: LessonNode[];
  onBack: () => void;
}

const PulseAnim: React.FC<{ color: string }> = ({ color }) => {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.25, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: color + '30',
        transform: [{ scale: pulse }],
      }}
    />
  );
};

const DuolingoRoadmap: React.FC<RoadmapProps> = ({
  navigation,
  sectionTitle,
  sectionSubtitle,
  sectionColor,
  lessons,
  onBack,
}) => {
  const reversed = [...lessons].reverse();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: sectionColor }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{sectionTitle}</Text>
          <Text style={styles.headerSub}>{sectionSubtitle}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top goal */}
        <View style={[styles.goalBanner, { borderColor: sectionColor + '40' }]}>
          <Text style={styles.goalEmoji}>🏆</Text>
          <View style={styles.goalText}>
            <Text style={[styles.goalTitle, { color: sectionColor }]}>Mục tiêu • Goal</Text>
            <Text style={styles.goalDesc}>Hoàn thành tất cả bài học</Text>
            <Text style={styles.goalDescEn}>Complete all lessons</Text>
          </View>
        </View>

        {/* Lesson cards - vertical list with connecting line */}
        <View style={styles.roadmapContainer}>
          {/* Vertical track line */}
          <View style={[styles.trackLine, { backgroundColor: sectionColor + '30' }]} />

          {reversed.map((lesson, idx) => {
            const isCurrent = lesson.status === 'current';
            const isLocked = lesson.status === 'locked';
            const isCompleted = lesson.status === 'completed';

            return (
              <View key={lesson.id} style={styles.lessonRow}>
                {/* Node circle on the left */}
                <View style={styles.nodeCol}>
                  {isCurrent && <PulseAnim color={sectionColor} />}
                  <TouchableOpacity
                    disabled={isLocked}
                    onPress={() => navigation.navigate(lesson.screenName, { lessonId: lesson.id })}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.node,
                      {
                        backgroundColor: isLocked ? '#E2E8F0' : sectionColor,
                        borderColor: isCurrent ? 'white' : sectionColor,
                        borderWidth: isCurrent ? 4 : 0,
                        elevation: isCurrent ? 8 : 4,
                        shadowColor: isLocked ? '#94A3B8' : sectionColor,
                      },
                    ]}>
                      <Text style={styles.nodeEmoji}>
                        {isCompleted ? '✅' : isLocked ? '🔒' : lesson.emoji}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Bài number below node */}
                  <Text style={[styles.nodeBai, { color: isLocked ? '#94A3B8' : sectionColor }]}>
                    Bài {lesson.id}
                  </Text>
                </View>

                {/* Lesson info card on the right */}
                <TouchableOpacity
                  disabled={isLocked}
                  onPress={() => navigation.navigate(lesson.screenName, { lessonId: lesson.id })}
                  activeOpacity={0.85}
                  style={[
                    styles.lessonCard,
                    {
                      borderLeftColor: isLocked ? '#E2E8F0' : sectionColor,
                      opacity: isLocked ? 0.6 : 1,
                    },
                    isCurrent && { backgroundColor: sectionColor + '08', borderColor: sectionColor + '40', borderWidth: 1 },
                  ]}
                >
                  {isCurrent && (
                    <View style={[styles.activeBadge, { backgroundColor: sectionColor }]}>
                      <Text style={styles.activeBadgeText}>⭐ Đang học</Text>
                    </View>
                  )}
                  {isCompleted && (
                    <View style={[styles.activeBadge, { backgroundColor: '#10B981' }]}>
                      <Text style={styles.activeBadgeText}>✅ Hoàn thành</Text>
                    </View>
                  )}
                  <Text style={[styles.cardTitle, { color: isLocked ? '#94A3B8' : '#1E293B' }]}>
                    {lesson.title}
                  </Text>
                  <Text style={styles.cardSubtitle}>{lesson.subtitle}</Text>
                  {!isLocked && (
                    <View style={styles.cardFooter}>
                      <Text style={[styles.cardAction, { color: sectionColor }]}>
                        Vào học › Start
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Start banner at bottom */}
        <View style={[styles.startBanner, { borderColor: sectionColor + '50' }]}>
          <Text style={styles.startEmoji}>🚀</Text>
          <Text style={[styles.startText, { color: sectionColor }]}>Bắt đầu từ đây!</Text>
          <Text style={styles.startSub}>Start from here!</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop:30,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 22, color: 'white' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '800', color: 'white', textAlign: 'center' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  scroll: { paddingHorizontal: 20, paddingTop: 20 },

  goalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1.5,
    gap: 12,
  },
  goalEmoji: { fontSize: 32 },
  goalText: { flex: 1 },
  goalTitle: { fontSize: 13, fontWeight: '800', marginBottom: 3 },
  goalDesc: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  goalDescEn: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginTop: 2 },

  roadmapContainer: {
    position: 'relative',
    paddingLeft: 32,
    marginBottom: 24,
  },
  trackLine: {
    position: 'absolute',
    left: 44,
    top: 40,
    bottom: 40,
    width: 3,
    borderRadius: 2,
  },

  lessonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
  },

  nodeCol: {
    alignItems: 'center',
    width: 68,
    zIndex: 1,
  },
  node: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  nodeEmoji: { fontSize: 28 },
  nodeBai: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 5,
    letterSpacing: 0.3,
  },

  lessonCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    marginTop: 4,
  },
  activeBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  activeBadgeText: { fontSize: 10, color: 'white', fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '800', lineHeight: 21, marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#64748B', fontStyle: 'italic' },
  cardFooter: { marginTop: 10, flexDirection: 'row', alignItems: 'center' },
  cardAction: { fontSize: 13, fontWeight: '700' },

  startBanner: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 20,
    borderWidth: 2,
  },
  startEmoji: { fontSize: 30 },
  startText: { fontSize: 16, fontWeight: '800', marginTop: 8 },
  startSub: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
});

export default DuolingoRoadmap;
