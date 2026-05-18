import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/colors";

type Props = {
  date: string;
  title: string;
  subtitle: string;
  guests: number;
  count: number;
  image: string;
};

export default function EventCard({
  date,
  title,
  subtitle,
  guests,
  count,
  image,
}: Props) {
  return (
    <View style={styles.card} testID={`event-${title}`}>
      <View style={styles.thumbWrap}>
        <Image source={{ uri: image }} style={styles.thumb} />
        <View style={styles.countBadge}>
          <Ionicons name="images-outline" size={11} color="#FFFFFF" />
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>

      <Text style={styles.date}>{date}</Text>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {subtitle}
      </Text>

      <View style={styles.footer}>
        <View style={styles.guestsRow}>
          <Ionicons name="people-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.guestsText}>{guests} Guests</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
          <Ionicons
            name="ellipsis-horizontal"
            size={14}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  thumbWrap: { position: "relative" },
  thumb: {
    width: "100%",
    height: 100,
    borderRadius: 12,
  },
  countBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  countText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },
  date: {
    color: Colors.primary,
    fontSize: 10.5,
    fontWeight: "600",
    marginTop: 8,
  },
  title: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 11.5,
    marginTop: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  guestsRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  guestsText: { color: Colors.textMuted, fontSize: 11, fontWeight: "500" },
  moreBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
