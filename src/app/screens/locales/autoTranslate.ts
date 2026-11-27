// Dịch tự động văn bản tiếng Anh (dòng phụ, cột *_en trong CSDL...) sang ngôn ngữ người dùng chọn.
// - Gọi backend POST /api/translate (backend dịch + lưu cache vào bảng ban_dich_tu_dong).
// - Cache trên thiết bị bằng AsyncStorage để lần sau hiển thị ngay, không cần mạng.
// - Trong lúc chờ dịch sẽ hiển thị tạm văn bản tiếng Anh gốc.
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from '../../../config/api';
import type { LangCode } from './courseStatic';

const CACHE_PREFIX = 'AUTO_TRANSLATE_CACHE_V1_';
const BATCH_SIZE = 40;
const FLUSH_DELAY_MS = 60;
const RETRY_AFTER_MS = 60_000;

type Cache = Map<string, string>;

const caches = new Map<LangCode, Cache>();
const loadingCaches = new Map<LangCode, Promise<void>>();
const pending = new Map<LangCode, Set<string>>();
const inflight = new Map<LangCode, Set<string>>();
const failedAt = new Map<string, number>();
const listeners = new Set<() => void>();
const persistTimers = new Map<LangCode, ReturnType<typeof setTimeout>>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

/** Ngôn ngữ cần dịch từ tiếng Anh. 'en' giữ nguyên; 'vi' giữ dòng phụ tiếng Anh (dòng chính đã là tiếng Việt). */
export function needsTranslation(lang: LangCode): boolean {
  return lang !== 'en' && lang !== 'vi';
}

function getCache(lang: LangCode): Cache {
  let cache = caches.get(lang);
  if (!cache) {
    cache = new Map();
    caches.set(lang, cache);
  }
  return cache;
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeTranslations(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Nạp cache đã lưu trên thiết bị cho 1 ngôn ngữ (chỉ chạy 1 lần). */
export function loadTranslationCache(lang: LangCode): Promise<void> {
  if (!needsTranslation(lang)) return Promise.resolve();
  const existing = loadingCaches.get(lang);
  if (existing) return existing;

  const task = (async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_PREFIX + lang);
      if (raw) {
        const stored = JSON.parse(raw) as Record<string, string>;
        const cache = getCache(lang);
        let added = false;
        Object.entries(stored).forEach(([src, dst]) => {
          if (!cache.has(src) && typeof dst === 'string') {
            cache.set(src, dst);
            added = true;
          }
        });
        if (added) notify();
      }
    } catch (error) {
      console.warn('Translation cache loading error:', error);
    }
  })();

  loadingCaches.set(lang, task);
  return task;
}

function schedulePersist(lang: LangCode) {
  const old = persistTimers.get(lang);
  if (old) clearTimeout(old);
  persistTimers.set(
    lang,
    setTimeout(() => {
      persistTimers.delete(lang);
      const data = Object.fromEntries(getCache(lang));
      AsyncStorage.setItem(CACHE_PREFIX + lang, JSON.stringify(data)).catch((error) =>
        console.warn('Translation cache saving error:', error),
      );
    }, 800),
  );
}

async function requestBatch(lang: LangCode, texts: string[]) {
  const flying = inflight.get(lang) ?? new Set<string>();
  inflight.set(lang, flying);
  texts.forEach((t) => flying.add(t));

  try {
    const res = await fetch(`${BASE_URL}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'en', target: lang, texts }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { translations?: (string | null)[] };
    const results = Array.isArray(json.translations) ? json.translations : [];
    const cache = getCache(lang);
    let changed = false;

    texts.forEach((src, i) => {
      const dst = results[i];
      if (typeof dst === 'string' && dst.trim() !== '') {
        cache.set(src, dst);
        changed = true;
      } else {
        failedAt.set(`${lang}\u0000${src}`, Date.now());
      }
    });

    if (changed) {
      schedulePersist(lang);
      notify();
    }
  } catch (error) {
    const now = Date.now();
    texts.forEach((src) => failedAt.set(`${lang}\u0000${src}`, now));
    console.warn('Auto translate error:', error);
  } finally {
    texts.forEach((t) => flying.delete(t));
  }
}

function flush() {
  flushTimer = null;
  pending.forEach((set, lang) => {
    const texts = Array.from(set);
    set.clear();
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      void requestBatch(lang, texts.slice(i, i + BATCH_SIZE));
    }
  });
}

function enqueue(lang: LangCode, text: string) {
  if (inflight.get(lang)?.has(text)) return;
  const failed = failedAt.get(`${lang}\u0000${text}`);
  if (failed && Date.now() - failed < RETRY_AFTER_MS) return;

  let set = pending.get(lang);
  if (!set) {
    set = new Set();
    pending.set(lang, set);
  }
  set.add(text);
  if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_DELAY_MS);
}

/** Không có chữ cái nào (số, ký hiệu, emoji, IPA ngắn...) thì không cần dịch. */
function isTranslatable(text: string): boolean {
  return /[A-Za-z]{2,}/.test(text);
}

/**
 * Trả về bản dịch của `text` (tiếng Anh) sang `lang`.
 * Nếu chưa có trong cache: trả về tạm văn bản gốc và xếp hàng gọi API dịch.
 */
export function translateText(text: string | null | undefined, lang: LangCode): string {
  if (text == null) return '';
  const source = String(text);
  if (!needsTranslation(lang)) return source;

  const key = source.trim();
  if (!key || !isTranslatable(key)) return source;

  const cached = getCache(lang).get(key);
  if (cached !== undefined) return cached;

  void loadTranslationCache(lang);
  enqueue(lang, key);
  return source;
}

