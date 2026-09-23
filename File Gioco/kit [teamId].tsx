import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KitPreview, ShirtIcon } from "@/src/components/Kit";
import { KIT_COLORS, generateRandomKit } from "@/src/data/pools";
import { useI18n } from "@/src/i18n";
import { useLeague } from "@/src/store";
import { colors, radius, spacing } from "@/src/theme";
import { Button } from "@/src/ui";
import type { Kit } from "@/src/types";

export default function KitEditor() {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useI18n();
  const { league, setTeamKit } = useLeague();

  const team = league?.teams.find((x) => x.id === teamId);
  const [kit, setKit] = useState<Kit>(
    team?.kit || {
      pattern: 0,
      primary: KIT_COLORS[0],
      secondary: KIT_COLORS[1],
      accent: KIT_COLORS[2],
    },
  );
  const [activeSlot, setActiveSlot] = useState<"primary" | "secondary" | "accent">("primary");

  if (!team) return null;

  const save = () => {
    setTeamKit(team.id, kit);
    router.back();
  };

  const pickColor = (c: string) => {
    setKit({ ...kit, [activeSlot]: c });
  };

  const randomize = () => setKit(generateRandomKit());

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} testID="kit-back-button">
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{t("editKit")}</Text>
        <Pressable onPress={randomize} testID="kit-randomize-button" style={styles.randBtn}>
          <Text style={{ color: colors.onBrandSecondary, fontWeight: "800", fontSize: 12 }}>
            🎲 {t("randomize")}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} testID="kit-scroll">
        {/* Preview */}
        <View style={styles.previewWrap}>
          <KitPreview kit={kit} size={140} />
          <Text style={styles.teamNamePreview}>{team.name}</Text>
        </View>

        {/* Color slots */}
        <View style={styles.slotsRow}>
          {(["primary", "secondary", "accent"] as const).map((slot) => (
            <Pressable
              key={slot}
              testID={`slot-${slot}`}
              onPress={() => setActiveSlot(slot)}
              style={[
                styles.slotCard,
                activeSlot === slot && { borderColor: colors.brandPrimary, borderWidth: 2 },
              ]}
            >
              <View style={[styles.slotSwatch, { backgroundColor: kit[slot] }]} />
              <Text style={styles.slotLabel}>
                {t(slot === "primary" ? "primaryColor" : slot === "secondary" ? "secondaryColor" : "accentColor")}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Color palette */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t(activeSlot === "primary" ? "primaryColor" : activeSlot === "secondary" ? "secondaryColor" : "accentColor")}
          </Text>
          <View style={styles.palette}>
            {KIT_COLORS.map((c) => (
              <Pressable
                key={c}
                testID={`color-${c.replace("#", "")}`}
                onPress={() => pickColor(c)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c },
                  kit[activeSlot] === c && styles.colorSwatchActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Pattern grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("pattern")} ({kit.pattern + 1}/30)
          </Text>
          <View style={styles.patternGrid}>
            {Array.from({ length: 30 }).map((_, i) => {
              const isSel = i === kit.pattern;
              return (
                <Pressable
                  key={i}
                  testID={`pattern-${i}`}
                  onPress={() => setKit({ ...kit, pattern: i })}
                  style={[
                    styles.patternCell,
                    isSel && { borderColor: colors.brandPrimary, borderWidth: 3 },
                  ]}
                >
                  <ShirtIcon kit={{ ...kit, pattern: i }} size={54} />
                  <View style={styles.patternNum}>
                    <Text style={styles.patternNumText}>{i + 1}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button testID="save-kit-button" label={t("save")} onPress={save} variant="primary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.md,
  },
  backBtn: { width: 32 },
  backText: { fontSize: 32, fontWeight: "800", color: colors.brandPrimary, lineHeight: 32 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: "800", color: colors.onSurface },
  randBtn: {
    backgroundColor: colors.brandSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  previewWrap: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    backgroundColor: colors.surfaceInverse,
  },
  teamNamePreview: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    marginTop: spacing.md,
    letterSpacing: 0.5,
  },
  slotsRow: {
    flexDirection: "row",
    padding: spacing.lg,
    gap: spacing.sm,
  },
  slotCard: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  slotSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  slotLabel: { fontSize: 10, fontWeight: "700", color: colors.onSurfaceSecondary, textAlign: "center" },
  section: { padding: spacing.lg, paddingTop: 0 },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: colors.onSurface, marginBottom: spacing.sm },
  palette: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  colorSwatch: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorSwatchActive: { borderWidth: 3, borderColor: colors.brandPrimary },
  patternGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  patternCell: {
    width: "22%",
    aspectRatio: 0.85,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingVertical: 6,
  },
  patternNum: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "rgba(15,23,42,0.7)",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  patternNumText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
