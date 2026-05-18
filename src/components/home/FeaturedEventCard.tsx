import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/colors";

type Props = {
  badge: string;
  title: string;
  location: string;
  date: string;
  status: string;
  pics: string;
  image: string;
  width?: number;
};

// Single featured event card. The parent (FeaturedEventsCarousel)
// controls horizontal width so it can snap-paginate.
export default function FeaturedEventCard({
  badge,
  title,
  location,
  date,
  status,
  pics,
  image,
  width,
}: Props) {
  return (
    <View style={[styles.cardOuter, width ? { width } : null]}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <View style={styles.tint} />

        <View style={styles.topRow}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>{badge}</Text>
          </View>
          <View style={styles.picsBadge}>
            <Text style={styles.picsText}>{pics}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color="#FFFFFF" />
            <Text style={styles.meta}>{location}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
            <Text style={styles.meta}>{date}</Text>
          </View>

          <View style={styles.publishedBadge}>
            <Text style={styles.publishedText}>{status}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>Open</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnLight} activeOpacity={0.85}>
            <Ionicons name="share-social-outline" size={14} color="#1a1a1a" />
            <Text style={styles.btnLightText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {},
  image: {
    height: 220,
    borderRadius: 22,
    overflow: "hidden",
  },
  imageRadius: { borderRadius: 22 },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 22,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  featuredBadge: {
    backgroundColor: Colors.purple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featuredBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  picsBadge: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  picsText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  content: {
    paddingHorizontal: 16,
    marginTop: -4,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  meta: { color: "#FFFFFF", fontSize: 12.5, fontWeight: "500" },
  publishedBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.purple,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 10,
  },
  publishedText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    padding: 14,
  },
  btnPrimary: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
  },
  btnPrimaryText: { color: "#1a1a1a", fontWeight: "700", fontSize: 13 },
  btnLight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
  },
  btnLightText: { color: "#1a1a1a", fontWeight: "700", fontSize: 13 },
});
