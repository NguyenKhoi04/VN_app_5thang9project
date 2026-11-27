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
import { type LangCode } from '../../locales/courseStatic';
import { setAppLanguage } from '../../locales/useLanguage';

/* ─── Cấu hình ngôn ngữ ─── */
const LANGUAGES: {
  id: LangCode;
  flag: string;
  name: string;      // tên tiếng Việt (luôn hiển thị)
  native: string;    // tên bản ngữ
}[] = [
  { id: 'en',    flag: '🇬🇧', name: 'Tiếng Anh',          native: 'English' },
  { id: 'ko',    flag: '🇰🇷', name: 'Tiếng Hàn',          native: '한국어' },
  { id: 'ja',    flag: '🇯🇵', name: 'Tiếng Nhật',         native: '日本語' },
  { id: 'zh-CN', flag: '🇨🇳', name: 'Tiếng Trung',        native: '中文' },
  { id: 'fr',    flag: '🇫🇷', name: 'Tiếng Pháp',         native: 'Français' },
  { id: 'de',    flag: '🇩🇪', name: 'Tiếng Đức',          native: 'Deutsch' },
  { id: 'ru',    flag: '🇷🇺', name: 'Tiếng Nga',          native: 'Русский' },
  { id: 'es',    flag: '🇪🇸', name: 'Tiếng Tây Ban Nha',  native: 'Español' },
  { id: 'vi',    flag: '🇻🇳', name: 'Tiếng Việt',         native: 'Vietnamese' },
];

/* ─── UI labels theo ngôn ngữ đang chọn ─── */
interface ScreenLabels {
  stepBadge: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  continueText: string;
  learnVietnameseFrom: (nativeName: string) => string;
}

const SCREEN_LABELS: Record<LangCode, ScreenLabels> = {
  vi: {
    stepBadge: 'BƯỚC 1',
    title: 'Ngôn ngữ của bạn là gì?',
    subtitle: 'Chúng mình sẽ hiển thị bản dịch và hướng dẫn học bằng ngôn ngữ bạn chọn.',
    searchPlaceholder: 'Tìm kiếm ngôn ngữ (vd: English, 한국어...)',
    continueText: 'Tiếp tục',
    learnVietnameseFrom: (_n) => 'Giao diện trực tiếp tiếng Việt',
  },
  en: {
    stepBadge: 'STEP 1',
    title: 'What is your language?',
    subtitle: 'We will show translations and study guides in your chosen language.',
    searchPlaceholder: 'Search language (e.g. English, 한국어...)',
    continueText: 'Continue',
    learnVietnameseFrom: (n) => `Learn Vietnamese from ${n}`,
  },
  ko: {
    stepBadge: '1단계',
    title: '당신의 언어는 무엇입니까?',
    subtitle: '선택한 언어로 번역과 학습 가이드를 제공합니다.',
    searchPlaceholder: '언어 검색 (예: English, 한국어...)',
    continueText: '계속하기',
    learnVietnameseFrom: (n) => `${n}(으)로 베트남어 배우기`,
  },
  'zh-CN': {
    stepBadge: '第1步',
    title: '你的语言是什么？',
    subtitle: '我们将以您选择的语言展示翻译和学习指南。',
    searchPlaceholder: '搜索语言（如：English、한국어...）',
    continueText: '继续',
    learnVietnameseFrom: (n) => `用${n}学习越南语`,
  },
  ja: {
    stepBadge: 'ステップ1',
    title: 'あなたの言語は何ですか？',
    subtitle: '選択した言語で翻訳と学習ガイドを表示します。',
    searchPlaceholder: '言語を検索（例：English、한국어...）',
    continueText: '次へ',
    learnVietnameseFrom: (n) => `${n}でベトナム語を学ぶ`,
  },
  fr: {
    stepBadge: 'ÉTAPE 1',
    title: 'Quelle est votre langue ?',
    subtitle: 'Nous afficherons les traductions et guides dans la langue choisie.',
    searchPlaceholder: 'Rechercher une langue (ex: English, 한국어...)',
    continueText: 'Continuer',
    learnVietnameseFrom: (n) => `Apprendre le vietnamien en ${n}`,
  },
  de: {
    stepBadge: 'SCHRITT 1',
    title: 'Was ist Ihre Sprache?',
    subtitle: 'Wir zeigen Übersetzungen und Lernhilfen in Ihrer gewählten Sprache.',
    searchPlaceholder: 'Sprache suchen (z.B. English, 한국어...)',
    continueText: 'Weiter',
    learnVietnameseFrom: (n) => `Vietnamesisch auf ${n} lernen`,
  },
  ru: {
    stepBadge: 'ШАГ 1',
    title: 'Какой у вас язык?',
    subtitle: 'Мы покажем переводы и руководства на выбранном языке.',
    searchPlaceholder: 'Поиск языка (напр.: English, 한국어...)',
    continueText: 'Продолжить',
    learnVietnameseFrom: (n) => `Учить вьетнамский на ${n}`,
  },
  es: {
    stepBadge: 'PASO 1',
    title: '¿Cuál es tu idioma?',
    subtitle: 'Mostraremos traducciones y guías de estudio en el idioma que elijas.',
    searchPlaceholder: 'Buscar idioma (ej: English, 한국어...)',
    continueText: 'Continuar',
    learnVietnameseFrom: (n) => `Aprender vietnamita en ${n}`,
  },
};

export default function LanguageScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<LangCode>('en');

  // Lấy labels UI theo ngôn ngữ đang chọn
  const ui = SCREEN_LABELS[selected] ?? SCREEN_LABELS.en;
  // Labels tiếng Việt luôn cố định
  const viUi = SCREEN_LABELS.vi;

  const filtered = LANGUAGES.filter((l) =>
    `${l.name} ${l.native}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = async () => {
    const selectedItem = LANGUAGES.find((l) => l.id === selected);
    if (selectedItem) {
      try {
        // Lưu cả id (LangCode) và tên hiển thị
        await setAppLanguage(selected);
        await AsyncStorage.setItem('APP_LANGUAGE_NAME', selectedItem.name);
      } catch (_) {}
    }
    navigation.navigate('Age');
  };

  return (
    <SurveyLayout
      step={1}
      totalSteps={7}
      titleBadge={ui.stepBadge}
      title={
        selected === 'vi'
          ? viUi.title
          : ui.title
      }
      subtitle={
        selected === 'vi'
          ? viUi.subtitle
          : ui.subtitle
      }
      onBack={() => navigation.goBack()}
      continueText={ui.continueText}
      continueDisabled={!selected}
      onContinue={handleContinue}
    >
      {/* Dòng phụ tiếng Việt khi người nước ngoài xem */}
      {selected !== 'vi' && (
        <Text style={styles.viHint}>{viUi.title}</Text>
      )}

      {/* Thanh tìm kiếm ngôn ngữ */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={ui.searchPlaceholder}
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
          // Dòng mô tả phụ: theo ngôn ngữ đang chọn
          const subLabel = ui.learnVietnameseFrom(lang.native);

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
                  {/* Dòng chính: tên bản ngữ */}
                  <Text style={[styles.nameText, isSelected && styles.nameTextSelected]}>
                    {lang.native}
                  </Text>
                  <Text style={styles.dot}>•</Text>
                  {/* Dòng phụ cố định: tên tiếng Việt */}
                  <Text style={styles.viNameText}>{lang.name}</Text>
                </View>
                {/* Mô tả: theo ngôn ngữ đang chọn */}
                <Text style={styles.subText}>{subLabel}</Text>
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
  viHint: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
  },
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
