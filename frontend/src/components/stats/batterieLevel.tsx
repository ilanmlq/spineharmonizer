import React from "react";
import { Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

function getBatteryColor(level: number) {
  if (level > 50) return "#22c55e";
  if (level > 20) return "#eab308";
  return "#ef4444";
}

export default function BatteryIcon({ level }: { level: { battery: number } }) {
  const value = Math.max(0, Math.min(100, level.battery));

  const color = getBatteryColor(value);
  const innerWidth = (value / 100) * 24;

  return (
    <View className="flex-row items-center bg-zinc-900/50 px-3 py-1.5 rounded-full border border-surface">
      <Svg width="34" height="18" viewBox="0 0 34 18">
        <Rect
          x="1"
          y="1"
          width="28"
          height="16"
          rx="3"
          fill="transparent"
          stroke={color}
          strokeWidth="2"
        />
        <Rect x="30" y="5" width="2" height="8" rx="1" fill={color} />
        <Rect
          x="3"
          y="3"
          width={innerWidth}
          height="12"
          rx="1.5"
          fill={color}
        />
      </Svg>

      <Text className="text-sm font-bold font-mono ml-2" style={{ color }}>
        {value}%
      </Text>
    </View>
  );
}
