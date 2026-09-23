import type { League } from "../types";

// Fictional news generator - based on current league state.
// Returns 6-10 short Italian headlines to display in the loading ticker.
export function generateNews(league: League | null, lang: "it" | "en" = "it"): string[] {
  if (!league) return DEFAULT_NEWS[lang];
  const items: string[] = [];
  const teams = league.teams;
  if (teams.length === 0) return DEFAULT_NEWS[lang];

  const rows = computeStandings(league);
  const played = rows.reduce((s, r) => s + r.played, 0) > 0;
  const scorers = computeScorers(league);
  const totalGoals = league.matches.filter((m) => m.played).reduce((s, m) => s + m.homeGoals + m.awayGoals, 0);
  const totalMatches = league.matches.filter((m) => m.played).length;

  // 1. Leader / Sorpresa
  if (played) {
    const leader = rows[0];
    if (leader && leader.played > 0) {
      items.push(
        lang === "it"
          ? `📈 ${leader.teamName.toUpperCase()} in vetta: ${leader.points} punti dopo ${leader.played} giornate`
          : `📈 ${leader.teamName.toUpperCase()} on top: ${leader.points} pts after ${leader.played} matchdays`,
      );
    }
    const bottom = rows[rows.length - 1];
    if (bottom && bottom.played > 0) {
      items.push(
        lang === "it"
          ? `🔻 Crisi ${bottom.teamName}: solo ${bottom.points} punti, allarme retrocessione`
          : `🔻 Crisis at ${bottom.teamName}: only ${bottom.points} pts, relegation alarm`,
      );
    }
    // Sorpresa: squadra con forza bassa ma posizione alta
    for (const r of rows.slice(0, 3)) {
      const t = teams.find((tm) => tm.id === r.teamId);
      if (t && t.strength < 65) {
        items.push(
          lang === "it"
            ? `⚡ Sorpresa ${t.name}: forza ${t.strength} ma nel podio!`
            : `⚡ Surprise ${t.name}: rating ${t.strength} yet on the podium!`,
        );
        break;
      }
    }
  }

  // 2. Cannoniere
  if (scorers[0] && scorers[0].goals > 0) {
    items.push(
      lang === "it"
        ? `🎯 ${scorers[0].playerName} inarrestabile: ${scorers[0].goals} gol in campionato`
        : `🎯 ${scorers[0].playerName} unstoppable: ${scorers[0].goals} goals so far`,
    );
  }
  if (scorers[1] && scorers[1].goals > 0) {
    items.push(
      lang === "it"
        ? `⚽ ${scorers[1].playerName} insegue la Scarpa d'Oro (${scorers[1].goals})`
        : `⚽ ${scorers[1].playerName} chasing the Golden Boot (${scorers[1].goals})`,
    );
  }

  // 3. Statistiche generali
  if (totalMatches > 0) {
    const avg = (totalGoals / totalMatches).toFixed(1);
    items.push(
      lang === "it"
        ? `📊 Media gol per partita: ${avg} · ${totalGoals} reti totali`
        : `📊 Goals per game: ${avg} · ${totalGoals} total`,
    );
  }

  // 4. Team roster
  const strongest = [...teams].sort((a, b) => b.strength - a.strength)[0];
  if (strongest) {
    items.push(
      lang === "it"
        ? `👑 ${strongest.name} favorita alla vigilia: forza ${strongest.strength}`
        : `👑 ${strongest.name} pre-season favorites: rating ${strongest.strength}`,
    );
  }

  // 5. Rosso/Espulsioni
  const totalReds = league.matches
    .filter((m) => m.played)
    .reduce((s, m) => s + m.events.filter((e) => e.type === "red").length, 0);
  if (totalReds > 0) {
    items.push(
      lang === "it"
        ? `🟥 Stagione bollente: ${totalReds} espulsioni finora`
        : `🟥 Heated season: ${totalReds} red cards so far`,
    );
  }

  // 6. Season number
  if (league.season > 1) {
    items.push(
      lang === "it"
        ? `📅 Stagione ${league.season} · ${teams.length} club al via`
        : `📅 Season ${league.season} · ${teams.length} clubs on the grid`,
    );
  }

  // Fallbacks
  while (items.length < 6) {
    const pool = DEFAULT_NEWS[lang];
    items.push(pool[items.length % pool.length]);
  }
  return items.slice(0, 10);
}

function computeStandings(league: League) {
  const rows: Record<string, { teamId: string; teamName: string; played: number; points: number }> = {};
  for (const t of league.teams) rows[t.id] = { teamId: t.id, teamName: t.name, played: 0, points: 0 };
  for (const m of league.matches) {
    if (!m.played) continue;
    const h = rows[m.homeId];
    const a = rows[m.awayId];
    if (!h || !a) continue;
    h.played++;
    a.played++;
    if (m.homeGoals > m.awayGoals) h.points += 3;
    else if (m.homeGoals < m.awayGoals) a.points += 3;
    else {
      h.points += 1;
      a.points += 1;
    }
  }
  return Object.values(rows).sort((a, b) => b.points - a.points);
}

function computeScorers(league: League) {
  const map = new Map<string, { playerName: string; goals: number }>();
  for (const m of league.matches) {
    if (!m.played) continue;
    for (const e of m.events) {
      if (e.type !== "goal") continue;
      const cur = map.get(e.playerId);
      if (cur) cur.goals++;
      else map.set(e.playerId, { playerName: e.playerName, goals: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.goals - a.goals);
}

const DEFAULT_NEWS: Record<"it" | "en", string[]> = {
  it: [
    "⚽ Il campionato entra nel vivo: emozioni assicurate",
    "📢 Gli allenatori preparano le formazioni migliori",
    "🎫 Stadi sold-out per la prossima giornata",
    "🏆 La corsa al titolo è più accesa che mai",
    "📺 Diritti TV: nuovi record di ascolto",
    "🧤 I portieri protagonisti dell'ultima giornata",
    "🔥 Le grandi favorite non sbagliano il colpo",
    "⚔️ Derby infuocati in programma la prossima settimana",
    "🎯 I giovani talenti scalano le classifiche marcatori",
    "💥 VAR sotto pressione: sessantasette episodi controversi",
  ],
  en: [
    "⚽ The league heats up: thrilling action ahead",
    "📢 Coaches finalize starting XI",
    "🎫 Stadiums sold-out for next matchday",
    "🏆 Title race hotter than ever",
    "📺 TV rights hit record viewership",
    "🧤 Goalkeepers steal the show",
    "🔥 Favourites keep collecting points",
    "⚔️ Derbies coming up next week",
    "🎯 Young talents climb the scoring charts",
    "💥 VAR under fire: seven controversial calls",
  ],
};
