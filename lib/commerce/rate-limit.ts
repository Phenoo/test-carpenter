type Entry = { count: number; resetAt: number };

declare global {
  var __demutzRateLimits: Map<string, Entry> | undefined;
}

const entries = globalThis.__demutzRateLimits ?? new Map<string, Entry>();
globalThis.__demutzRateLimits = entries;

export function checkRateLimit(key: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const current = entries.get(key);

  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
