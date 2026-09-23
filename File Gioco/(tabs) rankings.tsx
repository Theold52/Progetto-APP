import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useI18n } from "@/src/i18n";
import { useLeague } from "@/src/store";
import { colors, radius, spacing } from "@/src/theme";
import { Card, TeamBadge } from "@/src/ui";

type Tab = "standings" | "scorers" | "assists";

export default function RankingsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { league, getStandings, getScorers, getAssists, totalMatchdays } = useLeague();
  const [tab, setTab] = useState<Tab>("standings");
  const total = totalMatchdays();
  // undefined = tutte le giornate
  const [filterMd, setFilterMd] = useState<number | undefined>(undefined);

  const standings = useMemo(() => getStandings(filterMd), [league, filterMd]);
  const scorers = useMemo(() => getScorers(filterMd), [league, filterMd]);
  const assists = useMemo(() => getAssists(filterMd), [league, filterMd]);

  if (!league) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.emptyTitle}>{t("noLeague")}</Text>
      </View>
    );
  }

  const empty =
    (tab === "standings" && standings.every((r) => r.played === 0)) ||
    (tab === "scorers" && scorers.length === 0) ||
    (tab === "assists" && assists.length === 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>{t("tabRankings")}</Text>
      </View>

      {/* Segmented control */}
      <View style={styles.segmentWrap}>
        <View style={styles.segment}>
          {(["standings", "scorers", "assists"] as Tab[]).map((k) => (
            <Pressable
              key={k}
              testID={`segment-${k}`}
              onPress={() => setTab(k)}
              style={[
                styles.segmentItem,
                tab === k && { backgroundColor: colors.brandPrimary },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: tab === k ? colors.onBrandPrimary : colors.onSurfaceSecondary },
                ]}
              >
                {t(k === "standings" ? "standings" : k === "scorers" ? "topScorers" : "topAssists")}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Matchday filter chips */}
      {total > 0 && (
        <View style={styles.filterWrap}>
          <Text style={styles.filterLabel}>{t("upToMatchday")}:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingHorizontal: spacing.md }}
          >
            <Pressable
              testID="md-filter-all"
              onPress={() => setFilterMd(undefined)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filterMd === undefined ? colors.brandPrimary : colors.surfaceSecondary,
                  borderColor: filterMd === undefined ? colors.brandPrimary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: filterMd === undefined ? colors.onBrandPrimary : colors.onSurfaceSecondary },
                ]}
              >
                {t("allMatchdays")}
              </Text>
            </Pressable>
            {Array.from({ length: total }).map((_, i) => {
              const n = i + 1;
              const sel = filterMd === n;
              return (
                <Pressable
                  key={n}
                  testID={`md-filter-${n}`}
                  onPress={() => setFilterMd(n)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: sel ? colors.brandPrimary : colors.surfaceSecondary,
                      borderColor: sel ? colors.brandPrimary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: sel ? colors.onBrandPrimary : colors.onSurfaceSecondary },
                    ]}
                  >
                    {n}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
        testID="rankings-scroll"
      >
        {empty ? (
          <Card>
            <Text style={styles.emptySub}>{t("empty")}</Text>
          </Card>
        ) : tab === "standings" ? (
          <StandingsTable
            rows={standings}
            relegationSlots={league.relegationSlots}
          />
        ) : tab === "scorers" ? (
          <ScorerList rows={scorers.map((s) => ({ ...s, value: s.goals }))} title={t("goals")} icon="⚽" />
        ) : (
          <ScorerList rows={assists.map((a) => ({ ...a, value: a.assists, playerId: a.playerId }))} title={t("assists")} icon="🅰" />
        )}
      </ScrollView>
    </View>
  );
}

