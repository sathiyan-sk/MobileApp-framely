import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/colors";
import { guestQR } from "@/src/constants/mockData";

const GUEST_LIST = [
  { id: "g1", name: "Anita Sharma", photos: 24, joined: "just now" },
  { id: "g2", name: "Priya Nair", photos: 8, joined: "15m ago" },
  { id: "g3", name: "Rahul Kumar", photos: 0, joined: "1h ago" },
  { id: "g4", name: "Meera Das", photos: 16, joined: "3h ago" },
  { id: "g5", name: "Suresh R", photos: 4, joined: "yesterday" },
];

export default function GuestScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="guest-screen">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Guests</Text>
            <Text style={styles.subtitle}>
              Manage guests and QR access
            </Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} testID="guest-bell">
            <Ionicons name="notifications-outline" size={20} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="people" size={20} color={Colors.primary} />
            <Text style={styles.statValue}>275</Text>
            <Text style={styles.statLabel}>Total Guests</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMiddle]}>
            <Ionicons name="images" size={20} color={Colors.purple} />
            <Text style={[styles.statValue, { color: Colors.purple }]}>1,660</Text>
            <Text style={styles.statLabel}>Photos Uploaded</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="eye" size={20} color={Colors.green} />
            <Text style={[styles.statValue, { color: Colors.green }]}>2</Text>
            <Text style={styles.statLabel}>Gallery Visits</Text>
          </View>
        </View>

        {/* QR Section */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle}>{guestQR.title}</Text>
            <View style={styles.activePill}>
              <View style={styles.activeDot} />
              <Text style={styles.activePillText}>Active</Text>
            </View>
          </View>
          <Text style={styles.cardSub}>{guestQR.subtitle}</Text>

          <View style={styles.qrBox}>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={100} color={Colors.textDark} />
            </View>
            <Text style={styles.qrLabel}>{guestQR.label}</Text>
          </View>

          <View style={styles.linkRow}>
            <Text style={styles.linkText} numberOfLines={1}>
              {guestQR.link}
            </Text>
            <TouchableOpacity testID="guest-copy-link">
              <Ionicons name="copy-outline" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.qrActions}>
            <TouchableOpacity style={styles.downloadBtn} testID="guest-qr-download">
              <Ionicons name="arrow-down" size={14} color="#1a1a1a" />
              <Text style={styles.downloadText}>Download QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} testID="guest-qr-share">
              <Ionicons name="share-social-outline" size={14} color="#1a1a1a" />
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Guest List */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Guests</Text>
          <TouchableOpacity testID="guest-view-all">
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.guestCard}>
          {GUEST_LIST.map((g, idx) => (
            <View
              key={g.id}
              style={[styles.guestRow, idx !== GUEST_LIST.length - 1 && styles.guestRowBorder]}
              testID={`guest-item-${g.id}`}
            >
              <View style={styles.guestAvatar}>
                <Text style={styles.guestInitial}>{g.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.guestName}>{g.name}</Text>
                <Text style={styles.guestJoined}>{g.joined}</Text>
              </View>
              <View style={styles.guestPhotosBadge}>
                <Ionicons name="images-outline" size={12} color={Colors.primary} />
                <Text style={styles.guestPhotosText}>{g.photos}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 140 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPinkSoft },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -1,
    fontFamily: "Georgia",
  },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  statBox: { flex: 1, alignItems: "center", gap: 4 },
  statBoxMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.divider,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  statLabel: { fontSize: 11, color: Colors.textMuted, textAlign: "center" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 17, fontWeight: "700", color: Colors.textDark },
  cardSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green },
  activePillText: { color: Colors.green, fontSize: 11, fontWeight: "700" },

  qrBox: {
    alignItems: "center",
    backgroundColor: Colors.bgPinkSoft,
    borderRadius: 14,
    paddingVertical: 18,
    marginTop: 12,
  },
  qrPlaceholder: {
    width: 130,
    height: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  qrLabel: { marginTop: 10, fontWeight: "700", color: Colors.textDark, fontSize: 13 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgPinkSoft,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    gap: 10,
  },
  linkText: { flex: 1, color: Colors.textBody, fontSize: 11.5 },
  qrActions: { flexDirection: "row", gap: 10, marginTop: 12 },
  downloadBtn: {
    flex: 1,
    backgroundColor: Colors.yellow,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  downloadText: { color: "#1a1a1a", fontWeight: "700", fontSize: 13 },
  shareBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareText: { color: "#1a1a1a", fontWeight: "700", fontSize: 13 },

  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: Colors.textDark },
  viewAll: { color: Colors.primary, fontWeight: "700", fontSize: 12.5 },

  guestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  guestRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  guestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  guestInitial: { color: Colors.primary, fontSize: 16, fontWeight: "800" },
  guestName: { fontSize: 14.5, fontWeight: "700", color: Colors.textDark },
  guestJoined: { fontSize: 11.5, color: Colors.textMuted, marginTop: 2 },
  guestPhotosBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  guestPhotosText: { fontSize: 12, fontWeight: "700", color: Colors.primary },
});
