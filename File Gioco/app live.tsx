    const prepared: LiveMatch[] = matchesToPlay.map((m) => {
      const home = teamById.get(m.homeId)!;
      const away = teamById.get(m.awayId)!;
      const { events } = simulateMatch(home, away, md);
      return { ...m, fullEvents: events, visibleEvents: [], homeGoals: 0, awayGoals: 0 };
    });