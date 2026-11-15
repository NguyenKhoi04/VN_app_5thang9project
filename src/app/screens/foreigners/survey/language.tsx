// Chọn ngôn ngữ mẹ đẻ / ngôn ngữ dịch
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SurveyLayout from './SurveyLayout';

const LANGUAGES = [
  { id: 'en', flag: '🇬🇧', name: 'Tiếng Anh', native: 'English', sub: 'Học tiếng Việt từ tiếng Anh' },
  { id: 'ko', flag: '🇰🇷', name: 'Tiếng Hàn', native: '한국어', sub: '한국어로 베트남어 배우기' },
  { id: 'ja', flag: '🇯🇵', name: 'Tiếng Nhật', native: '日本語', sub: '日本語でベトナム語を学ぶ' },
  { id: 'zh', flag: '🇨🇳', name: 'Tiếng Trung', native: '中文', sub: '用中文学习越南语' },
  { id: 'fr', flag: '🇫🇷', name: 'Tiếng Pháp', native: 'Français', sub: 'Apprendre le vietnamien en français' },
  { id: 'de', flag: '🇩🇪', name: 'Tiếng Đức', native: 'Deutsch', sub: 'Vietnamesisch auf Deutsch lernen' },
  { id: 'ru', flag: '🇷🇺', name: 'Tiếng Nga', native: 'Русский', sub: 'Учить вьетнамский на русском' },
  { id: 'es', flag: '🇪🇸', name: 'Tiếng Tây Ban Nha', native: 'Español', sub: 'Aprende vietnamita en español' },
  { id: 'vi', flag: '🇻🇳', name: 'Tiếng Việt', native: 'Vietnamese', sub: 'Giao diện trực tiếp tiếng Việt' },
];

export default function LanguageScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string>('en');

  const filtered = LANGUAGES.filter((l) =>
    `${l.name} ${l.native} ${l.sub}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = async () => {
    const selectedItem = LANGUAGES.find((l) => l.id === selected);
    if (selectedItem) {
      try {
        await AsyncStorage.setItem('APP_LANGUAGE', selectedItem.name);
      } catch (_) {}
    }
    navigation.navigate('Age');
  };

  return (
    <SurveyLayout
      step={1}
      totalSteps={7}
      titleBadge="BƯỚC 1"
      title="Ngôn ngữ của bạn là gì?"
      subtitle="Chúng mình sẽ hiển thị bản dịch và hướng dẫn học bằng ngôn ngữ bạn chọn."
      onBack={() => navigation.goBack()}
      continueText="Tiếp tục"
      continueDisabled={!selected}
      onContinue={handleContinue}
    >
      {/* Thanh tìm kiếm ngôn ngữ */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm ngôn ngữ (vd: English, 한국어...)"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearchIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Danh sách ngôn ngữ */}
      <View style={styles.list}>
        {filtered.map((lang) => {
          const isSelected = selected === lang.id;

          return (
            <TouchableOpacity
              key={lang.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => setSelected(lang.id)}
              activeOpacity={0.8}
            >
              <View style={styles.flagBadge}>
                <Text style={styles.flagText}>{lang.flag}</Text>
              </View>

              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.nameText, isSelected && styles.nameTextSelected]}>
                    {lang.native}
                  </Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.viNameText}>{lang.name}</Text>
                </View>
                <Text style={styles.subText}>{lang.sub}</Text>
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    padding: 0,
  },
  clearSearchIcon: {
    fontSize: 14,
    color: '#94A3B8',
    paddingHorizontal: 4,
  },
  list: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
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
  flagBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  flagText: {
    fontSize: 26,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  nameTextSelected: {
    color: '#1D4ED8',
  },
  dot: {
    marginHorizontal: 6,
    color: '#94A3B8',
    fontSize: 12,
  },
  viNameText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  subText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
