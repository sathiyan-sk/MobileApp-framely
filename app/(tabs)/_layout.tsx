import { Tabs, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";

import BottomTabBar from "@/src/components/BottomTabBar";
import { Colors } from "@/src/constants/colors";
import { ScrollProvider } from "@/src/context/ScrollContext";

export default function TabsLayout() {
  const router = useRouter();

  const handleCreate = useCallback(() => {
    router.push("/(tabs)/newEvent");
  }, [router]);

  const renderTabBar = useCallback(
    () => <BottomTabBar onCreate={handleCreate} />,
    [handleCreate],
  );

  return (
    <ScrollProvider>
      <View style={{ flex: 1, backgroundColor: Colors.bgPink }}>
        <Tabs screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
          {/* Tabs visible in the bottom bar */}
          <Tabs.Screen name="home" />
          <Tabs.Screen name="events" />
          <Tabs.Screen name="guest" />
        <Tabs.Screen name="settings" />

        {/* Hidden screens — navigable, but not shown in the tab bar */}
        <Tabs.Screen name="newEvent" options={{ href: null }} />
        <Tabs.Screen name="choose-template" options={{ href: null }} />
        <Tabs.Screen name="edit-profile" options={{ href: null }} />
        <Tabs.Screen name="plan" options={{ href: null }} />
        <Tabs.Screen name="branding" options={{ href: null }} />
        <Tabs.Screen name="analytics" options={{ href: null }} />
        <Tabs.Screen name="select-photos" options={{ href: null }} />
      </Tabs>
    </View>
    </ScrollProvider>
  );
}
