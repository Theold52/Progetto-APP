import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SEEN_KEY = "app.splashSeen.v1";

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Optionally auto-skip after first launch. Comment out to always show.
    setReady(true);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.9] });

  const handleStart = async () => {
    await AsyncStorage.setItem(SEEN_KEY, "1");
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <LinearGradient
        colors={["#0F172A", "#0369A1", "#0F172A"]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: 24,
        }}
      >
        <Animated.View
          style={{
            opacity: fade,
            transform: [{ scale }],
            alignItems: "center",
          }}
        >
          {/* Emblem */}
          <Animated.View style={[styles.emblem, { shadowOpacity: glowOpacity }]}>
            <Text style={styles.emblemText}>⚽</Text>
          </Animated.View>

          <View style={{ height: 24 }} />

          <Text style={styles.subLine}>═══ CCG ═══</Text>
          <View style={{ height: 12 }} />
          <Text style={styles.title} testID="splash-title">
            CCG{"\n"}CHAMPIONSHIP{"\n"}SIMULATOR
          </Text>
          <View style={{ height: 8 }} />
          <View style={styles.divider} />
          <View style={{ height: 12 }} />
          <Text style={styles.sub}>SIMULATORE UFFICIALE · CCG</Text>
        </Animated.View>

        <View style={{ position: "absolute", bottom: insets.bottom + 40, left: 24, right: 24 }}>
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [styles.cta, { opacity: pressed ? 0.85 : 1 }]}
            testID="splash-start-button"
          >
            <Text style={styles.ctaText}>▶ AVVIA</Text>
          </Pressable>
          <Text style={styles.tagline}>Il calcio all'italiana come lo hai sempre sognato</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emblem: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4AF37",
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  emblemText: { fontSize: 48 },
  subLine: { color: "#D4AF37", fontSize: 12, fontWeight: "700", letterSpacing: 4 },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    lineHeight: 40,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#D4AF37",
    borderRadius: 2,
  },
  sub: {
    color: "#94A3B8",
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: "700",
  },
  cta: {
    height: 60,
    backgroundColor: "#D4AF37",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  ctaText: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 4,
  },
  tagline: {
    color: "#94A3B8",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
});
