//Chọn ngôn ngữ của mình
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const languages = [
  { flag: '🇻🇳', name: 'Tiếng Việt (VietNamese)' },
  { flag: '🇰🇷', name: 'Tiếng Hàn (한국인)' },
  { flag: '🇬🇧', name: 'Tiếng Anh (English)' },
  // { flag: '🇹🇼', name: 'Tiếng Trung (中国人)' },
  // { flag: '🇸🇰', name: 'Tiếng Slovak (Slovenský jazyk)' },
  // { flag: '🇺🇦', name: 'Tiếng Ukraina (українська)' },
  // { flag: '🇪🇸', name: 'Tiếng Tây Ban Nha (Español)' },
  // { flag: '🇫🇷', name: 'Tiếng Pháp (Français)' },
  // { flag: '🇩🇪', name: 'Tiếng Đức (Deutsch)' },
  // { flag: '🇮🇹', name: 'Tiếng Ý (Italiano)' },
  // { flag: '🇷🇺', name: 'Tiếng Nga (Русский)' },
  { flag: '🇯🇵', name: 'Tiếng Nhật (日本語)' },
];

const LanguageScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = languages.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>◀️</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Chọn ngôn ngữ dịch</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm kiếm ngôn ngữ"
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView>
          {filtered.map((lang, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.option, selected === lang.name && styles.selectedOption]}
              onPress={() => setSelected(lang.name)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={styles.optionText}>{lang.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={[styles.continueButton, !selected && styles.disabledButton]}
          disabled={!selected}
          onPress={() => navigation.navigate('Age')}
        >
          <Text style={styles.continueText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2563EB', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 24, flex: 1 },
  backButton: { position: 'absolute', top: 20, left: 20 },
  backIcon: { fontSize: 28, color: '#64748B' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20, marginTop: 30 },
  searchInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  selectedOption: { backgroundColor: '#EFF6FF', borderWidth: 2, borderColor: '#2563EB' },
  flag: { fontSize: 28, marginRight: 16 },
  optionText: { fontSize: 18 },
  continueButton: { backgroundColor: '#2563EB', paddingVertical: 18, borderRadius: 16, marginTop: 10 },
  disabledButton: { backgroundColor: '#94A3B8' },
  continueText: { color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center' },
});

export default LanguageScreen;