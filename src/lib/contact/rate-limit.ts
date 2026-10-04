export interface RateLimiter {
  /** `true` = envio permitido (e contado); `false` = limite atingido na janela. */
  hit(key: string): boolean;
}

export function createRateLimiter(opts: { limit: number; windowMs: number; now?: () => number }): RateLimiter {
  const { limit, windowMs, now = Date.now } = opts;
  const hits = new Map<string, number[]>();

  return {
    hit(key) {
      const t = now();
      // Janela deslizante: descarta envios expirados e chaves que ficaram vazias.
      for (const [k, times] of hits) {
        const alive = times.filter((time) => t - time < windowMs);
        if (alive.length) hits.set(k, alive);
        else hits.delete(k);
      }
      const times = hits.get(key) ?? [];
      if (times.length >= limit) return false;
      times.push(t);
      hits.set(key, times);
      return true;
    },
  };
}
