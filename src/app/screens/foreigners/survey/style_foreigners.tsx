// Phong cách học tập cho người nước ngoài
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SurveyLayout from './SurveyLayout';

const LEARNING_STYLES = [
  {
    id: 'speaking',
    icon: '🗣️',
    title: 'Nghe & Luyện nói phản xạ',
    sub: 'Học nhanh qua các đoạn hội thoại thực tế, đóng vai và phát âm (Auditory & Conversational)',
  },
  {
    id: 'reading',
    icon: '📖',
    title: 'Đọc & Trực quan hình ảnh',
    sub: 'Ghi nhớ tốt hơn qua thẻ từ vựng minh họa, văn bản và truyện ngắn (Visual & Reading)',
  },
  {
    id: 'gamified',
    icon: '🎮',
    title: 'Vừa học vừa chơi tương tác',
    sub: 'Thích làm bài tập trắc nghiệm nhanh, nối từ và thử thách tính điểm (Interactive Games)',
  },
  {
    id: 'structure',
    icon: '🧩',
    title: 'Ngữ pháp & Cấu trúc bài bản',
    sub: 'Thích phân tích trật tự từ, quy tắc ghép câu và cấu trúc ngôn ngữ (Analytical & Rules)',
  },
];

export default function StyleForeignersScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string>('speaking');

  return (
    <SurveyLayout
      step={6}
      totalSteps={7}
      titleBadge="BƯỚC 6"
      title="Phong cách học của bạn là gì?"
      subtitle="Chúng mình sẽ thiết kế định dạng bài tập phù hợp nhất với thói quen tiếp thu của bạn."
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate('HocTiengViet')}
      continueText="Tiếp tục"
      continueDisabled={!selected}
      onContinue={() => navigation.navigate('Practice')}
    >
      <View style={styles.list}>
        {LEARNING_STYLES.map((style) => {
          const isSelected = selected === style.id;

          return (
            <TouchableOpacity
              key={style.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => setSelected(style.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBadge, isSelected && styles.iconBadgeSelected]}>
                <Text style={styles.iconText}>{style.icon}</Text>
              </View>

              <View style={styles.textContainer}>
                <Text style={[styles.titleText, isSelected && styles.titleTextSelected]}>
                  {style.title}
                </Text>
                <Text style={styles.subText}>{style.sub}</Text>
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
