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
import { userMock, settingsGroups } from "@/src/constants/mockData";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="settings-screen">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>
              Manage your account, subscription and branding
            </Text>
          </View>
          <TouchableOpacity style={styles.bell} testID="settings-bell">
            <Ionicons name="notifications" size={20} color={Colors.primary} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* User Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.userCard}
          testID="user-card"
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{userMock.initial}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.userName}>{userMock.fullName}</Text>
            <Text style={styles.userEmail}>{userMock.email}</Text>
            <View style={styles.planBadge}>
              <Ionicons
                name="ribbon-outline"
                size={11}
                color={Colors.primary}
              />
              <Text style={styles.planBadgeText}>{userMock.plan}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textFaint} />
        </TouchableOpacity>

        {/* Groups */}
        {settingsGroups.map((group) => (
          <View key={group.id} style={styles.groupBlock}>
            <View style={styles.sectionRow}>
              <Ionicons
                name={group.sectionIcon}
                size={14}
                color={Colors.primary}
              />
              <Text style={styles.sectionLabel}>{group.section}</Text>
            </View>

            <View style={styles.groupCard}>
              {group.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.item,
                    idx !== group.items.length - 1 && styles.itemBorder,
                  ]}
                  activeOpacity={0.7}
                  testID={`setting-${item.id}`}
                >
                  <View style={styles.itemIcon}>
                    <Ionicons name={item.icon} size={18} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  </View>
                  {item.badge ? (
                    <View style={styles.itemBadge}>
                      <Text style={styles.itemBadgeText}>{item.badge}</Text>
                    </View>
                  ) : null}
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.textFaint}
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 110 }} />
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
    fontSize: 38,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -1,
    fontFamily: "Georgia",
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
    maxWidth: "85%",
  },
  bell: {
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
  bellDot: {
    position: "absolute",
    top: 12,
    right: 13,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.red,
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    fontFamily: "Georgia",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textDark,
    letterSpacing: -0.4,
    fontFamily: "Georgia",
  },
  userEmail: { color: Colors.textMuted, fontSize: 12.5, marginTop: 2 },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  planBadgeText: {
    color: Colors.primary,
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  groupBlock: { marginTop: 22 },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    paddingLeft: 4,
  },
  sectionLabel: {
    fontSize: 11.5,
    color: Colors.primary,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  groupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 15.5,
    fontWeight: "700",
    color: Colors.textDark,
  },
  itemSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemBadge: {
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  itemBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
