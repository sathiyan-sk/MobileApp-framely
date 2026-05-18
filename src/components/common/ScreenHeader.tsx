import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/colors";

type Props = {
  title: string;
  onBack: () => void;
  rightElement?: React.ReactNode;
};

export default function ScreenHeader({ title, onBack, rightElement }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack}
        activeOpacity={0.7}
        testID="screen-header-back"
      >
        <Ionicons name="chevron-back" size={22} color={Colors.primary} />
      </TouchableOpacity>
      {title ? <Text style={styles.title}>{title}</Text> : <View style={{ flex: 1 }} />}
      <View style={styles.right}>{rightElement ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryFaint,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -0.4,
    fontFamily: "Georgia",
  },
  right: { width: 38, alignItems: "flex-end" },
});