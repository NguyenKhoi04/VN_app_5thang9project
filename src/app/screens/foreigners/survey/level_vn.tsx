// Trình độ tiếng Việt hiện tại của người nước ngoài
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SurveyLayout from './SurveyLayout';

const LEVELS = [
  {
    code: 'A1',
    name: 'Nhập môn (Beginner)',
    badge: 'Mới bắt đầu',
    icon: '🌱',
    desc: 'Chưa biết tiếng Việt hoặc mới làm quen bảng chữ cái, dấu thanh và cách chào hỏi.',
  },
  {
    code: 'A2',
    name: 'Sơ cấp (Elementary)',
    badge: 'Cơ bản',
    icon: '🌿',
    desc: 'Biết một số từ vựng thông dụng, hỏi đường, mua sắm và giao tiếp câu ngắn.',
  },
  {
    code: 'B1 - B2',
    name: 'Trung cấp (Intermediate)',
    badge: 'Tự tin',
    icon: '🌳',
    desc: 'Có thể trò chuyện tự nhiên về cuộc sống hàng ngày, đọc hiểu đoạn văn và bài hát.',
  },
  {
    code: 'C1 - C2',
    name: 'Nâng cao (Advanced)',
    badge: 'Thành thạo',
    icon: '🏆',
    desc: 'Diễn đạt trôi chảy, hiểu tiếng lóng vùng miền, đọc báo và làm việc chuyên nghiệp.',
  },
];

export default function LevelVnScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string>('A1');

  return (
    <SurveyLayout
      step={3}
      totalSteps={7}
      titleBadge="BƯỚC 3"
      title="Trình độ tiếng Việt của bạn?"
      subtitle="Chúng mình sẽ cá nhân hóa bài học để bạn không thấy quá khó hay quá dễ."
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate('HocTiengViet')}
      continueText="Tiếp tục"
      continueDisabled={!selected}
      onContinue={() => navigation.navigate('Desire')}
    >
      <View style={styles.list}>
        {LEVELS.map((level) => {
          const isSelected = selected === level.code;

          return (
            <TouchableOpacity
              key={level.code}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => setSelected(level.code)}
              activeOpacity={0.8}
            >
              <View style={styles.topRow}>
                <View style={[styles.iconBadge, isSelected && styles.iconBadgeSelected]}>
                  <Text style={styles.iconText}>{level.icon}</Text>
                </View>

                <View style={styles.headerInfo}>
                  <View style={styles.codeRow}>
                    <Text style={[styles.codeBadge, isSelected && styles.codeBadgeSelected]}>
                      {level.code}
                    </Text>
                    <Text style={styles.badgeText}>{level.badge}</Text>
                  </View>
                  <Text style={[styles.nameText, isSelected && styles.nameTextSelected]}>
                    {level.name}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleSelected,
                  ]}
                >
                  {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                </View>
              </View>

              <Text style={styles.descText}>{level.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SurveyLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOpacity: 0.15,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBadgeSelected: {
    backgroundColor: '#DBEAFE',
  },
  iconText: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  codeBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  codeBadgeSelected: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
  },
  badgeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  nameText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  nameTextSelected: {
    color: '#1D4ED8',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioCircleSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  descText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    paddingLeft: 4,
  },
});
