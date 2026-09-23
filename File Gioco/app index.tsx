import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

const SEEN_KEY = "app.splashSeen.v1";

export default function Index() {
  const [seen, setSeen] = useState<boolean | null>(null);
  useEffect(() => {
    AsyncStorage.getItem(SEEN_KEY).then((v) => setSeen(v === "1"));
  }, []);
  if (seen === null) return <View style={{ flex: 1, backgroundColor: "#0F172A" }} />;
  return <Redirect href={seen ? "/(tabs)" : "/splash"} />;
}
