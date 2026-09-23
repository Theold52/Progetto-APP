const simulateMatchday = () => {
      if (!league) return null;
      const md = league.currentMatchday;
      const matchesToPlay = league.matches.filter((m) => m.matchday === md && !m.played);
      if (matchesToPlay.length === 0) return null;
      const teamById = new Map(league.teams.map((t) => [t.id, t]));
      const results = matchesToPlay.map((m) => {
        const home = teamById.get(m.homeId)!;
        const away = teamById.get(m.awayId)!;
        const r = simulateMatch(home, away, md);
        return { matchId: m.id, ...r };
      });
      const resMap = new Map(results.map((r) => [r.matchId, r]));
      // Apply injuries to players
      const injuryUpdates = new Map<string, number>(); // playerId -> injuredUntil
      for (const r of results) {
        for (const e of r.events) {
          if (e.type === "injury" && e.injuryWeeks) {
            injuryUpdates.set(e.playerId, md + e.injuryWeeks);
          }
        }
      }
      const newTeams = league.teams.map((t) => ({
        ...t,
        players: t.players.map((p) =>
          injuryUpdates.has(p.id) ? { ...p, injuredUntil: injuryUpdates.get(p.id) } : p,
        ),
      }));
      const newMatches = league.matches.map((m) => {
        const r = resMap.get(m.id);
        if (!r) return m;
        return { ...m, homeGoals: r.homeGoals, awayGoals: r.awayGoals, events: r.events, played: true };
      });
      setLeague({ ...league, teams: newTeams, matches: newMatches, currentMatchday: md + 1 });
      return newMatches.filter((m) => m.matchday === md);
    };

    const simulateRest = () => {
      if (!league) return;
      // Simulate matchday by matchday to preserve injury propagation.
      let teams = league.teams;
      let matches = league.matches;
      let md = league.currentMatchday;
      const total = totalMatchdays();
      while (md <= total) {
        const teamById = new Map(teams.map((t) => [t.id, t]));
        const matchesThisMd = matches.filter((m) => m.matchday === md && !m.played);
        const injuryUpdates = new Map<string, number>();
        const newMatchDataByMatchId = new Map<string, { homeGoals: number; awayGoals: number; events: any[] }>();
        for (const m of matchesThisMd) {
          const home = teamById.get(m.homeId);
          const away = teamById.get(m.awayId);
          if (!home || !away) continue;
          const r = simulateMatch(home, away, md);
          newMatchDataByMatchId.set(m.id, r);
          for (const e of r.events) {
            if (e.type === "injury" && e.injuryWeeks) {
              injuryUpdates.set(e.playerId, md + e.injuryWeeks);
            }
          }
        }
        teams = teams.map((t) => ({
          ...t,
          players: t.players.map((p) =>
            injuryUpdates.has(p.id) ? { ...p, injuredUntil: injuryUpdates.get(p.id) } : p,
          ),
        }));
        matches = matches.map((m) => {
          const r = newMatchDataByMatchId.get(m.id);
          return r
            ? { ...m, homeGoals: r.homeGoals, awayGoals: r.awayGoals, events: r.events, played: true }
            : m;
        });
        md++;
      }
      setLeague({ ...league, teams, matches, currentMatchday: total + 1 });
    };