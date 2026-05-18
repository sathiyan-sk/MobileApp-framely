import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/src/constants/colors";

type Props = {
  title: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel,
  actionIcon,
  onAction,
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <TouchableOpacity
          style={styles.action}
          onPress={onAction}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
          {actionIcon}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textDark,
    letterSpacing: -0.3,
  },
  action: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { color: Colors.primary, fontWeight: "700", fontSize: 13 },
});
