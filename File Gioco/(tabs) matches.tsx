import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LoadingOverlay } from "@/src/components/LoadingOverlay";
import { useI18n } from "@/src/i18n";
import { useLeague } from "@/src/store";
import { colors, radius, spacing } from "@/src/theme";
import { Button, Card } from "@/src/ui";