// Đâu là lý do chính bạn muốn học tiếng Việt
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SurveyLayout from './SurveyLayout';

const REASONS = [
  {
    id: 'travel',
    icon: '✈️',
    title: 'Du lịch và trải nghiệm Việt Nam',
    sub: 'Tận hưởng ẩm thực, danh lam thắng cảnh và văn hóa địa phương (Travel & Tourism)',
  },
  {
    id: 'family',
    icon: '💬',
    title: 'Giao tiếp với gia đình & bạn bè',
    sub: 'Trò chuyện thân mật với người thân, người yêu hoặc bạn bè người Việt (Family & Friends)',
  },
  {
    id: 'career',
    icon: '💼',
    title: 'Cơ hội nghề nghiệp & kinh doanh',
    sub: 'Làm việc với đối tác, doanh nghiệp hoặc định cư tại Việt Nam (Work & Business)',
  },
  {
    id: 'academic',
    icon: '🎓',
    title: 'Học thuật và du học',
    sub: 'Nghiên cứu văn hóa, lịch sử hoặc du học tại các trường đại học (Academic & Study)',
  },
  {
    id: 'challenge',
    icon: '🧠',
    title: 'Phát triển bản thân & giải trí',
    sub: 'Thử thách trí não với một ngôn ngữ có thanh điệu độc đáo (Brain exercise & Fun)',
  },
  {
    id: 'other',
    icon: '✨',
    title: 'Lý do khác',
    sub: 'Sở thích cá nhân đặc biệt (Other personal reasons)',
  },
];

export default function ReasonScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string>('travel');

  return (
    <SurveyLayout
      step={5}
      totalSteps={7}
      titleBadge="BƯỚC 5"
      title="Lý do chính bạn học tiếng Việt?"
      subtitle="Hiểu được động lực của bạn giúp ứng dụng duy trì cảm hứng học tập mỗi ngày."
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate('HocTiengViet')}
      continueText="Tiếp tục"
      continueDisabled={!selected}
      onContinue={() => navigation.navigate('Style_Foreigners')}
    >
      <View style={styles.list}>
        {REASONS.map((reason) => {
          const isSelected = selected === reason.id;

          return (
            <TouchableOpacity
              key={reason.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => setSelected(reason.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBadge, isSelected && styles.iconBadgeSelected]}>
                <Text style={styles.iconText}>{reason.icon}</Text>
              </View>

              <View style={styles.textContainer}>
                <Text style={[styles.titleText, isSelected && styles.titleTextSelected]}>
                  {reason.title}
                </Text>
                <Text style={styles.subText}>{reason.sub}</Text>
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
