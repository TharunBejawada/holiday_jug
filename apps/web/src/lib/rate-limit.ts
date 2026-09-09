// Minimal in-memory fixed-window rate limiter for API routes.
// Good enough for a single Lambda/Amplify instance; swap for a shared store
// (e.g. DynamoDB or Redis/ElastiCache) once traffic is spread across many
// concurrent instances and a per-instance window is no longer accurate.

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 60;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_REQUESTS_PER_WINDOW;
}
