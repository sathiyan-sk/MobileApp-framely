import React from "react";
import PlaceholderScreen from "@/src/screens/PlaceholderScreen";

// Analytics is not part of the current scope — kept as a safe placeholder so
// navigation from Settings doesn't crash. Full Analytics dashboard is on
// the roadmap once the backend is wired up.
export default function AnalyticsRoute() {
  return (
    <PlaceholderScreen
      title="Analytics"
      subtitle="Detailed analytics arrive with the backend rollout."
      icon="stats-chart-outline"
    />
  );
}