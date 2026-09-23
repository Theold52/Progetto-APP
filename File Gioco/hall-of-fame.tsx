import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useI18n } from "@/src/i18n";
import { useLeague } from "@/src/store";
import { colors, radius, spacing } from "@/src/theme";
import { Card, TeamBadge } from "@/src/ui";

export default function HallOfFame() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useI18n();
  const { league } = useLeague();

  const stats = useMemo(() => {
    if (!league) return null;
    const champions = new Map<string, number>();
    const scorers = new Map<string, { name: string; teamName: string; goals: number; seasons: number }>();
    const assists = new Map<string, { name: string; teamName: string; assists: number; seasons: number }>();
    for (const h of league.history) {
      if (h.championName) champions.set(h.championName, (champions.get(h.championName) || 0) + 1);
      if (h.topScorer) {
        const k = h.topScorer.name;
        const cur = scorers.get(k);
        if (cur) {
          cur.goals += h.topScorer.goals;
          cur.seasons += 1;
        } else {
          scorers.set(k, {
            name: h.topScorer.name,
            teamName: h.topScorer.teamName,
            goals: h.topScorer.goals,
            seasons: 1,
          });
        }
      }
      if (h.topAssist) {
        const k = h.topAssist.name;
        const cur = assists.get(k);
        if (cur) {
          cur.assists += h.topAssist.assists;
          cur.seasons += 1;
        } else {
          assists.set(k, {
            name: h.topAssist.name,
            teamName: h.topAssist.teamName,
            assists: h.topAssist.assists,
            seasons: 1,
          });
        }
      }
    }
    return {
      champions: Array.from(champions.entries())
        .map(([teamName, titles]) => ({ teamName, titles }))
        .sort((a, b) => b.titles - a.titles),
      scorers: Array.from(scorers.values()).sort((a, b) => b.goals - a.goals),
      assists: Array.from(assists.values()).sort((a, b) => b.assists - a.assists),
      totalSeasons: league.history.length,
    };
  }, [league?.history]);

  if (!league || !stats) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <View style={{ paddingTop: insets.top + spacing.md, padding: spacing.lg }}>
          <Text style={styles.emptyTitle}>{t("hallOfFame")}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Hero */}
      <View style={{ height: 180 + insets.top, position: "relative" }}>
        <LinearGradient
          colors={["#0F172A", "#0369A1"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.heroContent, { paddingTop: insets.top + spacing.md }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} testID="hof-back-button">
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>═══ CCG · ETERNI ═══</Text>
            <Text style={styles.title}>🏛️ {t("hallOfFame").toUpperCase()}</Text>
            <Text style={styles.sub}>
              {stats.totalSeasons} {t("seasonsPlayed").toLowerCase()}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
        testID="hof-scroll"
      >
        {stats.totalSeasons === 0 ? (
          <Card>
            <Text style={styles.emptyText}>{t("empty")}</Text>
          </Card>
        ) : (
          <>
            {/* Champions */}
            <Text style={styles.sectionTitle}>🏆 {t("allTimeChampions")}</Text>
            <View style={{ height: spacing.sm }} />
            {stats.champions.map((c, i) => (
              <View key={c.teamName + i} style={[styles.row, i === 0 && styles.rowGold]}>
                <View style={[styles.rowRank, i === 0 && { backgroundColor: colors.brandSecondary }]}>
                  <Text style={[styles.rowRankText, i === 0 && { color: colors.onBrandSecondary }]}>
                    {i + 1}
                  </Text>
                </View>
                <TeamBadge name={c.teamName} size={30} />
                <Text style={styles.rowName} numberOfLines={1}>{c.teamName}</Text>
                <View style={styles.trophyStat}>
                  <Text style={styles.trophyStatVal}>{c.titles}</Text>
                  <Text style={styles.trophyStatLbl}>
                    {c.titles === 1 ? t("titles").slice(0, -1) : t("titles")}
                  </Text>
                </View>
              </View>
            ))}

            <View style={{ height: spacing.xl }} />
            <Text style={styles.sectionTitle}>👟 {t("allTimeScorers")}</Text>
            <View style={{ height: spacing.sm }} />
            {stats.scorers.map((s, i) => (
              <View key={s.name + i} style={[styles.row, i === 0 && styles.rowGold]}>
                <View style={[styles.rowRank, i === 0 && { backgroundColor: colors.brandSecondary }]}>
                  <Text style={[styles.rowRankText, i === 0 && { color: colors.onBrandSecondary }]}>
                    {i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowName} numberOfLines={1}>{s.name}</Text>
                  <Text style={styles.rowSub} numberOfLines={1}>
                    {s.teamName} · {s.seasons} {s.seasons === 1 ? "stagione" : "stagioni"}
                  </Text>
                </View>
                <View style={styles.trophyStat}>
                  <Text style={styles.trophyStatVal}>{s.goals}</Text>
                  <Text style={styles.trophyStatLbl}>{t("goals").toLowerCase()}</Text>
                </View>
              </View>
            ))}

            <View style={{ height: spacing.xl }} />
            <Text style={styles.sectionTitle}>🎩 {t("allTimeAssists")}</Text>
            <View style={{ height: spacing.sm }} />
            {stats.assists.map((a, i) => (
              <View key={a.name + i} style={[styles.row, i === 0 && styles.rowGold]}>
                <View style={[styles.rowRank, i === 0 && { backgroundColor: colors.brandSecondary }]}>
                  <Text style={[styles.rowRankText, i === 0 && { color: colors.onBrandSecondary }]}>
                    {i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowName} numberOfLines={1}>{a.name}</Text>
                  <Text style={styles.rowSub} numberOfLines={1}>
                    {a.teamName} · {a.seasons} {a.seasons === 1 ? "stagione" : "stagioni"}
                  </Text>
                </View>
                <View style={styles.trophyStat}>
                  <Text style={styles.trophyStatVal}>{a.assists}</Text>
                  <Text style={styles.trophyStatLbl}>{t("assists").toLowerCase()}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    height: "100%",
    paddingBottom: spacing.md,
  },
  backBtn: { paddingTop: 8 },
  backText: { fontSize: 32, fontWeight: "900", color: colors.brandSecondary, lineHeight: 32 },
  eyebrow: { color: colors.brandSecondary, fontSize: 10, fontWeight: "900", letterSpacing: 3, marginTop: 20 },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 6,
  },
  sub: { color: "#94A3B8", fontSize: 12, fontWeight: "700", letterSpacing: 1, marginTop: 4 },
  emptyTitle: { fontSize: 22, fontWeight: "900", color: colors.onSurface },
  emptyText: { color: colors.muted, textAlign: "center" },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.onSurface,
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowGold: {
    borderColor: colors.brandSecondary,
    backgroundColor: "rgba(212,175,55,0.06)",
  },
  rowRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  rowRankText: { color: colors.onBrandTertiary, fontWeight: "900", fontSize: 13 },
  rowName: { flex: 1, fontSize: 15, fontWeight: "800", color: colors.onSurface },
  rowSub: { fontSize: 11, color: colors.muted, marginTop: 2, fontWeight: "600" },
  trophyStat: { alignItems: "flex-end", minWidth: 60 },
  trophyStatVal: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.brandPrimary,
    fontVariant: ["tabular-nums"],
  },
  trophyStatLbl: {
    fontSize: 9,
    color: colors.muted,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
