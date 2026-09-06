//Lựa chọn phong cách học cho người nước ngoài
// Lựa chọn phong cách học cho người nước ngoài
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const learningStyles = [
  { id: 'speaking', text: 'Mình thích nói và trò chuyện', icon: '🗣️' },
  { id: 'reading', text: 'Mình học tốt hơn khi đọc', icon: '📖' },
  { id: 'none', text: 'Mình không có phong cách học cụ thể', icon: '🤔' },
];

const StyleForeignersScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Nút quay lại */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>◀️</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Phong cách học của bạn là gì?</Text>
        <Text style={styles.subtitle}>
          Chúng mình sẽ điều chỉnh phương pháp học phù hợp với phong cách của bạn.
        </Text>

        {/* Danh sách lựa chọn */}
        {learningStyles.map((style) => (
          <TouchableOpacity
            key={style.id}
            style={[
              styles.option,
              selected === style.id && styles.selectedOption,
            ]}
            onPress={() => setSelected(style.id)}
          >
            <View style={styles.left}>
              <Text style={styles.icon}>{style.icon}</Text>
              <Text style={styles.optionText}>{style.text}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Nút Tiếp tục */}
        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.disabledButton]}
          disabled={!selected}
          onPress={() => navigation.navigate('Practice')}
        >
          <Text style={styles.continueText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backIcon: {
    fontSize: 28,
    color: '#64748B',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 45,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    borderWidth: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 14,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1E3A8A',
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StyleForeignersScreen;