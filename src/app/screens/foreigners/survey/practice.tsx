// Mục tiêu luyện tập mỗi ngày cho người nước ngoài
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SurveyLayout from './SurveyLayout';

const PRACTICE_GOALS = [
  {
    id: '5min',
    icon: '☕',
    title: '5 phút mỗi ngày',
    badge: 'Khởi động',
    sub: 'Nhẹ nhàng, dễ duy trì thói quen hàng ngày (Casual & Easy)',
  },
  {
    id: '15min',
    icon: '⚡',
    title: '15 phút mỗi ngày',
    badge: 'Phổ biến nhất ⭐',
    sub: 'Cân bằng hoàn hảo giữa thời gian và hiệu quả (Regular & Balanced)',
  },
  {
    id: '30min',
    icon: '🔥',
    title: '30 phút mỗi ngày',
    badge: 'Nghiêm túc',
    sub: 'Tiến bộ vượt bậc, giao tiếp cơ bản sau 1 tháng (Serious & Fast)',
  },
  {
    id: '60min',
    icon: '🚀',
    title: '60 phút mỗi ngày',
    badge: 'Chuyên sâu',
    sub: 'Chinh phục tiếng Việt trong thời gian ngắn nhất (Intensive & Pro)',
  },
];

export default function PracticeScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string>('15min');

  return (
    <SurveyLayout
      step={7}
      totalSteps={7}
      titleBadge="BƯỚC CUỐI CÙNG"
      title="Mục tiêu luyện tập mỗi ngày?"
      subtitle="Duy trì đều đặn mỗi ngày là chìa khóa vàng để thành thạo tiếng Việt."
      onBack={() => navigation.goBack()}
      continueText="🚀 Bắt đầu học ngay"
      continueDisabled={!selected}
      onContinue={() => navigation.navigate('HocTiengViet')}
    >
      <View style={styles.list}>
        {PRACTICE_GOALS.map((goal) => {
          const isSelected = selected === goal.id;

          return (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => setSelected(goal.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBadge, isSelected && styles.iconBadgeSelected]}>
                <Text style={styles.iconText}>{goal.icon}</Text>
              </View>

              <View style={styles.textContainer}>
                <View style={styles.headerRow}>
                  <Text style={[styles.titleText, isSelected && styles.titleTextSelected]}>
                    {goal.title}
                  </Text>
                  {goal.badge && (
                    <Text style={[styles.badge, isSelected && styles.badgeSelected]}>
                      {goal.badge}
                    </Text>
                  )}
                </View>
                <Text style={styles.subText}>{goal.sub}</Text>
              </View>

              <View
                style={[
                  styles.radioCircle,
                  isSelected && styles.radioCircleSelected,
                ]}
              >
                {isSelected && <Text style={styles.checkIcon}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Cam kết truyền động lực */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationEmoji}>💡</Text>
        <View style={styles.motivationTextContainer}>
          <Text style={styles.motivationTitle}>Bạn có thể đổi mục tiêu bất kỳ lúc nào</Text>
          <Text style={styles.motivationSub}>
            Ứng dụng sẽ gửi thông báo nhắc nhở nhẹ nhàng vào buổi tối để bạn không quên buổi học.
          </Text>
        </View>
      </View>
    </SurveyLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconBadgeSelected: {
    backgroundColor: '#DBEAFE',
  },
  iconText: {
    fontSize: 26,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  titleText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  titleTextSelected: {
    color: '#1D4ED8',
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  badgeSelected: {
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
  },
  subText: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
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
  motivationCard: {
    marginTop: 20,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  motivationEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  motivationTextContainer: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  motivationSub: {
    fontSize: 12,
    color: '#15803D',
    lineHeight: 17,
  },
});
