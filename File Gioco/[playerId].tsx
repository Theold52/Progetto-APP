import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StatLineChart } from "@/src/components/Chart";
import { useI18n } from "@/src/i18n";
import { useLeague } from "@/src/store";
import { colors, radius, spacing } from "@/src/theme";
import { Button, Card, Stepper } from "@/src/ui";
import { pickImage } from "@/src/utils/imagePicker";

export default function PlayerCard() {
  const { teamId, playerId } = useLocalSearchParams<{ teamId: string; playerId: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useI18n();
  const { league, updatePlayer, deletePlayer } = useLeague();

  const team = league?.teams.find((x) => x.id === teamId);
  const player = team?.players.find((p) => p.id === playerId);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(player?.name || "");
  const [age, setAge] = useState(player?.age ?? 22);
  const [goal, setGoal] = useState(player?.goalPower ?? 15);
  const [assist, setAssist] = useState(player?.assistPower ?? 15);
  const [foul, setFoul] = useState(player?.foulPower ?? 10);
  const [photo, setPhoto] = useState<string | undefined>(player?.photoUri);

  // Current-season live stats (computed from played matches).
  const liveStats = useMemo(() => {
    if (!league || !player) return { goals: 0, assists: 0, yellows: 0, reds: 0, injuries: 0 };
    let g = 0, a = 0, y = 0, r = 0, i = 0;
    for (const m of league.matches) {
      if (!m.played) continue;
      for (const e of m.events) {
        if (e.playerId === player.id) {
          if (e.type === "goal") g++;
          else if (e.type === "yellow") y++;
          else if (e.type === "red") r++;
          else if (e.type === "injury") i++;
        }
        if (e.type === "goal" && e.assistPlayerId === player.id) a++;
      }
    }
    return { goals: g, assists: a, yellows: y, reds: r, injuries: i };
  }, [league, player]);

  const career = useMemo(() => {
    if (!player) return { goals: 0, assists: 0, yellows: 0, reds: 0, seasons: 0 };
    const h = player.history || [];
    return {
      goals: h.reduce((s, e) => s + e.goals, 0) + liveStats.goals,
      assists: h.reduce((s, e) => s + e.assists, 0) + liveStats.assists,
      yellows: h.reduce((s, e) => s + e.yellows, 0) + liveStats.yellows,
      reds: h.reduce((s, e) => s + e.reds, 0) + liveStats.reds,
      seasons: h.length + (league?.matches.some((m) => m.played) ? 1 : 0),
    };
  }, [player, liveStats, league?.matches]);

  if (!team || !player) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface, paddingTop: insets.top }}>
        <View style={styles.center}>
          <Text>Not found</Text>
        </View>
      </View>
    );
  }

  const history = player.history || [];
  const withCurrent = [
    ...history.map((h) => ({
      season: h.season,
      goalPower: h.goalPower,
      assistPower: h.assistPower,
      foulPower: h.foulPower,
      age: h.age,
      goals: h.goals,
      assists: h.assists,
    })),
    {
      season: league!.season,
      goalPower: player.goalPower,
      assistPower: player.assistPower,
      foulPower: player.foulPower,
      age: player.age,
      goals: liveStats.goals,
      assists: liveStats.assists,
    },
  ];

  const labels = withCurrent.map((e) => `S${e.season}`);
  const seriesStats = [
    { color: colors.brandPrimary, label: "⚽ Gol", values: withCurrent.map((e) => e.goalPower) },
    { color: colors.brandSecondary, label: "🅰 Assist", values: withCurrent.map((e) => e.assistPower) },
    { color: colors.error, label: "🟥 Fallo", values: withCurrent.map((e) => e.foulPower) },
  ];
  const seriesPerf = [
    { color: colors.brandPrimary, label: "⚽ Gol/stagione", values: withCurrent.map((e) => e.goals) },
    { color: colors.brandSecondary, label: "🅰 Assist/stagione", values: withCurrent.map((e) => e.assists) },
  ];

  const injured = player.injuredUntil && player.injuredUntil >= league!.currentMatchday;

  const stageLabel =
    player.age <= 21
      ? t("debut")
      : player.age <= 25
      ? t("growing")
      : player.age <= 29
      ? t("prime")
      : player.age <= 33
      ? t("veteran").slice(0, 1).toUpperCase() + t("veteran").slice(1)
      : "⚠ " + t("veteran");

  const openEdit = () => {
    setName(player.name);
    setAge(player.age ?? 22);
    setGoal(player.goalPower);
    setAssist(player.assistPower);
    setFoul(player.foulPower);
    setPhoto(player.photoUri);
    setEditing(true);
  };

  const save = () => {
    if (!name.trim()) return;
    updatePlayer(team.id, player.id, {
      name,
      age,
      goalPower: goal,
      assistPower: assist,
      foulPower: foul,
      photoUri: photo,
    });
    setEditing(false);
  };

  const handlePickPhoto = async () => {
    const uri = await pickImage();
    if (uri) setPhoto(uri);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Hero */}
      <View style={{ height: 240 + insets.top, position: "relative" }}>
        <LinearGradient
          colors={["#0F172A", "#0284C7"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.heroContent, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.heroTop}>
            <Pressable onPress={() => router.back()} testID="player-back-button">
              <Text style={styles.backText}>‹</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{t("playerCard")}</Text>
            <Pressable onPress={openEdit} testID="player-edit-button">
              <Text style={styles.editText}>✎</Text>
            </Pressable>
          </View>
          <View style={styles.heroBody}>
            {player.photoUri ? (
              <ExpoImage source={{ uri: player.photoUri }} style={styles.avatarBig} contentFit="cover" />
            ) : (
              <View style={[styles.avatarBig, styles.avatarPh]}>
                <Text style={{ color: colors.brandPrimary, fontWeight: "900", fontSize: 32 }}>
                  {player.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.playerName} numberOfLines={2}>
              {player.name}
            </Text>
            <Text style={styles.playerMeta}>
              {team.name} · {player.age} {t("ageYears")} · {stageLabel}
            </Text>
            {injured ? (
              <View style={styles.injuredPill}>
                <Text style={styles.injuredPillText}>
                  🚑 {t("injured")} · {t("availableAt")} {(player.injuredUntil || 0) + 1}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
        testID="player-card-scroll"
      >
        {/* Current stats */}
        <View style={styles.statRow}>
          <StatBig icon="⚽" val={player.goalPower} label={t("goalPower")} color={colors.brandPrimary} />
          <StatBig icon="🅰" val={player.assistPower} label={t("assistPower")} color={colors.brandSecondary} />
          <StatBig icon="🟥" val={player.foulPower} label={t("foulPower")} color={colors.error} />
        </View>

        <View style={{ height: spacing.lg }} />
        <Text style={styles.sectionTitle}>📊 {t("careerStats")}</Text>
        <View style={{ height: spacing.sm }} />
        <Card>
          <View style={styles.careerGrid}>
            <Career val={career.seasons} label={t("seasonsPlayed")} />
            <Career val={career.goals} label={t("goals")} color={colors.brandPrimary} />
            <Career val={career.assists} label={t("assists")} color={colors.brandSecondary} />
            <Career val={career.yellows} label="🟨" />
            <Career val={career.reds} label="🟥" color={colors.error} />
            <Career val={liveStats.injuries} label="🚑" color={colors.warning} />
          </View>
        </Card>

        <View style={{ height: spacing.xl }} />
        <Text style={styles.sectionTitle}>📈 {t("statEvolution")}</Text>
        <View style={{ height: spacing.sm }} />
        <Card>
          {withCurrent.length <= 1 ? (
            <Text style={styles.emptyMsg}>
              📅 Il grafico apparirà dopo la prima stagione completata
            </Text>
          ) : (
            <StatLineChart labels={labels} series={seriesStats} height={200} />
          )}
        </Card>

        <View style={{ height: spacing.lg }} />
        <Text style={styles.sectionTitle}>🎯 {t("performance")}</Text>
        <View style={{ height: spacing.sm }} />
        <Card>
          {withCurrent.length <= 1 ? (
            <Text style={styles.emptyMsg}>
              📅 Le prestazioni stagionali appariranno qui a fine anno
            </Text>
          ) : (
            <StatLineChart
              labels={labels}
              series={seriesPerf}
              height={180}
              yMax={Math.max(15, ...withCurrent.flatMap((e) => [e.goals, e.assists]))}
            />
          )}
        </Card>

        {history.length > 0 && (
          <>
            <View style={{ height: spacing.xl }} />
            <Text style={styles.sectionTitle}>📅 {t("seasonBySeason")}</Text>
            <View style={{ height: spacing.sm }} />
            {history
              .slice()
              .reverse()
              .map((h) => (
                <View key={h.season} style={styles.historyRow}>
                  <View style={styles.historyBadge}>
                    <Text style={styles.historyBadgeText}>S{h.season}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyMeta}>
                      {h.age} {t("ageYears")} · ⚽ {h.goalPower} · 🅰 {h.assistPower} · 🟥 {h.foulPower}
                    </Text>
                    <Text style={styles.historyPerf}>
                      {h.goals} {t("goals").toLowerCase()} · {h.assists} {t("assists").toLowerCase()}
                      {h.yellows > 0 && ` · 🟨 ${h.yellows}`}
                      {h.reds > 0 && ` · 🟥 ${h.reds}`}
                    </Text>
                  </View>
                </View>
              ))}
          </>
        )}

        <View style={{ height: spacing.lg }} />
        <Button
          label={t("delete")}
          onPress={() => {
            deletePlayer(team.id, player.id);
            router.back();
          }}
          variant="danger"
          testID="player-delete-button"
        />
      </ScrollView>

      {/* Edit modal */}
      <Modal transparent visible={editing} animationType="slide" onRequestClose={() => setEditing(false)}>
        <KeyboardAvoidingView
          style={styles.modalBg}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={{ maxHeight: "92%" }}
            contentContainerStyle={styles.modalCard}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.modalTitle}>{t("edit")}</Text>
            <View style={{ height: spacing.md }} />
            <View style={{ alignItems: "center" }}>
              <Pressable onPress={handlePickPhoto} testID="edit-photo-button">
                {photo ? (
                  <ExpoImage source={{ uri: photo }} style={styles.avatarEdit} contentFit="cover" />
                ) : (
                  <View style={[styles.avatarEdit, styles.avatarPh]}>
                    <Text style={{ color: colors.brandPrimary, fontWeight: "800", fontSize: 20 }}>+</Text>
                  </View>
                )}
              </Pressable>
            </View>
            <View style={{ height: spacing.md }} />
            <Text style={styles.modalLabel}>{t("playerName")}</Text>
            <TextInput
              testID="edit-name-input"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor={colors.muted}
            />
            <View style={{ height: spacing.md }} />
            <Text style={styles.modalLabel}>{t("age")} (18-40)</Text>
            <Stepper value={age} onChange={setAge} min={18} max={40} />
            <View style={{ height: spacing.md }} />
            <Text style={styles.modalLabel}>⚽ {t("goalPower")}</Text>
            <Stepper value={goal} onChange={setGoal} min={1} max={30} color={colors.brandPrimary} />
            <View style={{ height: spacing.md }} />
            <Text style={styles.modalLabel}>🅰 {t("assistPower")}</Text>
            <Stepper value={assist} onChange={setAssist} min={1} max={30} color={colors.brandSecondary} />
            <View style={{ height: spacing.md }} />
            <Text style={styles.modalLabel}>🟥 {t("foulPower")}</Text>
            <Stepper value={foul} onChange={setFoul} min={1} max={30} color={colors.error} />
            <View style={{ height: spacing.lg }} />
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <Button label={t("cancel")} onPress={() => setEditing(false)} variant="secondary" />
              </View>
              <View style={{ flex: 1 }}>
                <Button testID="edit-save-button" label={t("save")} onPress={save} variant="primary" />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function StatBig({ icon, val, label, color }: { icon: string; val: number; label: string; color: string }) {
  return (
    <View style={styles.statBigWrap}>
      <Text style={styles.statBigIcon}>{icon}</Text>
      <Text style={[styles.statBigVal, { color }]}>{val}</Text>
      <Text style={styles.statBigLbl} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function Career({ val, label, color = colors.onSurface }: { val: number; label: string; color?: string }) {
  return (
    <View style={styles.careerCell}>
      <Text style={[styles.careerVal, { color }]}>{val}</Text>
      <Text style={styles.careerLbl} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroContent: { flex: 1 },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backText: { fontSize: 32, color: "#fff", fontWeight: "900", lineHeight: 32 },
  editText: { fontSize: 22, color: colors.brandSecondary, fontWeight: "900" },
  headerTitle: { color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 1 },
  heroBody: { alignItems: "center", padding: spacing.md },
  avatarBig: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.brandSecondary,
  },
  avatarPh: {
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  playerName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: spacing.sm,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  playerMeta: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  injuredPill: {
    marginTop: 8,
    backgroundColor: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  injuredPillText: {
    color: colors.onWarning,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  statRow: { flexDirection: "row", gap: spacing.sm },
  statBigWrap: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statBigIcon: { fontSize: 24 },
  statBigVal: {
    fontSize: 30,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },
  statBigLbl: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: "900", color: colors.onSurface, letterSpacing: 0.5 },
  careerGrid: { flexDirection: "row", flexWrap: "wrap" },
  careerCell: {
    width: "33.33%",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  careerVal: { fontSize: 24, fontWeight: "900", fontVariant: ["tabular-nums"] },
  careerLbl: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 2,
    textTransform: "uppercase",
  },
  emptyMsg: { textAlign: "center", color: colors.muted, fontSize: 13, padding: spacing.md },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  historyBadgeText: { color: "#fff", fontWeight: "900", fontSize: 13 },
  historyMeta: { fontSize: 12, color: colors.onSurface, fontWeight: "700" },
  historyPerf: { fontSize: 13, color: colors.brandPrimary, fontWeight: "800", marginTop: 3 },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.55)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: colors.surfaceSecondary,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modalTitle: { fontSize: 20, fontWeight: "900", color: colors.onSurface },
  modalLabel: { fontSize: 13, fontWeight: "700", color: colors.onSurfaceSecondary, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.onSurface,
    backgroundColor: colors.surface,
  },
  avatarEdit: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
