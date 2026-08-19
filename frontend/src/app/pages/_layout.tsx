import { Tabs, Redirect } from "expo-router";
import { Platform, ActivityIndicator, View } from "react-native";
import { LiquidTabBar } from "@/components/liquid-tab-bar";
import { useAuth } from "@/context/authContext";

export default function TabsLayout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if(!isAuthenticated) {
  return <Redirect href="/auth/login" />;
}

  return (
    <Tabs
      tabBar={(props) => <LiquidTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.OS === "web" ? undefined : { display: "none" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Index" }} />
      <Tabs.Screen name="exercices" options={{ title: "Exercices" }} />
      <Tabs.Screen name="corset" options={{ title: "Corset" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}