const PREFIX = 'vanta:';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch { return fallback; }
  },
  set<T>(key: string, value: T): void {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch { /* quota / privacy mode */ }
  },
  remove(key: string): void {
    try { localStorage.removeItem(PREFIX + key); } catch { /* noop */ }
  },
};

export const sessionStore = {
  get(key: string): string | null {
    try { return sessionStorage.getItem(PREFIX + key); }
    catch { return null; }
  },
  set(key: string, value: string): void {
    try { sessionStorage.setItem(PREFIX + key, value); }
    catch { /* noop */ }
  },
  remove(key: string): void {
    try { sessionStorage.removeItem(PREFIX + key); } catch { /* noop */ }
  },
};
