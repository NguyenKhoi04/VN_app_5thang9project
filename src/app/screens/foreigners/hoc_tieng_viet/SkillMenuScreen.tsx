// Component dùng chung cho màn hình chọn 6 kỹ năng
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

export interface SkillItem {
  id: number;
  title: string;       // Tiếng Việt
  subtitle: string;    // Tiếng Anh
  emoji: string;
  screenName: string;
  subSkills?: { label: string; labelEn: string; screenName: string }[];
}

interface SkillMenuProps {
  navigation: any;
  lessonTitle: string;
  lessonSubtitle: string;
  lessonNumber: number;
  themeColor: string;
  skills: SkillItem[];
  onBack: () => void;
}

const SkillCard: React.FC<{
  skill: SkillItem;
  themeColor: string;
  onPress: (screenName: string) => void;
}> = ({ skill, themeColor, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <View style={styles.skillWrapper}>
      <TouchableOpacity
        onPressIn={() => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        onPress={() => onPress(skill.screenName)}
        activeOpacity={0.85}
      >
        <Animated.View style={[styles.skillCard, { transform: [{ scale }] }]}>
          <View style={[styles.skillIconBox, { backgroundColor: themeColor }]}>
            <Text style={styles.skillEmoji}>{skill.emoji}</Text>
            <Text style={styles.skillNum}>{skill.id}</Text>
          </View>
          <View style={styles.skillTextBox}>
            <Text style={styles.skillTitle}>{skill.title}</Text>
            <Text style={styles.skillSub}>{skill.subtitle}</Text>
          </View>
          <Text style={[styles.chevron, { color: themeColor }]}>›</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Sub-skills (e.g. 1.1, 1.2, 1.3) */}
      {skill.subSkills && skill.subSkills.map((sub, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.subSkillRow, { borderLeftColor: themeColor }]}
          onPress={() => onPress(sub.screenName)}
          activeOpacity={0.75}
        >
          <Text style={[styles.subDot, { color: themeColor }]}>●</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.subLabel, { color: themeColor }]}>{sub.label}</Text>
            <Text style={styles.subLabelEn}>{sub.labelEn}</Text>
          </View>
          <Text style={[styles.chevronSmall, { color: themeColor }]}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const SkillMenuScreen: React.FC<SkillMenuProps> = ({
  navigation,
  lessonTitle,
  lessonSubtitle,
  lessonNumber,
  themeColor,
  skills,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBai}>Bài {lessonNumber}</Text>
          <Text style={styles.headerTitle} numberOfLines={2}>{lessonTitle}</Text>
          <Text style={styles.headerSub}>{lessonSubtitle}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Chọn kỹ năng • Select a skill</Text>

        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            themeColor={themeColor}
            onPress={(screenName) => navigation.navigate(screenName, { lessonId: lessonNumber })}
          />
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

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
  headerBai: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600', letterSpacing: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: 'white', textAlign: 'center', marginTop: 2 },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  scroll: { padding: 20 },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  skillWrapper: { marginBottom: 10 },

  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  skillIconBox: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillEmoji: { fontSize: 26 },
  skillNum: { fontSize: 10, color: 'white', fontWeight: '800' },
  skillTextBox: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  skillTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 3 },
  skillSub: { fontSize: 11, color: '#94A3B8' },
  chevron: { fontSize: 26, paddingRight: 14, fontWeight: '300' },

  subSkillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginTop: 2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderLeftWidth: 3,
    marginLeft: 16,
    borderRadius: 10,
  },
  subDot: { fontSize: 8, marginRight: 10 },
  subLabel: { fontSize: 13, fontWeight: '700' },
  subLabelEn: { fontSize: 10, color: '#94A3B8', marginTop: 1 },
  chevronSmall: { fontSize: 20, fontWeight: '300' },
});

export default SkillMenuScreen;
