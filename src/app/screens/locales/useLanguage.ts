// Hook lấy ngôn ngữ đã chọn từ AsyncStorage
/**
 * Hook trả về LangCode hiện tại (đọc từ AsyncStorage key 'APP_LANGUAGE').
 * Nếu chưa chọn hoặc lỗi, trả về 'en' (mặc định cho người nước ngoài).
 */
import { useEffect, useState } from 'react';
import AsyncStorage from
  '@react-native-async-storage/async-storage';

import type { LangCode } from './courseStatic';
import { BASE_URL } from '../../../config/api';

const STORAGE_KEY = 'APP_LANGUAGE';

const VALID_LANGS = new Set<string>([
  'vi',
  'en',
  'ko',
  'zh-CN',
  'ja',
  'fr',
  'de',
  'ru',
  'es',
]);

let currentLanguage: LangCode = 'en';

let revision = 0;

const listeners = new Set<
  (lang: LangCode) => void
>();

function isLangCode(value: unknown): value is LangCode {
  return (
    typeof value === 'string' &&
    VALID_LANGS.has(value)
  );
}

function notifyLanguage(lang: LangCode) {
  currentLanguage = lang;

  listeners.forEach(listener => {
    listener(lang);
  });
}

export function getAppLanguage(): LangCode {
  return currentLanguage;
}

// Tự gắn header `x-lang` vào mọi request tới backend để server dịch các cột *_en
const globalAny = globalThis as any;
if (!globalAny.__langFetchPatched) {
  globalAny.__langFetchPatched = true;
  const originalFetch = globalAny.fetch?.bind(globalThis);
  if (originalFetch) {
    globalAny.fetch = (input: any, init: any = {}) => {
      try {
        const url = typeof input === 'string' ? input : input?.url ?? '';
        if (typeof url === 'string' && url.startsWith(BASE_URL)) {
          init = {
            ...init,
            headers: { ...(init.headers || {}), 'x-lang': currentLanguage },
          };
        }
      } catch {
        /* ignore */
      }
      return originalFetch(input, init);
    };
  }
}

export async function setAppLanguage(
  lang: LangCode,
): Promise<void> {
  if (!isLangCode(lang)) return;

  revision++;

  await AsyncStorage.setItem(STORAGE_KEY, lang);

  notifyLanguage(lang);
}

export async function refreshLanguage() {
  const version = revision;

  try {
    const value = await AsyncStorage.getItem(
      STORAGE_KEY,
    );

    if (version === revision && isLangCode(value)) {
      notifyLanguage(value);
    }
  } catch (error) {
    console.warn('Language loading error:', error);
  }
}

export function useLanguage(): LangCode {
  const [lang, setLang] = useState<LangCode>(
    currentLanguage,
  );

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

