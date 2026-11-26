// Dịch các chuỗi tiếng Anh viết cứng trong code (subtitle, labelEn, ...) qua backend /api/translate
import { useCallback, useEffect, useState } from 'react';

import { BASE_URL } from '../../../config/api';
import { useLanguage } from './useLanguage';

const cache: Record<string, Record<string, string>> = {};
const pending: Record<string, Set<string>> = {};
const timers: Record<string, ReturnType<typeof setTimeout> | undefined> = {};
const subscribers = new Set<() => void>();

function flush(lang: string) {
  const texts = [...(pending[lang] || [])];
  pending[lang] = new Set();
  if (!texts.length) return;
  fetch(`${BASE_URL}/api/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts, lang }),
  })
    .then((r) => r.json())
    .then((res) => {
      cache[lang] = { ...(cache[lang] || {}), ...(res?.map || {}) };
      subscribers.forEach((fn) => fn());
    })
    .catch(() => {
      /* giữ nguyên bản gốc nếu lỗi mạng */
    });
}

/** `tr('Pronunciation')` -> bản dịch theo ngôn ngữ hiện tại (en/vi giữ nguyên) */
export function useAutoTranslate() {
  const lang = useLanguage();
  const [, force] = useState(0);

  useEffect(() => {
    const fn = () => force((n) => n + 1);
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  }, []);

  return useCallback(
    (text?: string | null): string => {
      if (!text) return '';
      if (lang === 'en' || lang === 'vi') return text;
      const hit = cache[lang]?.[text];
      if (hit) return hit;
      (pending[lang] ||= new Set()).add(text);
      if (!timers[lang]) {
        timers[lang] = setTimeout(() => {
          timers[lang] = undefined;
          flush(lang);
        }, 50);
      }
      return text;
    },
    [lang],
  );
}

