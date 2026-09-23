// Simulate a single match event schedule for 90 minutes.
// Returns full ordered event list (with minute) and final goals.
// `matchday` is used to filter out already-injured players (injuredUntil >= matchday).
export function simulateMatch(
  homeIn: Team,
  awayIn: Team,
  matchday: number = 1,
): {
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
} {
  // Filter out players injured for this matchday
  const filter = (t: Team): Team => ({
    ...t,
    players: t.players.filter((p) => !p.injuredUntil || p.injuredUntil < matchday),
  });
  const home = filter(homeIn);
  const away = filter(awayIn);
  const events: MatchEvent[] = [];