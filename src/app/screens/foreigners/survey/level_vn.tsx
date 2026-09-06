//Trình độ Tiếng Việt cho Người Nước Ngoài
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const levels = [
  { name: 'Nhập môn', code: 'A1', icon: '📊' },
  { name: 'Sơ cấp', code: 'A2', icon: '📈' },
  { name: 'Trung cấp', code: 'B1 - B2', icon: '📊' },
  { name: 'Nâng cao', code: 'C1 - C2', icon: '📈' },
];

const LevelVnScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>◀️</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Trình độ tiếng Việt của bạn thế nào?</Text>
        <Text style={styles.subtitle}>
          Chúng mình sẽ cá nhân hóa các cuộc trò chuyện dựa trên trình độ ngôn ngữ của bạn.
        </Text>

        {levels.map((level, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option, selected === level.code && styles.selectedOption]}
            onPress={() => setSelected(level.code)}
          >
            <View style={styles.left}>
              <Text style={styles.icon}>{level.icon}</Text>
              <Text style={styles.optionText}>{level.name}</Text>
            </View>
            <Text style={styles.code}>{level.code}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.continueButton, !selected && styles.disabledButton]}
          disabled={!selected}
          onPress={() => navigation.navigate('Desire')}
        >
          <Text style={styles.continueText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2563EB', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 24 },
  backButton: { position: 'absolute', top: 20, left: 20 },
  backIcon: { fontSize: 28, color: '#64748B' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, marginTop: 30 },
  subtitle: { fontSize: 15, color: '#64748B', marginBottom: 24 },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginBottom: 12,
  },
  selectedOption: { backgroundColor: '#EFF6FF', borderColor: '#2563EB', borderWidth: 2 },
  left: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 24, marginRight: 14 },
  optionText: { fontSize: 18, fontWeight: '500' },
  code: { fontSize: 17, fontWeight: '600', color: '#2563EB' },
  continueButton: { backgroundColor: '#2563EB', paddingVertical: 18, borderRadius: 16, marginTop: 20 },
  disabledButton: { backgroundColor: '#94A3B8' },
  continueText: { color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center' },
});

export default LevelVnScreen;