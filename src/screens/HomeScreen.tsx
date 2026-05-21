import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/src/constants/colors";
import {
  userMock,
  statsMock,
  featuredEvents,
  myEvents,
  recentUploads,
  activityFeed,
  guestQR,
  storagePlan,
} from "@/src/constants/mockData";

import StatCard from "@/src/components/home/StatCard";
import FeaturedEventsCarousel from "@/src/components/home/FeaturedEventsCarousel";
import EventCard from "@/src/components/home/EventCard";
import SectionHeader from "@/src/components/home/SectionHeader";
import { useScroll } from "@/src/context/ScrollContext";


// Horizontal screen padding used by the ScrollView — keep in sync with styles.scroll.
const SCREEN_PAD = 18;


export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const carouselItemWidth = screenWidth - SCREEN_PAD * 2;
    const { onScroll } = useScroll();


  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="home-screen">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: userMock.avatar }} style={styles.avatar} />
          <View style={styles.headerCenter}>
            <Text style={styles.greeting}>{userMock.greeting}</Text>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{userMock.name}</Text>
              <Ionicons
                name="star"
                size={14}
                color={Colors.primary}
                style={{ marginLeft: 6 }}
              />
            </View>
            <Text style={styles.subtitle}>{userMock.subtitle}</Text>
          </View>
          <TouchableOpacity style={styles.bell} testID="header-bell">
            <Ionicons
              name="notifications-outline"
              size={20}
              color={Colors.textDark}
            />
            {userMock.notifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{userMock.notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stat cards 2x2 */}
        <View style={styles.statGrid}>
          {statsMock.map((s) => (
            <View key={s.id} style={styles.statHalf}>
              <StatCard
                label={s.label}
                value={s.value}
                unit={s.unit}
                sub={s.sub}
                icon={s.icon}
                iconColor={s.color}
                iconBg={s.bg}
              />
            </View>
          ))}
        </View>

        {/* Featured event */}
        <FeaturedEventsCarousel events={featuredEvents} itemWidth={carouselItemWidth} />

        {/* My Events */}
        <SectionHeader
          title="My Events"
          actionLabel="View all"
          actionIcon={
            <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
          }
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 8 }}
        >
          {myEvents.map((e) => (
            <EventCard key={e.id} {...e} />
          ))}
        </ScrollView>

        {/* Recent Uploads */}
        <View style={styles.cardWrapper}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Recent Uploads</Text>
            <TouchableOpacity style={styles.viewGallery}>
              <Text style={styles.viewGalleryText}>View gallery</Text>
              <Ionicons name="grid-outline" size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 12 }}
            contentContainerStyle={{ gap: 10, paddingRight: 8 }}
          >
            {recentUploads.map((u) => (
              <View key={u.id} style={styles.uploadItem}>
                <Image source={{ uri: u.image }} style={styles.uploadImg} />
                {u.liked && (
                  <View style={styles.likeDot}>
                    <Ionicons name="heart" size={11} color={Colors.primary} />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Activity */}
        <View style={styles.cardWrapper}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          {activityFeed.map((a, idx) => (
            <View key={a.id} style={styles.activityRow}>
              <View style={styles.timeline}>
                <View style={[styles.timelineDot, { backgroundColor: a.bg }]}>
                  <Ionicons name={a.icon} size={13} color={a.tint} />
                </View>
                {idx !== activityFeed.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>

              <View style={styles.activityBody}>
                <Text style={styles.activityText}>
                  <Text style={styles.activityActor}>{a.actor}</Text>{" "}
                  {a.action}{" "}
                  <Text style={styles.activityTarget}>{a.target}</Text>
                </Text>
                <Text style={styles.activityTime}>{a.time}</Text>
              </View>

              <Image source={{ uri: a.thumb }} style={styles.activityThumb} />
            </View>
          ))}
        </View>

        {/* Guest QR */}
        <View style={styles.cardWrapper}>
          <Text style={styles.cardTitle}>{guestQR.title}</Text>
          <Text style={styles.qrSub}>{guestQR.subtitle}</Text>

          <View style={styles.qrBox}>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={120} color={Colors.textDark} />
            </View>
            <Text style={styles.qrLabel}>{guestQR.label}</Text>
          </View>

          <View style={styles.linkRow}>
            <Text style={styles.linkText} numberOfLines={1}>
              {guestQR.link}
            </Text>
            <TouchableOpacity>
              <Ionicons
                name="copy-outline"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.qrActions}>
            <TouchableOpacity style={styles.downloadBtn}>
              <Ionicons name="arrow-down" size={14} color="#1a1a1a" />
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Ionicons
                name="share-social-outline"
                size={14}
                color="#1a1a1a"
              />
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Storage & Plan */}
        <View style={styles.cardWrapper}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Storage & Plan</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.primary}
            />
          </View>

          <View style={styles.planRow}>
            <View>
              <Text style={styles.planBigValue}>
                {storagePlan.usedGB}{" "}
                <Text style={styles.planSmallUnit}>GB</Text>
              </Text>
              <Text style={styles.planSubtle}>
                of {storagePlan.totalGB} GB · {storagePlan.percent}% used
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View style={styles.planTopRight}>
                <Ionicons name="ribbon" size={14} color={Colors.purple} />
                <Text style={styles.planLabel}>Your Plan</Text>
              </View>
              <View style={styles.planNameRow}>
                <Text style={styles.planName}>{storagePlan.planName}</Text>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>
                    {storagePlan.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.renews}>{storagePlan.renews}</Text>
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.photosLabel}>Photos</Text>
              <Text style={styles.photosLabel}>
                {storagePlan.photosUsed.toLocaleString()} /{" "}
                {storagePlan.photosTotal.toLocaleString()}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      (storagePlan.photosUsed / storagePlan.photosTotal) * 100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPink },
  scroll: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 18,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
  },
  headerCenter: { flex: 1, marginLeft: 12 },
  greeting: { fontSize: 11, color: Colors.textMuted, fontWeight: "500" },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 11.5, color: Colors.textMuted, marginTop: 2 },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: Colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },

  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statHalf: { width: "48%", flexGrow: 1 },

  cardWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textDark,
    letterSpacing: -0.3,
  },
  viewGallery: { flexDirection: "row", alignItems: "center", gap: 5 },
  viewGalleryText: { color: Colors.primary, fontWeight: "700", fontSize: 12.5 },
  viewAll: { color: Colors.primary, fontWeight: "700", fontSize: 12.5 },

  uploadItem: { position: "relative" },
  uploadImg: {
    width: 130,
    height: 75,
    borderRadius: 14,
  },
  likeDot: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
  },
  timeline: {
    width: 28,
    alignItems: "center",
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 22,
    backgroundColor: Colors.primarySoft,
    marginTop: 2,
  },
  activityBody: { flex: 1, marginLeft: 12, paddingTop: 2 },
  activityText: {
    fontSize: 12.5,
    color: Colors.textBody,
    lineHeight: 17,
  },
  activityActor: { fontWeight: "700", color: Colors.textDark },
  activityTarget: { color: Colors.primary, fontWeight: "700" },
  activityTime: { color: Colors.textFaint, fontSize: 11, marginTop: 2 },
  activityThumb: {
    width: 42,
    height: 30,
    borderRadius: 8,
    marginLeft: 8,
  },

  qrSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  qrBox: {
    alignItems: "center",
    backgroundColor: Colors.bgPinkSoft,
    borderRadius: 14,
    paddingVertical: 18,
    marginTop: 12,
  },
  qrPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  qrLabel: {
    marginTop: 10,
    fontWeight: "700",
    color: Colors.textDark,
    fontSize: 13,
  },
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

  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 14,
  },
  planBigValue: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -0.5,
  },
  planSmallUnit: { fontSize: 12, color: Colors.textMuted, fontWeight: "700" },
  planSubtle: { color: Colors.textMuted, fontSize: 11.5, marginTop: 2 },
  planTopRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  planLabel: { color: Colors.textMuted, fontSize: 11.5, fontWeight: "600" },
  planNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  planName: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -0.3,
  },
  activeBadge: {
    backgroundColor: Colors.greenSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeBadgeText: {
    color: Colors.green,
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  renews: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  photosLabel: { color: Colors.textBody, fontSize: 12, fontWeight: "500" },
  progressTrack: {
    marginTop: 6,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.primarySoft,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
});