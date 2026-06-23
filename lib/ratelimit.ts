import { RateLimiter } from "limiter";

const limiters = new Map<string, RateLimiter>();

export function getRateLimiter(id: string): RateLimiter {
  if (!limiters.has(id)) {
    limiters.set(id, new RateLimiter({ tokensPerInterval: 60, interval: "minute" }));
  }
  return limiters.get(id)!;
}