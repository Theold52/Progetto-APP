import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/src/components/error-boundary";
import { queryClient } from "@/src/query-client";
import { I18nProvider } from "@/src/i18n";
import { LeagueProvider } from "@/src/store";
import { applyGlobalFont, useAppFonts } from "@/src/utils/fonts";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  const loaded = useAppFonts();

  useEffect(() => {
    if (loaded) applyGlobalFont();
  }, [loaded]);

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: "#0F172A" }} />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
              <I18nProvider>
                <LeagueProvider>
                  <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />
                </LeagueProvider>
              </I18nProvider>
            </KeyboardProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
