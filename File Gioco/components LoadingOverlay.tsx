import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useI18n } from "../i18n";
import { useLeague } from "../store";
import { generateNews } from "../utils/news";

// Loading overlay with progress bar + rotating fake news headlines.
// `visible`: controls open/close. `duration`: ms. `onDone`: callback.
export function LoadingOverlay({
  visible,
  duration = 2200,
  onDone,
  title,
}: {
  visible: boolean;
  duration?: number;
  onDone?: () => void;
  title?: string;
}) {
  const { t, lang } = useI18n();
  const { league } = useLeague();
  const progress = useRef(new Animated.Value(0)).current;
  const [newsIdx, setNewsIdx] = useState(0);
  const [news, setNews] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setNews(generateNews(league, lang));
      setNewsIdx(0);
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => onDone && onDone());
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => {
      setNewsIdx((i) => (i + 1) % Math.max(1, news.length));
    }, 900);
    return () => clearInterval(iv);
  }, [visible, news.length]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const pct = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 100] });

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.bg}>
        <LinearGradient
          colors={["#0F172A", "#0369A1", "#0F172A"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content} testID="loading-overlay">
          <View style={styles.emblem}>
            <Text style={{ fontSize: 40 }}>⚽</Text>
          </View>
          <Text style={styles.title}>{title || t("loading").toUpperCase()}</Text>
          <View style={{ height: 24 }} />
          <View style={styles.newsBox}>
            <Text style={styles.newsHeader}>📰 NEWS</Text>
            <Text style={styles.newsText} numberOfLines={3}>
              {news[newsIdx] || ""}
            </Text>
          </View>
          <View style={{ height: 30 }} />

          <View style={styles.barRow}>
            <Text style={styles.barLabel}>{t("loading").toUpperCase()}</Text>
            <AnimatedPct pct={pct} />
          </View>
          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, { width }]}>
              <LinearGradient
                colors={["#D4AF37", "#F59E0B", "#D4AF37"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function AnimatedPct({ pct }: { pct: Animated.AnimatedInterpolation<number> }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const id = pct.addListener(({ value }) => setDisplay(Math.round(value)));
    return () => pct.removeListener(id);
  }, [pct]);
  return <Text style={styles.pct}>{display}%</Text>;
}

const styles = StyleSheet.create({
  bg: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  content: { alignItems: "center", width: "100%" },
  emblem: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 3,
    marginTop: 20,
  },
  newsBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    borderLeftWidth: 3,
    borderLeftColor: "#D4AF37",
    minHeight: 90,
    justifyContent: "center",
  },
  newsHeader: {
    color: "#D4AF37",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 6,
  },
  newsText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  barRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 6,
  },
  barLabel: { color: "#94A3B8", fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  pct: { color: "#D4AF37", fontSize: 14, fontWeight: "900", fontVariant: ["tabular-nums"] },
  barTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 4, overflow: "hidden" },
});
