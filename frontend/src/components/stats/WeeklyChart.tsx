import React from "react";
import { Text, View } from "react-native";
import Svg, { Line } from "react-native-svg";

interface WeeklyChartProps {
  weeklyData: Array<{ day: string; duration: number; isToday?: boolean }>;
  targetTime: number;
  formatTime: (mins: number) => string;
}

export default function WeeklyChart({
  weeklyData,
  targetTime,
  formatTime,
}: WeeklyChartProps) {
  const maxChartHeight = 100;
  const targetChartHeight = 75;

  const completedDays = weeklyData.filter(
    (item) => item.duration > 0 || item.isToday,
  );
  const averageMinutes =
    completedDays.length > 0
      ? weeklyData.reduce((acc, item) => acc + item.duration, 0) /
        completedDays.length
      : 0;
  const averageInHours = (averageMinutes / 60).toFixed(1);

  return (
    <View className="bg-surface rounded-3xl p-5 m-2">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-primaryText font-bold text-lg">
          Port quotidien
        </Text>
        <Text className="text-secondaryText text-xs font-medium">
          moy. {averageInHours} h / j
        </Text>
      </View>

      <View className="relative px-1">
        <View
          className="absolute left-0 right-0 flex-row items-center justify-between"
          style={{ bottom: targetChartHeight + 20 }}
        >
          <View className="flex-1 mr-2">
            <Svg height="2" width="100%">
              <Line
                x1="0"
                y1="0"
                x2="100%"
                y2="0"
                stroke="#3f3f46"
                strokeWidth="2"
                strokeDasharray="4, 4"
              />
            </Svg>
          </View>
          <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
            Obj. {formatTime(targetTime)}
          </Text>
        </View>

        <View className="flex-row justify-between items-end h-28">
          {weeklyData.map((item, index) => {
            const minutes = Number(item.duration);
            let calculatedHeight = (minutes / targetTime) * targetChartHeight;
            if (calculatedHeight > maxChartHeight)
              calculatedHeight = maxChartHeight;

            let blockColor = "bg-bgColor";
            if (minutes > 0) {
              blockColor = minutes >= targetTime ? "bg-bgGreen" : "bg-bgYellow";
            }
            const textColor = item.isToday
              ? "text-greenText font-black"
              : "text-secondaryText";

            return (
              <View
                key={index}
                className="items-center flex-1 mx-1 justify-end h-full"
              >
                <View
                  style={{ height: Math.max(calculatedHeight, 4) }}
                  className={`w-full rounded-xl ${blockColor}`}
                />
                <Text className={`text-xs mt-2 font-bold ${textColor}`}>
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
