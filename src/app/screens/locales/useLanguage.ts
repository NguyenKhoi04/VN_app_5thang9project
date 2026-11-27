// Hook lấy ngôn ngữ đã chọn từ AsyncStorage (key 'APP_LANGUAGE').
// Mặc định 'en' cho người nước ngoài nếu chưa chọn.
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { LangCode } from './courseStatic';

const STORAGE_KEY = 'APP_LANGUAGE';

const VALID_LANGS = new Set<string>([
  'vi', 'en', 'ko', 'zh-CN', 'ja', 'fr', 'de', 'ru', 'es',
]);

// Tương thích dữ liệu cũ: trước đây lưu tên tiếng Việt ('Tiếng Hàn') hoặc 'zh'
const LEGACY_MAP: Record<string, LangCode> = {
  zh: 'zh-CN',
  'zh-cn': 'zh-CN',
  'Tiếng Anh': 'en',
  'Tiếng Hàn': 'ko',
  'Tiếng Nhật': 'ja',
  'Tiếng Trung': 'zh-CN',
  'Tiếng Pháp': 'fr',
  'Tiếng Đức': 'de',
  'Tiếng Nga': 'ru',
  'Tiếng Tây Ban Nha': 'es',
  'Tiếng Việt': 'vi',
};

let currentLanguage: LangCode = 'en';
let revision = 0;
const listeners = new Set<(lang: LangCode) => void>();

export function isLangCode(value: unknown): value is LangCode {
  return typeof value === 'string' && VALID_LANGS.has(value);
}

export function normalizeLang(value: unknown): LangCode | null {
  if (isLangCode(value)) return value;
  if (typeof value === 'string' && LEGACY_MAP[value]) return LEGACY_MAP[value];
  return null;
}

export function getCurrentLanguage(): LangCode {
  return currentLanguage;
}

function notifyLanguage(lang: LangCode) {
  currentLanguage = lang;
  listeners.forEach((listener) => listener(lang));
}

export async function setAppLanguage(lang: LangCode): Promise<void> {
  if (!isLangCode(lang)) return;
  revision++;
  notifyLanguage(lang);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    console.warn('Language saving error:', error);
  }
}

export async function refreshLanguage(): Promise<void> {
  const version = revision;
  try {
    const value = normalizeLang(await AsyncStorage.getItem(STORAGE_KEY));
    if (version === revision && value && value !== currentLanguage) {
      notifyLanguage(value);
    }
  } catch (error) {
    console.warn('Language loading error:', error);
  }
}

export function useLanguage(): LangCode {
  const [lang, setLang] = useState<LangCode>(currentLanguage);

  useEffect(() => {
    listeners.add(setLang);
    setLang(currentLanguage);
    void refreshLanguage();
    return () => {
      listeners.delete(setLang);
    };
  }, []);

  return lang;
}
