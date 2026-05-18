import React from \"react\";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from \"react-native\";
import { SafeAreaView } from \"react-native-safe-area-context\";
import { Ionicons } from \"@expo/vector-icons\";
import { LinearGradient } from \"expo-linear-gradient\";
import { useRouter } from \"expo-router\";
import { Colors } from \"@/src/constants/colors\";
import { myPlanData } from \"@/src/constants/mockData\";
import ScreenHeader from \"@/src/components/common/ScreenHeader\";

// \"My Plan\" screen.
// - Hero card shows the currently active plan + usage progress.
// - Three plan tiers below: Starter (free), Pro (current), Elite (upgrade).
// - Footer hint for switching plans.
export default function MyPlanScreen() {
  const router = useRouter();
  const { active, plans } = myPlanData;

  const photosPct = (active.photosUsed / active.photosTotal) * 100;
  const storagePct = (active.storageUsedGB / active.storageTotalGB) * 100;

  return (
    <SafeAreaView style={styles.safe} edges={[\"top\"]} testID=\"my-plan-screen\">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title=\"\" onBack={() => router.back()} />

        <Text style={styles.title}>My Plan</Text>
        <Text style={styles.subtitle}>
          Manage your subscription and usage
        </Text>

        {/* Active plan hero card */}
        <LinearGradient
          colors={[\"#FFE082\", \"#F2B233\"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.activeCard}
        >
          <View style={styles.activeTop}>
            <View style={styles.gemCircle}>
              <Ionicons name=\"diamond\" size={20} color=\"#F2B233\" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.activeLabel}>ACTIVE PLAN</Text>
              <View style={styles.activeRow}>
                <Text style={styles.activeName}>{active.name}</Text>
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>{active.status}</Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: \"flex-end\" }}>
              <Text style={styles.activePrice}>{active.price}</Text>
              <Text style={styles.activeUnit}>{active.unit}</Text>
            </View>
          </View>

          <View style={styles.usageRow}>
            <View style={styles.usageIcon}>
              <Ionicons name=\"image\" size={14} color=\"#F2B233\" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.usageHead}>
                <Text style={styles.usageLabel}>Photos Used</Text>
                <Text style={styles.usageValue}>
                  {active.photosUsed.toLocaleString()} /{\" \"}
                  {active.photosTotal.toLocaleString()}
                </Text>
              </View>
              <View style={styles.usageTrack}>
                <View
                  style={[styles.usageFill, { width: `${photosPct}%` }]}
                />
              </View>
            </View>
          </View>

          <View style={styles.usageRow}>
            <View style={styles.usageIcon}>
              <Ionicons name=\"cloud-upload\" size={14} color=\"#F2B233\" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.usageHead}>
                <Text style={styles.usageLabel}>Storage</Text>
                <Text style={styles.usageValue}>
                  {active.storageUsedGB} GB / {active.storageTotalGB} GB
                </Text>
              </View>
              <View style={styles.usageTrack}>
                <View
                  style={[styles.usageFill, { width: `${storagePct}%` }]}
                />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Section divider */}
        <View style={styles.dividerRow}>
          <Text style={styles.dividerPlus}>+</Text>
          <Text style={styles.dividerLabel}>Choose a plan</Text>
          <Text style={styles.dividerPlus}>+</Text>
        </View>

        {/* Plan cards */}
        {plans.map((p) => (
          <View key={p.id} style={styles.planCard} testID={`plan-${p.id}`}>
            {p.bestValue && (
              <View style={styles.bestValueTag}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
            )}

            <View style={styles.planHead}>
              <View
                style={[styles.planIcon, { backgroundColor: p.accentSoft }]}
              >
                <Ionicons name={p.icon} size={22} color={p.accent} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.planName}>{p.name}</Text>
                <Text style={styles.planTagline}>{p.tagline}</Text>
              </View>
              {p.price ? (
                <View style={{ alignItems: \"flex-end\" }}>
                  <Text style={[styles.planPrice, { color: p.accent }]}>
                    {p.price}
                  </Text>
                  <Text style={styles.planUnit}>{p.unit}</Text>
                </View>
              ) : (
                <View style={styles.giftCircle}>
                  <Ionicons name=\"gift\" size={18} color={Colors.primary} />
                </View>
              )}
            </View>

            <View style={styles.featureGrid}>
              {p.features.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons
                    name=\"checkmark-circle-outline\"
                    size={14}
                    color={Colors.primary}
                  />
                  <Text style={styles.featureText} numberOfLines={1}>
                    {f}
                  </Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            {p.cta.variant === \"outline\" && (
              <TouchableOpacity
                style={styles.outlineBtn}
                activeOpacity={0.85}
                testID={`plan-cta-${p.id}`}
              >
                <Text style={styles.outlineBtnText}>{p.cta.label}</Text>
              </TouchableOpacity>
            )}
            {p.cta.variant === \"gradient\" && (
              <TouchableOpacity
                activeOpacity={0.85}
                testID={`plan-cta-${p.id}`}
              >
                <LinearGradient
                  colors={[\"#EC407A\", \"#FF6F3C\"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBtn}
                >
                  <Ionicons name=\"ribbon\" size={14} color=\"#FFFFFF\" />
                  <Text style={styles.gradientBtnText}>{p.cta.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {p.cta.variant === \"purple\" && (
              <TouchableOpacity
                style={styles.purpleBtn}
                activeOpacity={0.85}
                testID={`plan-cta-${p.id}`}
              >
                <Text style={styles.purpleBtnText}>{p.cta.label}</Text>
                <Ionicons name=\"arrow-forward\" size={16} color=\"#FFFFFF\" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Footer hint */}
        <View style={styles.footerHint} testID=\"plan-footer-hint\">
          <View style={styles.footerIcon}>
            <Ionicons name=\"sparkles\" size={16} color={Colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.footerTitle}>
              Need more storage or photos?
            </Text>
            <Text style={styles.footerSubtitle}>
              You can upgrade or downgrade your plan anytime.
            </Text>
          </View>
          <Ionicons
            name=\"chevron-forward\"
            size={18}
            color={Colors.primary}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPinkSoft },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },

  title: {
    fontSize: 34,
    fontWeight: \"800\",
    color: Colors.textDark,
    letterSpacing: -1,
    fontFamily: \"Georgia\",
    marginTop: 6,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },

  activeCard: {
    borderRadius: 22,
    padding: 16,
    shadowColor: \"#F2B233\",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  activeTop: {
    flexDirection: \"row\",
    alignItems: \"center\",
  },
  gemCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: \"#FFFFFF\",
    alignItems: \"center\",
    justifyContent: \"center\",
  },
  activeLabel: {
    color: \"#F58A1F\",
    fontSize: 10,
    fontWeight: \"700\",
    letterSpacing: 0.6,
  },
  activeRow: { flexDirection: \"row\", alignItems: \"center\", gap: 8, marginTop: 2 },
  activeName: {
    fontSize: 24,
    fontWeight: \"800\",
    color: Colors.textDark,
    letterSpacing: -0.5,
    fontFamily: \"Georgia\",
  },
  activePill: {
    backgroundColor: \"#FF5C7A\",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activePillText: {
    color: \"#FFFFFF\",
    fontSize: 9.5,
    fontWeight: \"800\",
    letterSpacing: 0.5,
  },
  activePrice: {
    color: \"#F58A1F\",
    fontSize: 22,
    fontWeight: \"800\",
    letterSpacing: -0.5,
  },
  activeUnit: { color: \"#F58A1F\", fontSize: 11, fontWeight: \"600\" },

  usageRow: {
    flexDirection: \"row\",
    alignItems: \"center\",
    marginTop: 14,
  },
  usageIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: \"rgba(255,255,255,0.55)\",
    alignItems: \"center\",
    justifyContent: \"center\",
    marginRight: 10,
  },
  usageHead: {
    flexDirection: \"row\",
    justifyContent: \"space-between\",
    alignItems: \"center\",
  },
  usageLabel: { color: \"#3A2A0E\", fontSize: 12.5, fontWeight: \"700\" },
  usageValue: { color: \"#7A5A12\", fontSize: 11.5, fontWeight: \"600\" },
  usageTrack: {
    height: 5,
    backgroundColor: \"rgba(255,255,255,0.55)\",
    borderRadius: 3,
    overflow: \"hidden\",
    marginTop: 5,
  },
  usageFill: { height: \"100%\", backgroundColor: \"#EC407A\" },

  dividerRow: {
    flexDirection: \"row\",
    alignItems: \"center\",
    justifyContent: \"center\",
    gap: 14,
    marginTop: 22,
    marginBottom: 14,
  },
  dividerPlus: { color: Colors.primary, fontSize: 14, fontWeight: \"800\" },
  dividerLabel: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: \"800\",
    letterSpacing: 0.2,
  },

  planCard: {
    backgroundColor: \"#FFFFFF\",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  bestValueTag: {
    position: \"absolute\",
    top: 0,
    left: 14,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  bestValueText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: \"800\",
    letterSpacing: 0.6,
  },
  planHead: {
    flexDirection: \"row\",
    alignItems: \"center\",
    marginTop: 12,
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: \"center\",
    justifyContent: \"center\",
  },
  planName: {
    fontSize: 22,
    fontWeight: \"800\",
    color: Colors.textDark,
    letterSpacing: -0.5,
    fontFamily: \"Georgia\",
  },
  planTagline: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  planPrice: {
    fontSize: 18,
    fontWeight: \"800\",
    letterSpacing: -0.4,
  },
  planUnit: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  giftCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySoft,
    alignItems: \"center\",
    justifyContent: \"center\",
  },

  featureGrid: {
    flexDirection: \"row\",
    flexWrap: \"wrap\",
    marginTop: 14,
  },
  featureItem: {
    flexDirection: \"row\",
    alignItems: \"center\",
    gap: 6,
    width: \"50%\",
    marginBottom: 8,
    paddingRight: 6,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textBody,
    flexShrink: 1,
  },

  outlineBtn: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: \"center\",
  },
  outlineBtnText: {
    color: Colors.primary,
    fontWeight: \"700\",
    fontSize: 14,
  },
  gradientBtn: {
    flexDirection: \"row\",
    justifyContent: \"center\",
    alignItems: \"center\",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  gradientBtnText: {
    color: \"#FFFFFF\",
    fontWeight: \"800\",
    fontSize: 14,
  },
  purpleBtn: {
    marginTop: 8,
    backgroundColor: \"#9B4DCA\",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: \"row\",
    justifyContent: \"center\",
    alignItems: \"center\",
    gap: 10,
  },
  purpleBtnText: {
    color: \"#FFFFFF\",
    fontWeight: \"800\",
    fontSize: 14,
  },

  footerHint: {
    flexDirection: \"row\",
    alignItems: \"center\",
    backgroundColor: Colors.primaryFaint,
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  footerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: \"#FFFFFF\",
    alignItems: \"center\",
    justifyContent: \"center\",
  },
  footerTitle: { color: Colors.primary, fontSize: 13, fontWeight: \"800\" },
  footerSubtitle: { color: Colors.textMuted, fontSize: 11.5, marginTop: 2 },
});
