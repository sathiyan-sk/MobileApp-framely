import React, { useMemo, useState } from \"react\";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from \"react-native\";
import { SafeAreaView } from \"react-native-safe-area-context\";
import { Ionicons } from \"@expo/vector-icons\";
import { useRouter } from \"expo-router\";
import Svg, {
  Polyline,
  Circle,
  Line as SvgLine,
} from \"react-native-svg\";

import { Colors } from \"@/src/constants/colors\";
import { analyticsMock, userMock } from \"@/src/constants/mockData\";

const CHART_WIDTH = 300;
const CHART_HEIGHT = 140;

export default function AnalyticsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<\"overview\" | \"registrations\">(\"overview\");
  const [selectedEventId, setSelectedEventId] = useState<string>(
    analyticsMock.activityByEvent[1].id,
  );

  // ── Line chart points (Sep '25 → Mar '26) ────────────────────────────────
  const linePoints = useMemo(() => {
    const { points } = analyticsMock.galleryOverTime;
    const max = 2.5;
    const stepX = CHART_WIDTH / (points.length - 1);
    return points.map((p, i) => ({
      x: i * stepX,
      y: CHART_HEIGHT - (p.value / max) * (CHART_HEIGHT - 20) - 10,
      label: p.label,
      value: p.value,
    }));
  }, []);

  const polyline = linePoints.map((p) => `${p.x},${p.y}`).join(\" \");

  return (
    <SafeAreaView style={styles.safe} edges={[\"top\"]} testID=\"analytics-screen\">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            testID=\"analytics-back\"
          >
            <Ionicons name=\"chevron-back\" size={22} color={Colors.primary} />
          </TouchableOpacity>

          <View style={styles.userPill}>
            <Text style={styles.userPillLetter}>{userMock.initial}</Text>
          </View>

          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Date range pill */}
        <TouchableOpacity
          style={styles.dateRow}
          activeOpacity={0.85}
          testID=\"analytics-date-range\"
        >
          <Ionicons name=\"calendar\" size={16} color={Colors.primary} />
          <Text style={styles.dateText}>
            {analyticsMock.range.from} — {analyticsMock.range.to}
          </Text>
          <Ionicons name=\"chevron-down\" size={16} color={Colors.primary} />
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={styles.tabBtn}
            onPress={() => setTab(\"overview\")}
            testID=\"tab-overview\"
          >
            <Ionicons
              name=\"stats-chart\"
              size={14}
              color={tab === \"overview\" ? Colors.primary : Colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                tab === \"overview\" && styles.tabTextActive,
              ]}
            >
              Overview
            </Text>
            {tab === \"overview\" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabBtn}
            onPress={() => setTab(\"registrations\")}
            testID=\"tab-registrations\"
          >
            <Ionicons
              name=\"person-outline\"
              size={14}
              color={
                tab === \"registrations\" ? Colors.primary : Colors.textMuted
              }
            />
            <Text
              style={[
                styles.tabText,
                tab === \"registrations\" && styles.tabTextActive,
              ]}
            >
              Registrations
            </Text>
            {tab === \"registrations\" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {tab === \"overview\" ? (
          <>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Gallery Activity</Text>
              <Ionicons name=\"add\" size={18} color={Colors.primary} />
            </View>

            {/* Horizontal stat cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingRight: 4 }}
              style={{ marginTop: 4 }}
            >
              {analyticsMock.summary.map((s) => (
                <View
                  key={s.id}
                  style={styles.statCard}
                  testID={`stat-${s.id}`}
                >
                  <View
                    style={[styles.statIconWrap, { backgroundColor: s.bg }]}
                  >
                    <Ionicons name={s.icon} size={16} color={s.color} />
                  </View>
                  <Text style={styles.statLabel}>{s.label}</Text>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <View style={styles.statDeltaRow}>
                    <Ionicons name=\"trending-up\" size={10} color={Colors.green} />
                    <Text style={styles.statDelta}>{s.delta} {s.compare}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Gallery activity over time */}
            <View style={styles.bigCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Gallery Activity Over Time</Text>
                <View style={styles.metricPill}>
                  <View style={[styles.metricDot, { backgroundColor: Colors.primary }]} />
                  <Text style={styles.metricText}>
                    {analyticsMock.galleryOverTime.metric}
                  </Text>
                  <Ionicons
                    name=\"chevron-down\"
                    size={12}
                    color={Colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.chartArea}>
                {/* y-axis labels */}
                <View style={styles.yAxis}>
                  {[...analyticsMock.galleryOverTime.yAxis]
                    .reverse()
                    .map((v) => (
                      <Text key={`y-${v}`} style={styles.axisLabel}>
                        {v.toFixed(1)}
                      </Text>
                    ))}
                </View>

                <View style={{ flex: 1 }}>
                  <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                    {/* faint grid */}
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <SvgLine
                        key={`grid-${i}`}
                        x1={0}
                        y1={(CHART_HEIGHT / 5) * i}
                        x2={CHART_WIDTH}
                        y2={(CHART_HEIGHT / 5) * i}
                        stroke=\"#F4E2EA\"
                        strokeWidth={1}
                      />
                    ))}
                    <Polyline
                      points={polyline}
                      fill=\"none\"
                      stroke={Colors.primary}
                      strokeWidth={2.5}
                    />
                    {linePoints.map((p, i) => (
                      <Circle
                        key={`pt-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r={3.5}
                        fill={Colors.primary}
                      />
                    ))}
                  </Svg>

                  {/* x-axis labels */}
                  <View style={styles.xAxis}>
                    {linePoints.map((p) => (
                      <Text key={p.label} style={styles.axisLabel}>
                        {p.label}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Activity by event */}
            <View style={styles.bigCard}>
              <Text style={styles.cardTitle}>Activity by Event</Text>

              <View style={styles.legendRow}>
                <Legend label=\"Gallery Visit\" color={Colors.primary} />
                <Legend label=\"Image View\" color=\"#F59E0B\" />
                <Legend label=\"Image Download\" color={Colors.purple} />
              </View>

              <View style={styles.chartArea}>
                <View style={styles.yAxis}>
                  {[650, 520, 390, 260, 130, 0].map((v) => (
                    <Text key={`b-${v}`} style={styles.axisLabel}>
                      {v}
                    </Text>
                  ))}
                </View>
                <View style={{ flex: 1, justifyContent: \"flex-end\" }}>
                  <View style={styles.eventIconsRow}>
                    {analyticsMock.activityByEvent.map((e) => {
                      const active = e.id === selectedEventId;
                      return (
                        <TouchableOpacity
                          key={e.id}
                          style={styles.eventIconCol}
                          onPress={() => setSelectedEventId(e.id)}
                          activeOpacity={0.7}
                          testID={`event-bar-${e.id}`}
                        >
                          <View
                            style={[
                              styles.eventIconBubble,
                              active && {
                                backgroundColor: e.color + \"33\",
                                borderColor: e.color,
                              },
                            ]}
                          >
                            <Ionicons name={e.icon} size={16} color={e.color} />
                          </View>
                          <Text
                            style={styles.eventLabel}
                            numberOfLines={1}
                            ellipsizeMode=\"tail\"
                          >
                            {e.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Table */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHead, { flex: 1.4 }]}>EVENT</Text>
                <View style={styles.tableHeadCell}>
                  <Ionicons
                    name=\"image\"
                    size={14}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.tableHeadCell}>
                  <Ionicons name=\"eye\" size={14} color=\"#F59E0B\" />
                </View>
                <View style={styles.tableHeadCell}>
                  <Ionicons name=\"download\" size={14} color={Colors.purple} />
                </View>
              </View>

              {analyticsMock.activityByEvent.map((row) => (
                <View key={row.id} style={styles.tableRow}>
                  <View style={[styles.rowName, { flex: 1.4 }]}>
                    <View
                      style={[styles.rowDot, { backgroundColor: row.color }]}
                    />
                    <Text style={styles.rowText} numberOfLines={1}>
                      {row.name}
                    </Text>
                  </View>
                  <Text style={styles.rowCell}>{row.galleryVisit}</Text>
                  <Text style={styles.rowCell}>{row.imageView}</Text>
                  <Text style={styles.rowCell}>{row.imageDownload}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.bigCard}>
            <Text style={styles.cardTitle}>Registrations</Text>
            <Text style={styles.subtleText}>
              5 guests registered in the selected range.
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const Legend = ({ label, color }: { label: string; color: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPinkSoft },
  scroll: { paddingHorizontal: 18, paddingTop: 4, paddingBottom: 16 },

  headerRow: {
    flexDirection: \"row\",
    alignItems: \"center\",
    marginTop: 4,
    marginBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryFaint,
    alignItems: \"center\",
    justifyContent: \"center\",
  },
  userPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryFaint,
    alignItems: \"center\",
    justifyContent: \"center\",
    marginLeft: 10,
  },
  userPillLetter: {
    color: Colors.primary,
    fontWeight: \"800\",
    fontSize: 13,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: \"800\",
    color: Colors.textDark,
    letterSpacing: -0.5,
    marginLeft: 14,
    fontFamily: \"Georgia\",
  },

  dateRow: {
    flexDirection: \"row\",
    alignItems: \"center\",
    backgroundColor: \"#FFFFFF\",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  dateText: {
    flex: 1,
    color: Colors.textDark,
    fontSize: 13,
    fontWeight: \"600\",
  },

  tabsRow: {
    flexDirection: \"row\",
    marginTop: 16,
    marginBottom: 8,
    gap: 24,
    paddingHorizontal: 4,
  },
  tabBtn: {
    flexDirection: \"row\",
    alignItems: \"center\",
    gap: 6,
    paddingVertical: 8,
  },
  tabText: { color: Colors.textMuted, fontSize: 14, fontWeight: \"600\" },
  tabTextActive: { color: Colors.primary, fontWeight: \"700\" },
  tabUnderline: {
    position: \"absolute\",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  sectionTitleRow: {
    flexDirection: \"row\",
    alignItems: \"center\",
    gap: 6,
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: \"800\",
    color: Colors.textDark,
    letterSpacing: -0.4,
  },

  statCard: {
    width: 150,
    backgroundColor: \"#FFFFFF\",
    borderRadius: 18,
    padding: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  statIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: \"center\",
    justifyContent: \"center\",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
    fontWeight: \"600\",
  },
  statValue: {
    fontSize: 28,
    fontWeight: \"800\",
    color: Colors.textDark,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  statDeltaRow: { flexDirection: \"row\", alignItems: \"center\", gap: 4, marginTop: 6 },
  statDelta: { fontSize: 10.5, color: Colors.textMuted, fontWeight: \"500\" },

  bigCard: {
    backgroundColor: \"#FFFFFF\",
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: \"row\",
    justifyContent: \"space-between\",
    alignItems: \"center\",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: \"800\",
    color: Colors.textDark,
    letterSpacing: -0.3,
  },
  metricPill: {
    flexDirection: \"row\",
    alignItems: \"center\",
    gap: 6,
    backgroundColor: Colors.bgPinkSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  metricDot: { width: 8, height: 8, borderRadius: 4 },
  metricText: { fontSize: 12, color: Colors.textDark, fontWeight: \"600\" },

  chartArea: {
    flexDirection: \"row\",
    marginTop: 14,
    height: 160,
  },
  yAxis: {
    width: 30,
    justifyContent: \"space-between\",
    paddingVertical: 6,
  },
  axisLabel: {
    fontSize: 10,
    color: Colors.textFaint,
    fontWeight: \"500\",
  },
  xAxis: {
    flexDirection: \"row\",
    justifyContent: \"space-between\",
    marginTop: 4,
  },

  legendRow: {
    flexDirection: \"row\",
    flexWrap: \"wrap\",
    gap: 16,
    marginTop: 8,
  },
  legendItem: { flexDirection: \"row\", alignItems: \"center\", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11.5, color: Colors.textBody, fontWeight: \"500\" },

  eventIconsRow: {
    flexDirection: \"row\",
    justifyContent: \"space-between\",
    paddingTop: 10,
  },
  eventIconCol: { alignItems: \"center\", flex: 1, paddingHorizontal: 2 },
  eventIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: \"#F4F4F6\",
    alignItems: \"center\",
    justifyContent: \"center\",
    borderWidth: 1.5,
    borderColor: \"transparent\",
  },
  eventLabel: {
    marginTop: 6,
    fontSize: 9.5,
    color: Colors.textBody,
    fontWeight: \"500\",
    textAlign: \"center\",
  },

  tableHeader: {
    flexDirection: \"row\",
    alignItems: \"center\",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginTop: 12,
  },
  tableHead: {
    fontSize: 10.5,
    fontWeight: \"700\",
    color: Colors.textMuted,
    letterSpacing: 0.6,
  },
  tableHeadCell: { flex: 1, alignItems: \"center\" },
  tableRow: {
    flexDirection: \"row\",
    alignItems: \"center\",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rowName: { flexDirection: \"row\", alignItems: \"center\", gap: 8 },
  rowDot: { width: 8, height: 8, borderRadius: 4 },
  rowText: { fontSize: 13, fontWeight: \"500\", color: Colors.textDark },
  rowCell: {
    flex: 1,
    textAlign: \"center\",
    fontSize: 13,
    color: Colors.textBody,
    fontWeight: \"600\",
  },

  subtleText: { color: Colors.textMuted, fontSize: 13, marginTop: 8 },
});