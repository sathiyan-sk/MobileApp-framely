import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/colors";

// Common, reusable styles to keep screens lean and consistent.
export const global = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgPink,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textDark,
    letterSpacing: -0.3,
  },
  caption: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});