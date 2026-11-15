// Bạn muốn đạt được điều gì khi học tiếng Việt
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SurveyLayout from './SurveyLayout';

const DESIRES = [
  {
    id: 'basic',
    icon: '📚',
    title: 'Học những điều cơ bản nhất',
    sub: 'Nắm chắc phát âm, bảng chữ cái và ghép vần (Learn basics)',
  },
  {
    id: 'speaking',
    icon: '🗣️',
    title: 'Tự tin giao tiếp hàng ngày',
    sub: 'Nói chuyện trôi chảy, phản xạ nhanh không ngập ngừng (Daily conversation)',
  },
  {
    id: 'travel',
    icon: '✈️',
    title: 'Du lịch và sinh sống tại Việt Nam',
    sub: 'Tự tin gọi món, trả giá, hỏi đường và giao lưu người bản xứ (Travel & Living)',
  },
  {
    id: 'career',
    icon: '💼',
    title: 'Phục vụ công việc & sự nghiệp',
    sub: 'Mở rộng cơ hội kinh doanh và làm việc tại Việt Nam (Career & Business)',
  },
  {
    id: 'culture',
    icon: '🎨',
    title: 'Khám phá văn hóa & kết bạn',
    sub: 'Hiểu âm nhạc, phim ảnh, lịch sử và con người Việt Nam (Culture & Friends)',
  },
];

export default function DesireScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string>('speaking');

  return (
    <SurveyLayout
      step={4}
      totalSteps={7}
      titleBadge="BƯỚC 4"
      title="Bạn muốn đạt được điều gì?"
      subtitle="Chúng mình sẽ ưu tiên các bài học và bài luyện tập xoay quanh mục tiêu này của bạn."
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate('HocTiengViet')}
      continueText="Tiếp tục"
      continueDisabled={!selected}
      onContinue={() => navigation.navigate('Reason')}
    >
      <View style={styles.list}>
        {DESIRES.map((item) => {
          const isSelected = selected === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => setSelected(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBadge, isSelected && styles.iconBadgeSelected]}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>

              <View style={styles.textContainer}>
                <Text style={[styles.titleText, isSelected && styles.titleTextSelected]}>
                  {item.title}
                </Text>
                <Text style={styles.subText}>{item.sub}</Text>
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
  titleText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 3,
  },
  titleTextSelected: {
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
});
