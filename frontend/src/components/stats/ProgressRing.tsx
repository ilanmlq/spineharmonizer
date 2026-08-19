import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ProgressRingProps {
  currentMinutes: number;
  targetMinutes: number;
  formatTime: (mins: number) => string;
}

export default function ProgressRing({
  currentMinutes,
  targetMinutes,
  formatTime,
}: ProgressRingProps) {
  const safeTarget = targetMinutes > 0 ? targetMinutes : 1;

  const percentage = Math.min(
    Math.round((currentMinutes / safeTarget) * 100),
    100,
  );

  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const remaining = targetMinutes - currentMinutes;
  const isCompleted = remaining <= 0;

  return (
    <View className="bg-surface rounded-3xl p-5 m-2 flex-row items-center justify-between">
      {/* RING */}
      <View className="justify-center items-center">
        <Svg
          width={(radius + strokeWidth) * 2}
          height={(radius + strokeWidth) * 2}
        >
          {/* Background circle */}
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#15181E"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress circle */}
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={isCompleted ? "#22c55e" : "#22c55e"}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}
          />
        </Svg>

        {/* Center text */}
        <View className="absolute items-center justify-center">
          <Text className="text-primaryText font-black text-xl tracking-tight">
            {formatTime(currentMinutes)}
          </Text>
          <Text className="text-secondaryText text-xs font-semibold mt-0.5">
            / {formatTime(targetMinutes)}
          </Text>
        </View>
      </View>

      {/* TEXT INFO */}
      <View className="flex-1 pl-5 justify-center">
        <Text className="text-primaryText text-lg font-bold">
          Durée de port
        </Text>

        <Text className="text-secondaryText mt-1">
          Corset porté aujourd’hui : {formatTime(currentMinutes)}
        </Text>

        {!isCompleted ? (
          <Text className="text-secondaryText text-base mt-3">
            Encore{" "}
            <Text className="text-primaryText font-bold">
              {formatTime(remaining)}
            </Text>{" "}
            pour atteindre l’objectif
          </Text>
        ) : (
          <Text className="text-emerald-500 text-base mt-3 font-semibold">
            Objectif atteint pour aujourd’hui
          </Text>
        )}
      </View>
    </View>
  );
}
