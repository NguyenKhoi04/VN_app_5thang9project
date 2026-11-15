// Chọn độ tuổi
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SurveyLayout from './SurveyLayout';

const AGE_OPTIONS = [
  { id: 'under18', emoji: '👶', label: 'Dưới 18 tuổi', sub: 'Học sinh / Thiếu niên (Under 18)' },
  { id: '18_24', emoji: '🎒', label: '18 - 24 tuổi', sub: 'Sinh viên / Mới tốt nghiệp (18 - 24 years)' },
  { id: '25_34', emoji: '💼', label: '25 - 34 tuổi', sub: 'Người đi làm / Người trẻ (25 - 34 years)' },
  { id: '35_44', emoji: '👔', label: '35 - 44 tuổi', sub: 'Trung niên / Chuyên viên (35 - 44 years)' },
  { id: '45_54', emoji: '☕', label: '45 - 54 tuổi', sub: 'Trưởng thành / Nhà quản lý (45 - 54 years)' },
  { id: '55_plus', emoji: '🌸', label: '55+ tuổi', sub: 'Nghỉ hưu / Học giải trí (55+ years)' },
];

export default function AgeScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string>('25_34');

  return (
    <SurveyLayout
      step={2}
      totalSteps={7}
      titleBadge="BƯỚC 2"
      title="Bạn bao nhiêu tuổi?"
      subtitle="Chúng mình sẽ gợi ý các chủ đề giao tiếp và từ vựng phù hợp nhất với nhóm tuổi của bạn."
      onBack={() => navigation.goBack()}
      continueText="Tiếp tục"
      continueDisabled={!selected}
      onContinue={() => navigation.navigate('LevelVn')}
    >
      <View style={styles.list}>
        {AGE_OPTIONS.map((item) => {
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
              <View style={[styles.emojiBadge, isSelected && styles.emojiBadgeSelected]}>
                <Text style={styles.emojiText}>{item.emoji}</Text>
              </View>

              <View style={styles.textContainer}>
                <Text style={[styles.labelText, isSelected && styles.labelTextSelected]}>
                  {item.label}
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
  emojiBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emojiBadgeSelected: {
    backgroundColor: '#DBEAFE',
  },
  emojiText: {
    fontSize: 26,
  },
  textContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  labelTextSelected: {
    color: '#1D4ED8',
  },
  subText: {
    fontSize: 12.5,
    color: '#64748B',
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