function StandingsTable({
  rows,
  relegationSlots,
}: {
  rows: ReturnType<ReturnType<typeof useLeague>["getStandings"]>;
  relegationSlots: number;
}) {
  const { t } = useI18n();
  const relegationStart = rows.length - relegationSlots;
  return (
    <View>
      <View style={[styles.tableHeader]}>
        <Text style={[styles.thPos]}>{t("pos")}</Text>
        <Text style={[styles.thName]}>{t("team")}</Text>
        <Text style={styles.thStat}>{t("played")}</Text>
        <Text style={styles.thStat}>{t("won")}</Text>
        <Text style={styles.thStat}>{t("drawn")}</Text>
        <Text style={styles.thStat}>{t("lost")}</Text>
        <Text style={styles.thStat}>{t("gd")}</Text>
        <Text style={styles.thStatPts}>{t("pts")}</Text>
      </View>
      {rows.map((r, i) => {
        const isRelegation = relegationSlots > 0 && i >= relegationStart;
        return (
          <View
            key={r.teamId}
            testID={`stand-row-${r.teamId}`}
            style={[
              styles.tableRow,
              isRelegation && { backgroundColor: "rgba(239,68,68,0.06)" },
            ]}
          >
            <View style={[styles.thPos, styles.posCell]}>
              <View
                style={[
                  styles.posBadge,
                  {
                    backgroundColor:
                      i === 0
                        ? colors.brandSecondary
                        : i < 3
                        ? colors.brandTertiary
                        : isRelegation
                        ? colors.error
                        : "transparent",
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      i === 0
                        ? colors.onBrandSecondary
                        : i < 3
                        ? colors.onBrandTertiary
                        : isRelegation
                        ? colors.onError
                        : colors.onSurface,
                    fontWeight: "800",
                    fontSize: 13,
                  }}
                >
                  {i + 1}
                </Text>
              </View>
            </View>
            <View style={[styles.thName, styles.nameCell]}>
              <TeamBadge name={r.teamName} size={24} />
              <Text style={styles.tName} numberOfLines={1}>{r.teamName}</Text>
            </View>
            <Text style={styles.tStat}>{r.played}</Text>
            <Text style={styles.tStat}>{r.won}</Text>
            <Text style={styles.tStat}>{r.drawn}</Text>
            <Text style={styles.tStat}>{r.lost}</Text>
            <Text style={styles.tStat}>{r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}</Text>
            <Text style={styles.tStatPts}>{r.points}</Text>
          </View>
        );
      })}
    </View>
  );
}

function ScorerList({
  rows,
  title,
  icon,
}: {
  rows: { playerId: string; playerName: string; teamName: string; value: number }[];
  title: string;
  icon: string;
}) {
  return (
    <View>
      {rows.map((r, i) => (
        <View key={r.playerId + i} testID={`scorer-row-${r.playerId}`} style={styles.scorerRow}>
          <Text style={styles.scorerPos}>{i + 1}</Text>
          <TeamBadge name={r.teamName} size={32} />
          <View style={{ flex: 1 }}>
            <Text style={styles.scorerName} numberOfLines={1}>{r.playerName}</Text>
            <Text style={styles.scorerTeam} numberOfLines={1}>{r.teamName}</Text>
          </View>
          <View style={styles.scorerStat}>
            <Text style={styles.scorerNum}>
              {icon} {r.value}
            </Text>
            <Text style={styles.scorerUnit}>{title}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl, backgroundColor: colors.surface },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: colors.onSurface },
  emptySub: { fontSize: 14, color: colors.muted, textAlign: "center", padding: spacing.md },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.surface },
  headerTitle: { fontSize: 28, fontWeight: "900", color: colors.onSurface, letterSpacing: -0.5 },
  segmentWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.md,
    padding: 4,
  },
  segmentItem: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: "center" },
  segmentText: { fontSize: 12, fontWeight: "700" },
  filterWrap: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.muted,
    paddingLeft: spacing.lg,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  filterChip: {
    height: 30,
    minWidth: 34,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  filterChipText: { fontSize: 12, fontWeight: "700", fontVariant: ["tabular-nums"] },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderStrong,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  thPos: { width: 30, textAlign: "center", fontSize: 11, color: colors.muted, fontWeight: "700" },
  thName: { flex: 1, fontSize: 11, color: colors.muted, fontWeight: "700" },
  thStat: { width: 26, textAlign: "center", fontSize: 11, color: colors.muted, fontWeight: "700" },
  thStatPts: { width: 34, textAlign: "center", fontSize: 11, color: colors.muted, fontWeight: "800" },
  posCell: { alignItems: "center" },
  posBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  nameCell: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  tName: { fontSize: 13, fontWeight: "700", color: colors.onSurface, flex: 1 },
  tStat: {
    width: 26,
    textAlign: "center",
    fontSize: 13,
    color: colors.onSurfaceSecondary,
    fontVariant: ["tabular-nums"],
  },
  tStatPts: {
    width: 34,
    textAlign: "center",
    fontSize: 14,
    color: colors.brandPrimary,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  scorerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  scorerPos: { width: 24, fontSize: 14, fontWeight: "800", color: colors.brandPrimary, textAlign: "center" },
  scorerName: { fontSize: 15, fontWeight: "700", color: colors.onSurface },
  scorerTeam: { fontSize: 12, color: colors.muted, marginTop: 2 },
  scorerStat: { alignItems: "flex-end" },
  scorerNum: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.brandPrimary,
    fontVariant: ["tabular-nums"],
  },
  scorerUnit: { fontSize: 10, color: colors.muted, fontWeight: "700", letterSpacing: 1 },
});
