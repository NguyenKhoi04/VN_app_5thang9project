import type { LangCode } from './courseStatic';

/** Hậu tố cột CSDL theo ngôn ngữ (vd: tieu_de_ko, cau_zh_cn). */
export const LANGUAGE_SUFFIX: Record<LangCode, string> = {
  vi: 'vi',
  en: 'en',
  ko: 'ko',
  'zh-CN': 'zh_cn',
  ja: 'ja',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  es: 'es',
};

/** Hậu tố kiểu camelCase (vd: labelEn → labelKo, labelZhCn). */
const CAMEL_SUFFIX: Record<LangCode, string> = {
  vi: 'Vi',
  en: 'En',
  ko: 'Ko',
  'zh-CN': 'ZhCn',
  ja: 'Ja',
  fr: 'Fr',
  de: 'De',
  ru: 'Ru',
  es: 'Es',
};

function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

/**
 * Tìm giá trị đã được dịch sẵn trong dữ liệu (nếu CSDL có cột riêng cho ngôn ngữ).
 * field có thể là 'tieu_de_en' / 'tieu_de' hoặc 'labelEn'.
 */
export function getNativeLocalizedValue(
  data: object | null | undefined,
  field: string,
  lang: LangCode,
): string | null {
  if (!data) return null;
  const record = data as Record<string, unknown>;

  if (/[a-z0-9]En$/.test(field)) {
    const base = field.slice(0, -2);
    const value = record[`${base}${CAMEL_SUFFIX[lang]}`];
    return nonEmpty(value) ? value : null;
  }

  const base = field.replace(/_en$/, '');
  const candidates = [`${base}_${LANGUAGE_SUFFIX[lang]}`, `${base}_${lang}`];
  for (const key of candidates) {
    const value = record[key];
    if (nonEmpty(value)) return value;
  }
  return null;
}

/** Giá trị tiếng Anh gốc của field (tieu_de_en, labelEn...). */
export function getEnglishValue(
  data: object | null | undefined,
  field: string,
  fallback = '',
): string {
  if (!data) return fallback;
  const record = data as Record<string, unknown>;

  const keys = /[a-z0-9]En$/.test(field)
    ? [field]
    : [field.endsWith('_en') ? field : `${field}_en`, field];

  for (const key of keys) {
    const value = record[key];
    if (nonEmpty(value)) return value;
  }
  return fallback;
}

/** Lấy giá trị theo ngôn ngữ, không dịch tự động (dùng khi chỉ cần cột có sẵn). */
export function getLocalizedField(
  data: object | null | undefined,
  field: string,
  lang: LangCode,
  fallback = '',
): string {
  return getNativeLocalizedValue(data, field, lang) ?? getEnglishValue(data, field, fallback);
}
