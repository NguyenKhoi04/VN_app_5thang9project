//Chọn độ tuổi
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const ageOptions = [
  { emoji: '😊', label: '18-24' },
  { emoji: '😎', label: '25-34' },
  { emoji: '🕶️', label: '35-44' },
  { emoji: '😊', label: '45-54' },
  { emoji: '🙂', label: '55+' },
];

const AgeScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>◀️</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Bạn bao nhiêu tuổi?</Text>

        {ageOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option, selected === item.label && styles.selectedOption]}
            onPress={() => setSelected(item.label)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.optionText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.continueButton, !selected && styles.disabledButton]}
          disabled={!selected}
          onPress={() => navigation.navigate('LevelVn')}
        >
          <Text style={styles.continueText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2563EB', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 24, elevation: 5 },
  backButton: { position: 'absolute', top: 20, left: 20 },
  backIcon: { fontSize: 28, color: '#64748B' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 30, marginTop: 20 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  emoji: { fontSize: 28, marginRight: 16 },
  optionText: { fontSize: 18, fontWeight: '500' },
  continueButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 20,
  },
  disabledButton: { backgroundColor: '#94A3B8' },
  continueText: { color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center' },
});

export default AgeScreen;