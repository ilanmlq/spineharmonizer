import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_ICONS: Record<
  string,
  {
    focused: keyof typeof Ionicons.glyphMap;
    outline: keyof typeof Ionicons.glyphMap;
  }
> = {
  index: { focused: "stats-chart", outline: "stats-chart-outline" },
  exercices: { focused: "barbell", outline: "barbell-outline" },
  corset: { focused: "shield", outline: "shield-outline" },
  profile: { focused: "person", outline: "person-outline" },
};

export function LiquidTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: bottom + 1 }]}>
      <BlurView intensity={30} tint="dark" style={styles.blur}>
        <View style={styles.inner}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const { options } = descriptors[route.key];
            const icons = TAB_ICONS[route.name] ?? {
              focused: "ellipse",
              outline: "ellipse-outline",
            };

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.tab}
                accessibilityRole="button"
                accessibilityLabel={options.tabBarAccessibilityLabel}
              >
                {isFocused && <View style={styles.activePill} />}
                <Ionicons
                  name={isFocused ? icons.focused : icons.outline}
                  size={24}
                  color={isFocused ? "#ffffff" : "rgba(255,255,255,0.45)"}
                />
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  blur: {
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 20,
  },
  inner: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  tab: {
    width: 70,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    position: "absolute",
    width: 55,
    height: 42,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.18)",
  },
});
