import { Colors } from "@/src/constants/colors";
import { analyticsData } from "@/src/constants/mockData";
import { useScroll } from "@/src/context/ScrollContext";
import { useContentInsets } from "@/src/hooks/useContentInsets";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tab = "overview" | "registrations";

// Map mock data fields to what the screen needs
const overviewStats = analyticsData.summary;

const galleryPoints = analyticsData.galleryOverTime.points;
const galleryMaxY = Math.max(...galleryPoints.map((p) => p.value), 1);
const galleryMetric = analyticsData.galleryOverTime.metric;

const eventItems = analyticsData.activityByEvent.map((e) => ({
  id: e.id,
  label: e.name,
  icon: e.icon,
  color: e.color,
  visit: e.galleryVisit,
  view: e.imageView,
  download: e.imageDownload,
}));
const barMaxY = Math.max(...eventItems.flatMap((e) => [e.visit, e.view, e.download]), 1);

const LEGEND = [
  { id: "visit", label: "Gallery Visit", color: "#EC407A" },
  { id: "view", label: "Image View", color: "#F59E0B" },
  { id: "download", label: "Downloads", color: "#6366F1" },
];

const rangeText = `${analyticsData.range.from} – ${analyticsData.range.to}`;

export default function AnalyticsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const { onScroll } = useScroll();
  const { contentBottomPadding } = useContentInsets();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="analytics-screen">
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: contentBottomPadding }]}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            testID="analytics-back"
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Analytics</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Date range */}
        <TouchableOpacity style={styles.rangePill} activeOpacity={0.85} testID="date-range">
          <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          <Text style={styles.rangeText}>{rangeText}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.primary} />
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TabBtn label="Overview" icon="stats-chart-outline" active={tab === "overview"} onPress={() => setTab("overview")} testID="tab-overview" />
          <TabBtn label="Registrations" icon="person-outline" active={tab === "registrations"} onPress={() => setTab("registrations")} testID="tab-registrations" />
        </View>

        {tab === "overview" ? (
          <>
            {/* Gallery Activity header */}
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Gallery Activity</Text>
              <Ionicons name="add" size={18} color={Colors.primary} />
            </View>

            {/* Stat cards horizontal */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, gap: 12 }}
              style={{ marginHorizontal: -20, paddingLeft: 20 }}
            >
              {overviewStats.map((s) => (
                <View key={s.id} style={styles.statCard} testID={`stat-${s.id}`}>
                  <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                    <Ionicons name={s.icon} size={18} color={s.color} />
                  </View>
                  <Text style={styles.statLabel}>{s.label}</Text>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <View style={styles.statFoot}>
                    <Ionicons name="trending-up" size={11} color={Colors.textMuted} />
                    <Text style={styles.statFootText}>{s.delta} {s.compare}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Activity Over Time */}
            <View style={styles.chartCard} testID="chart-over-time">
              <View style={styles.rowBetween}>
                <Text style={styles.chartTitle}>Gallery Activity Over Time</Text>
                <View style={styles.chartChip}>
                  <View style={[styles.chipDot, { backgroundColor: Colors.primary }]} />
                  <Text style={styles.chipText}>{galleryMetric}</Text>
                  <Ionicons name="chevron-down" size={12} color={Colors.textMuted} />
                </View>
              </View>
              <LineChart points={galleryPoints} maxY={galleryMaxY} />
            </View>

            {/* Activity by Event */}
            <View style={styles.chartCard} testID="chart-by-event">
              <Text style={styles.chartTitle}>Activity by Event</Text>
              <View style={styles.legendRow}>
                {LEGEND.map((l) => (
                  <View key={l.id} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                    <Text style={styles.legendLabel}>{l.label}</Text>
                  </View>
                ))}
              </View>
              <BarChart events={eventItems} maxY={barMaxY} />
            </View>

            {/* Event details table */}
            <View style={styles.tableCard}>
              <View style={styles.tableHead}>
                <Text style={[styles.tableHeadCell, { flex: 2 }]}>EVENT</Text>
                <View style={[styles.tableHeadIcon, { flex: 1 }]}>
                  <Ionicons name="image" size={14} color={Colors.primary} />
                </View>
                <View style={[styles.tableHeadIcon, { flex: 1 }]}>
                  <Ionicons name="eye" size={14} color="#F59E0B" />
                </View>
                <View style={[styles.tableHeadIcon, { flex: 1 }]}>
                  <Ionicons name="download" size={14} color="#6366F1" />
                </View>
              </View>

              {eventItems.map((e) => (
                <View key={e.id} style={styles.tableRow}>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <View style={[styles.rowDot, { backgroundColor: e.color }]} />
                    <Text style={styles.rowLabel} numberOfLines={1}>{e.label}</Text>
                  </View>
                  <Text style={styles.tableNum}>{e.visit}</Text>
                  <Text style={styles.tableNum}>{e.view}</Text>
                  <Text style={styles.tableNum}>{e.download}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyCard} testID="registrations-empty">
            <View style={styles.emptyIcon}>
              <Ionicons name="people" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No registrations yet</Text>
            <Text style={styles.emptySub}>Guest registrations during this range will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TabBtn({ label, icon, active, onPress, testID }: { label: string; icon: keyof typeof Ionicons.glyphMap; active: boolean; onPress: () => void; testID?: string }) {
  return (
    <TouchableOpacity style={styles.tab} activeOpacity={0.7} onPress={onPress} testID={testID}>
      <Ionicons name={icon} size={16} color={active ? Colors.primary : Colors.textMuted} />
      <Text style={[styles.tabLabel, active && { color: Colors.primary, fontWeight: "800" }]}>{label}</Text>
      {active && <View style={styles.tabUnderline} />}
    </TouchableOpacity>
  );
}

function LineChart({ points, maxY }: { points: { label: string; value: number }[]; maxY: number }) {
  const H = 130;
  const safeMax = maxY || 1;
  const yTicks = [safeMax, safeMax * 0.8, safeMax * 0.6, safeMax * 0.4, safeMax * 0.2, 0];
  const stepX = 100 / Math.max(1, points.length - 1);
  const coords = points.map((p, i) => ({
    xPct: i * stepX,
    yPct: 100 - (p.value / safeMax) * 100,
    label: p.label,
    value: p.value,
  }));

  return (
    <View style={{ marginTop: 12 }}>
      <View style={{ flexDirection: "row", height: H }}>
        <View style={styles.yAxis}>
          {yTicks.map((t, i) => (
            <Text key={i} style={styles.yTick}>{t.toFixed(1)}</Text>
          ))}
        </View>
        <View style={styles.plot}>
          {yTicks.map((_, i) => (
            <View key={i} style={[styles.gridLine, { top: `${(i / (yTicks.length - 1)) * 100}%` } as any]} />
          ))}
          {coords.slice(0, -1).map((p, i) => {
            const n = coords[i + 1];
            return <LineSegment key={i} x1Pct={p.xPct} y1Pct={p.yPct} x2Pct={n.xPct} y2Pct={n.yPct} />;
          })}
          {coords.map((p, i) => (
            <View key={i} style={[styles.dot, { left: `${p.xPct}%`, top: `${p.yPct}%` } as any]} />
          ))}
        </View>
      </View>
      <View style={styles.xAxis}>
        {points.map((p, i) => <Text key={i} style={styles.xTick}>{p.label}</Text>)}
      </View>
    </View>
  );
}

function LineSegment({ x1Pct, y1Pct, x2Pct, y2Pct }: { x1Pct: number; y1Pct: number; x2Pct: number; y2Pct: number }) {
  const REF_W = 280;
  const REF_H = 130;
  const x1 = (x1Pct / 100) * REF_W;
  const y1 = (y1Pct / 100) * REF_H;
  const x2 = (x2Pct / 100) * REF_W;
  const y2 = (y2Pct / 100) * REF_H;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: `${x1Pct}%` as any,
        top: `${y1Pct}%` as any,
        width: length,
        height: 2,
        backgroundColor: Colors.primary,
        transform: [{ translateY: -1 }, { rotateZ: `${angle}deg` }],
        transformOrigin: "0% 50%" as any,
        borderRadius: 1,
      }}
    />
  );
}

function BarChart({ events, maxY }: { events: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap; color: string; visit: number; view: number; download: number }[]; maxY: number }) {
  const H = 150;
  const safeMax = maxY || 1;
  const yTicks = [safeMax, safeMax * 0.8, safeMax * 0.6, safeMax * 0.4, safeMax * 0.2, 0];
  return (
    <View style={{ marginTop: 12 }}>
      <View style={{ flexDirection: "row", height: H }}>
        <View style={styles.yAxis}>
          {yTicks.map((t, i) => <Text key={i} style={styles.yTick}>{Math.round(t)}</Text>)}
        </View>
        <View style={styles.plot}>
          {yTicks.map((_, i) => (
            <View key={i} style={[styles.gridLine, { top: `${(i / (yTicks.length - 1)) * 100}%` } as any]} />
          ))}
          <View style={styles.barRow}>
            {events.map((e) => (
              <View key={e.id} style={styles.barGroup}>
                <View style={styles.bars}>
                  <View style={[styles.bar, { height: `${(e.visit / safeMax) * 100}%`, backgroundColor: "#EC407A" }]} />
                  <View style={[styles.bar, { height: `${(e.view / safeMax) * 100}%`, backgroundColor: "#F59E0B" }]} />
                  <View style={[styles.bar, { height: `${(e.download / safeMax) * 100}%`, backgroundColor: "#6366F1" }]} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.barXAxis}>
        {events.map((e) => (
          <View key={e.id} style={styles.barXItem}>
            <View style={[styles.barXIcon, { backgroundColor: e.color + "22" }]}>
              <Ionicons name={e.icon} size={14} color={e.color} />
            </View>
            <Text style={styles.barXText} numberOfLines={1}>{e.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPinkSoft },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
    shadowColor: Colors.shadow, shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  title: { flex: 1, fontSize: 22, fontWeight: "800", color: Colors.textDark, letterSpacing: -0.4, fontFamily: "Georgia" },

  rangePill: {
    flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#FFFFFF",
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 30, marginTop: 14,
    shadowColor: Colors.shadow, shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  rangeText: { flex: 1, color: Colors.textBody, fontSize: 13, fontWeight: "500" },

  tabs: { flexDirection: "row", gap: 10, marginTop: 16, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  tab: {
    flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 12,
    paddingHorizontal: 4, position: "relative", flex: 1, justifyContent: "center",
  },
  tabLabel: { fontSize: 13.5, color: Colors.textMuted, fontWeight: "600" },
  tabUnderline: { position: "absolute", bottom: -1, left: 0, right: 0, height: 3, borderRadius: 2, backgroundColor: Colors.primary },

  sectionHead: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginTop: 18, marginBottom: 10,
  },
  sectionTitle: { fontSize: 22, fontWeight: "800", color: Colors.textDark, letterSpacing: -0.4 },

  statCard: {
    width: 150, backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14,
    shadowColor: Colors.shadow, shadowOpacity: 1, shadowRadius: 10, elevation: 2,
  },
  statIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: "600" },
  statValue: { fontSize: 26, fontWeight: "800", color: Colors.textDark, letterSpacing: -0.5, marginTop: 2 },
  statFoot: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  statFootText: { fontSize: 10.5, color: Colors.textMuted },

  chartCard: {
    backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, marginTop: 14,
    shadowColor: Colors.shadow, shadowOpacity: 1, shadowRadius: 10, elevation: 2,
  },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  chartTitle: { fontSize: 17, fontWeight: "800", color: Colors.textDark, letterSpacing: -0.3 },
  chartChip: {
    flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.primaryFaint,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16,
  },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { fontSize: 12, color: Colors.textBody, fontWeight: "600" },

  yAxis: { width: 32, justifyContent: "space-between", paddingVertical: 2 },
  yTick: { fontSize: 10, color: Colors.textFaint, textAlign: "right" },
  plot: { flex: 1, position: "relative", marginLeft: 6 },
  gridLine: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "#F4E6EB" },
  dot: {
    position: "absolute", width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary, marginLeft: -4, marginTop: -4,
  },
  xAxis: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, paddingLeft: 38 },
  xTick: { fontSize: 10, color: Colors.textMuted },

  legendRow: { flexDirection: "row", gap: 14, marginTop: 8, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11.5, color: Colors.textBody },

  barRow: {
    flex: 1, flexDirection: "row", alignItems: "flex-end",
    justifyContent: "space-around", paddingHorizontal: 4,
  },
  barGroup: { flex: 1, alignItems: "center", height: "100%", paddingHorizontal: 4 },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: "100%" },
  bar: { width: 8, borderTopLeftRadius: 4, borderTopRightRadius: 4 },

  barXAxis: { flexDirection: "row", marginTop: 8, paddingLeft: 38 },
  barXItem: { flex: 1, alignItems: "center", gap: 4 },
  barXIcon: { width: 24, height: 24, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  barXText: { fontSize: 10, color: Colors.textBody, textAlign: "center" },

  tableCard: {
    backgroundColor: "#FFFFFF", borderRadius: 18, padding: 12, marginTop: 14,
    shadowColor: Colors.shadow, shadowOpacity: 1, shadowRadius: 10, elevation: 2,
  },
  tableHead: {
    flexDirection: "row", alignItems: "center", paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  tableHeadCell: { fontSize: 11, color: Colors.textMuted, fontWeight: "700", letterSpacing: 0.5 },
  tableHeadIcon: { alignItems: "center" },
  tableRow: {
    flexDirection: "row", alignItems: "center", paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  tableCell: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowDot: { width: 8, height: 8, borderRadius: 4 },
  rowLabel: { fontSize: 13, color: Colors.textBody, fontWeight: "600" },
  tableNum: { flex: 1, fontSize: 13, color: Colors.textBody, textAlign: "center", fontWeight: "600" },

  emptyCard: {
    backgroundColor: "#FFFFFF", borderRadius: 18, padding: 28, marginTop: 18,
    alignItems: "center", shadowColor: Colors.shadow, shadowOpacity: 1, shadowRadius: 10, elevation: 2,
  },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primarySoft,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: Colors.textDark },
  emptySub: { color: Colors.textMuted, fontSize: 12.5, textAlign: "center", marginTop: 4 },
});