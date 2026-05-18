import { Redirect } from "expo-router";

// Entry point — send users straight to the Home tab.
export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
