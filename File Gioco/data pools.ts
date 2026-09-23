export function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Biased random stat 1-30 with 1 being the most likely and 30 the least.
// Uses power distribution: `1 + 29 * Math.pow(random, exponent)`.
// Higher exponent → more values near 1.
export function biasedStat(exponent = 2.2): number {
  const r = Math.random();
  return Math.max(1, Math.min(30, 1 + Math.round(29 * Math.pow(r, exponent))));
}

// Age distribution biased toward 22-28 range (peak career).
// Young rookies (18-21) ~15%, prime (22-28) ~55%, veterans (29-33) ~25%, elders (34-38) ~5%.
export function biasedAge(): number {
  const r = Math.random();
  if (r < 0.15) return randomInt(18, 21);
  if (r < 0.7) return randomInt(22, 28);
  if (r < 0.95) return randomInt(29, 33);
  return randomInt(34, 38);
}

export function generateRandomPlayerName() {
  return `${randomPick(FIRST_NAMES)} ${randomPick(LAST_NAMES)}`;
}