# CCG Championship Simulator - PRD

## Vision
Elegant Italian football simulator with **injuries, career player cards with stat graphs, season progression, transfer market, hall of fame, dynamic loading news, DIN typography, and full graphic personalization**. 100% offline (AsyncStorage).

## Feature Set (Cumulative)

### v1 Core
- League CRUD (12-20 teams), double round-robin. Match engine (weighted goal/assist/card selection; 75/20/5 card system + double-yellow red). Quick Sim, Simulate Rest, Live 90-second viewer with haptics. IT + EN.

### v2 Personalization
- Kit Creator (30 SVG patterns + 50-color palette + 3 slots), crest & photo upload, 🎲 Squadra Casuale.

### v3 Season Cycle
- Zona Vincitore (fixed) + Zona Retrocessione stepper 0-5.
- End-season trophies (Champion/Golden Boot/Assist King) + retrocesse.
- Prossima Stagione with permanent name bans.
- Match Preview, Filtro giornata sulla classifica, Storico Stagioni.

### v4 CCG Branding
- Barlow (DIN-like) via `expo-font`. Splash screen w/ Avvia CTA. Loading Overlay with news ticker. Calciomercato red+gold transition screen. Hall of Fame `app/hall-of-fame.tsx`.

### v5 Ageing System
- `Player.age` 18-40 badge on team detail.
- Retirement risk 34+ (15-100%). Auto rookies replace retirees. Stat evolution by performance + age curve.
- Biased random stat distribution (`biasedStat(2.2)` → 1 common, 30 rare).

### v6 Injuries + Player Cards
- **🚑 Infortuni**: 0.0007/min per team → ~6% chance per match. Duration weighted:
  - 55% breve (1-3 giornate)
  - 30% media (3-5 giornate)
  - 15% lunga (6-8 giornate)
- New event type `injury` with `injuryWeeks` field, rendered in match timeline with orange border and 🚑 icon.
- Injured players excluded from simulator's scorer/assister/fouler picks + shown in team detail with orange **🚑 INFORTUNATO** badge.
- Injuries reset automatically at end of season.
- **📇 Scheda Giocatore** (`app/player/[teamId]/[playerId].tsx`): full player card with:
  - Azure hero + circular avatar (gold border) + name + team + age + stage label (Debutto / In Crescita / Prime / Veterano).
  - 3 big stat cards (Forza Gol / Assist / Fallosità).
  - **Statistiche di Carriera** grid: seasons played, cumulative goals/assists, yellows, reds, injuries.
  - **📈 Evoluzione Stat**: multi-line chart (react-native-svg) rendering goalPower / assistPower / foulPower across all seasons.
  - **🎯 Rendimento**: multi-line chart with goals/assists per season.
  - **📅 Stagione per Stagione**: reverse-chronological cards with S-badge, age, stats & performance per season.
  - Inline **edit modal** (photo picker + name + age + 3 stat steppers) & delete action.
- Player history snapshots taken at end of each season during `progressPlayers` (before delta application, so charts show the actual stats used in that season).
- Team detail: tap player → Player Card; long-press → delete.

## Design
- Palette: azure `#0284C7` + gold `#D4AF37` + slate + red `#7F1D1D` for market ceremony + orange warning for injuries.
- Barlow typography, `react-native-svg` for kits & charts, `expo-linear-gradient` for hero panels.

## Architecture
Expo Router: `splash`, `(tabs)/*`, `team/[id]`, `kit/[teamId]`, `match/[id]`, `live.tsx`, `season-transition/[season]`, `hall-of-fame`, `player/[teamId]/[playerId]`. React Context stores persisted in AsyncStorage. Zero backend.
