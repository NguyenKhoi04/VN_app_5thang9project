import { useCallback, useEffect, useReducer } from 'react';

import { useLanguage } from './useLanguage';
import { getUILabels, UI_LABELS } from './uiLabels';
import { getEnglishValue, getNativeLocalizedValue } from './localizedField';
import {
  loadTranslationCache,
  needsTranslation,
  subscribeTranslations,
  translateText,
} from './autoTranslate';
import type { LangCode } from './courseStatic';

// Bảng tra nhanh: câu tiếng Anh có sẵn trong uiLabels → key, để dùng bản dịch thủ công
// (chính xác hơn, không cần gọi mạng) trước khi dùng dịch tự động.
const STATIC_KEYS = new Map<string, string>();
Object.entries(UI_LABELS.en).forEach(([key, value]) => {
  if (typeof value === 'string') STATIC_KEYS.set(value.trim().toLowerCase(), key);
});

function staticLookup(text: string, lang: LangCode): string | null {
  const key = STATIC_KEYS.get(text.trim().toLowerCase());
  if (!key) return null;
  const value = (UI_LABELS[lang] as unknown as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : null;
}

/**
 * Hook đa ngôn ngữ cho màn hình người nước ngoài.
 * - labels: nhãn UI dịch sẵn (uiLabels.ts)
 * - t(text): dịch văn bản tiếng Anh sang ngôn ngữ đang chọn (tự động)
 * - tField(row, 'tieu_de_en'): lấy cột CSDL theo ngôn ngữ (cột riêng nếu có, không thì dịch tự động cột _en)
 */
export function useLocalization() {
  const lang = useLanguage();
  const labels = getUILabels(lang);
  const [version, bump] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const unsubscribe = subscribeTranslations(bump);
    void loadTranslationCache(lang);
    return unsubscribe;
  }, [lang]);

  const t = useCallback(
    (text: string | null | undefined, fallback = ''): string => {
      const source = text == null || text === '' ? fallback : String(text);
      if (!source || !needsTranslation(lang)) return source;
      return staticLookup(source, lang) ?? translateText(source, lang);
    },
    // version: tạo hàm mới khi có bản dịch mới để component re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, version],
  );

  const tField = useCallback(
    (data: object | null | undefined, field: string, fallback = ''): string => {
      const native = getNativeLocalizedValue(data, field, lang);
      if (native) return native;
      return t(getEnglishValue(data, field, fallback));
    },
    [lang, t],
  );

  return { lang, labels, t, tField };
}
