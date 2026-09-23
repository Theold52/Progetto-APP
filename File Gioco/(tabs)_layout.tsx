import { Tabs } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "@/src/theme";
import { useI18n } from "@/src/i18n";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text
        style={{
          fontSize: 22,
          opacity: focused ? 1 : 0.55,
          color: focused ? colors.brandPrimary : colors.muted,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useI18n();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surfaceSecondary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarItemStyle: { alignSelf: "center" },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabHome"),
          tabBarIcon: ({ focused }) => <TabIcon label="⌂" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: t("tabTeams"),
          tabBarIcon: ({ focused }) => <TabIcon label="⚑" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: t("tabMatches"),
          tabBarIcon: ({ focused }) => <TabIcon label="⚽" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="rankings"
        options={{
          title: t("tabRankings"),
          tabBarIcon: ({ focused }) => <TabIcon label="≡" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabSettings"),
          tabBarIcon: ({ focused }) => <TabIcon label="⚙" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: "center", justifyContent: "center", height: 24 },
});
