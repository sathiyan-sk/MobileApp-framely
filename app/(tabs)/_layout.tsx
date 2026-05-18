import React, { useCallback } from "react";
import { Alert, Platform, View } from "react-native";
import { Tabs } from "expo-router";

import BottomTabBar from "@/src/components/BottomTabBar";
import { Colors } from "@/src/constants/colors";

export default function TabsLayout() {
  const handleCreate = () => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.alert("Create Event (coming soon)");
      }
    } else {
      Alert.alert("Create Event", "This will open the create-event flow soon.");
    }
  };

  const TabBar = () => <BottomTabBar onCreate={handleCreate} />;

  const renderTabBar = useCallback(() => <TabBar />, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgPink }}>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={renderTabBar}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="events" />
        <Tabs.Screen name="guest" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}