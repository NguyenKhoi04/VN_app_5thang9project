import type { LangCode } from './courseStatic';

const LANGUAGE_SUFFIX: Record<LangCode, string> = {
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

export function getLocalizedField(
  data: object | null | undefined,
  field: string,
  lang: LangCode,
  fallback = '',
): string {
  if (!data) return fallback;

  const record = data as Record<string, unknown>;

  const baseField = field.replace(/_en$/, '');

  const suffix = LANGUAGE_SUFFIX[lang] ?? 'en';

  const keys = [
    `${baseField}_${suffix}`,
    `${baseField}_${lang}`,
    ...(lang === 'vi' ? [baseField] : []),
    `${baseField}_en`,
    `${baseField}_vi`,
    baseField,
  ];

  for (const key of keys) {
    const value = record[key];

    if (
      typeof value === 'string' &&
      value.trim() !== ''
    ) {
      return value;
    }
  }

  return fallback;
}