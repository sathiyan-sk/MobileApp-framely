import { Colors } from "@/src/constants/colors";
import { BOTTOM_NAV } from "@/src/constants/layout";
import { useScroll } from "@/src/context/ScrollContext";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  route: string;
};

const TABS: { left: TabItem[]; right: TabItem[] } = {
  left: [
    { key: "home", label: "Home", icon: "home-outline", iconActive: "home", route: "/(tabs)/home" },
    { key: "events", label: "Events", icon: "calendar-outline", iconActive: "calendar", route: "/(tabs)/events" },
  ],
  right: [
    { key: "guest", label: "Guest", icon: "person-outline", iconActive: "person", route: "/(tabs)/guest" },
    { key: "settings", label: "Settings", icon: "settings-outline", iconActive: "settings", route: "/(tabs)/settings" },
  ],
};

const TabButton = ({ item, active, onPress }: { item: TabItem; active: boolean; onPress: () => void }) => (
  <TouchableOpacity style={styles.tabBtn} onPress={onPress} activeOpacity={0.7} testID={`tab-${item.key}`}>
    <Ionicons name={active ? item.iconActive : item.icon} size={22} color={active ? Colors.primary : "#9AA0A6"} />
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text>
  </TouchableOpacity>
);

export default function BottomTabBar({ onCreate }: { onCreate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { isNavBarVisible } = useScroll();
  const translateY = useRef(new Animated.Value(0)).current;
  const isActive = (route: string) => pathname.includes(route.split("/").pop()!);
  const go = (route: string) => router.push(route as Parameters<typeof router.push>[0]);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isNavBarVisible ? 0 : 120,
      useNativeDriver: true,
      friction: 10,
      tension: 80,
    }).start();
  }, [isNavBarVisible, translateY]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          transform: [{ translateY }],
        },
      ]}
      testID="bottom-tab-bar"
    >
      <View style={styles.bar}>
        {TABS.left.map((t) => (
          <TabButton key={t.key} item={t} active={isActive(t.route)} onPress={() => go(t.route)} />
        ))}

        {/* Center FAB — now inline inside the bar, perfectly centered */}
        <TouchableOpacity
          style={styles.fab}
          onPress={onCreate}
          activeOpacity={0.85}
          testID="tab-create-fab"
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {TABS.right.map((t) => (
          <TabButton key={t.key} item={t} active={isActive(t.route)} onPress={() => go(t.route)} />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: BOTTOM_NAV.HORIZONTAL_PADDING,
    backgroundColor: Colors.bgPink,
  },
  bar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: BOTTOM_NAV.BORDER_RADIUS,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
    color: "#9AA0A6",
    fontWeight: "500",
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
  // FAB is now inline — same width as a spacer, centered within the bar row
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOpacity: 0.45,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 10 },
    }),
  },
});