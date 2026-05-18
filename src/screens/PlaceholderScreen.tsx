import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/colors";

// Reusable placeholder for screens not yet implemented.
type Props = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function PlaceholderScreen({
  title,
  subtitle = "Coming soon",
  icon = "construct-outline",
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.center} testID={`placeholder-${title}`}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={36} color={Colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPink },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -0.5,
    fontFamily: "Georgia",
  },
  subtitle: {
    fontSize: 13.5,
    color: Colors.textMuted,
    marginTop: 6,
    textAlign: "center",
  },
});
