import type { League, Player, Retirement, Rookie, Team } from "../types";
import { biasedAge, biasedStat, generateRandomPlayerName } from "../data/pools";

// Retirement probability by age (34+ starts risk; 40 = certain).
const RETIRE_PROB: Record<number, number> = {
  34: 0.15,
  35: 0.25,
  36: 0.4,
  37: 0.55,
  38: 0.7,
  39: 0.85,
  40: 1,
};

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, Math.round(v)));
}

function makeId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Given the surviving teams and season match data, return:
// - updated teams (with ageing, growth/decline, retirements replaced by rookies)
// - retirement list, rookie list (for cerimony)
export function progressPlayers(
  teams: Team[],
  matches: League["matches"],
  currentSeason: number,
): { teams: Team[]; retirements: Retirement[]; rookies: Rookie[] } {
  // Aggregate season performance per player
  const goalsMap = new Map<string, number>();
  const assistsMap = new Map<string, number>();
  const yellowsMap = new Map<string, number>();
  const redsMap = new Map<string, number>();
  for (const m of matches) {
    if (!m.played) continue;
    for (const e of m.events) {
      if (e.type === "goal") {
        goalsMap.set(e.playerId, (goalsMap.get(e.playerId) || 0) + 1);
        if (e.assistPlayerId)
          assistsMap.set(e.assistPlayerId, (assistsMap.get(e.assistPlayerId) || 0) + 1);
      } else if (e.type === "yellow") {
        yellowsMap.set(e.playerId, (yellowsMap.get(e.playerId) || 0) + 1);
      } else if (e.type === "red") {
        redsMap.set(e.playerId, (redsMap.get(e.playerId) || 0) + 1);
      }
    }
  }

  const retirements: Retirement[] = [];
  const rookies: Rookie[] = [];

  const nextTeams: Team[] = teams.map((team) => {
    const nextPlayers: Player[] = [];
    for (const p of team.players) {
      const nextAge = (p.age ?? 25) + 1;
      const seasonGoals = goalsMap.get(p.id) || 0;
      const seasonAssists = assistsMap.get(p.id) || 0;
      const seasonYellows = yellowsMap.get(p.id) || 0;
      const seasonReds = redsMap.get(p.id) || 0;

      // Snapshot this season BEFORE progression deltas.
      const snapshot = {
        season: currentSeason,
        age: p.age ?? 25,
        goalPower: p.goalPower,
        assistPower: p.assistPower,
        foulPower: p.foulPower,
        goals: seasonGoals,
        assists: seasonAssists,
        yellows: seasonYellows,
        reds: seasonReds,
      };

      // Retirement check
      const retireProb = nextAge >= 40 ? 1 : RETIRE_PROB[nextAge] ?? 0;
      if (retireProb > 0 && Math.random() < retireProb) {
        retirements.push({ playerName: p.name, age: nextAge, teamName: team.name });
        continue;
      }

      // Stat evolution
      let dGoal = 0;
      let dAssist = 0;
      let dFoul = 0;
      const cardsCount = seasonYellows + 2 * seasonReds;

      if (nextAge <= 25) {
        dGoal = 1 + Math.min(3, Math.floor(seasonGoals / 4));
        dAssist = 1 + Math.min(3, Math.floor(seasonAssists / 4));
        if (Math.random() < 0.2) dFoul += 1;
      } else if (nextAge <= 29) {
        dGoal = seasonGoals >= 6 ? 1 : seasonGoals >= 3 ? 0 : -1;
        dAssist = seasonAssists >= 6 ? 1 : seasonAssists >= 3 ? 0 : -1;
        if (cardsCount >= 6) dFoul += 1;
      } else if (nextAge <= 33) {
        dGoal = seasonGoals >= 10 ? 0 : -1;
        dAssist = seasonAssists >= 10 ? 0 : -1;
        if (cardsCount >= 6) dFoul += 1;
      } else {
        dGoal = -2;
        dAssist = -1;
        if (Math.random() < 0.3) dFoul += 1;
      }

      nextPlayers.push({
        ...p,
        age: nextAge,
        goalPower: clamp(p.goalPower + dGoal, 1, 30),
        assistPower: clamp(p.assistPower + dAssist, 1, 30),
        foulPower: clamp(p.foulPower + dFoul, 1, 30),
        injuredUntil: undefined, // reset injuries at season end
        history: [...(p.history || []), snapshot],
      });
    }

    // Add rookies to fill retired slots (up to 20 cap)
    const retiredCount = team.players.length - nextPlayers.length;
    for (let i = 0; i < retiredCount && nextPlayers.length < 20; i++) {
      const name = generateRandomPlayerName();
      nextPlayers.push({
        id: makeId("p"),
        name,
        age: 17 + Math.floor(Math.random() * 4),
        goalPower: biasedStat(2.5),
        assistPower: biasedStat(2.5),
        foulPower: biasedStat(2.4),
      });
      rookies.push({ playerName: name, teamName: team.name });
    }

    return { ...team, players: nextPlayers };
  });

  return { teams: nextTeams, retirements, rookies };
}

export { biasedAge };