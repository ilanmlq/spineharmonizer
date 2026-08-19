import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import ProgressRing from "@/components/stats/ProgressRing";
import WeeklyChart from "@/components/stats/WeeklyChart";
import { formatTime } from "./dashboardUtils";

interface PatientMetricsProps {
  complianceLoading: boolean;
  currentMinutes: number;
  weeklyLoading: boolean;
  weeklyData: Array<{ day: string; duration: number; isToday?: boolean }>;
}

export default function PatientMetrics({
  complianceLoading,
  currentMinutes,
  weeklyLoading,
  weeklyData,
}: PatientMetricsProps) {
  return (
    <>
      {complianceLoading ? (
        <ActivityIndicator className="py-10" />
      ) : (
        <ProgressRing
          currentMinutes={currentMinutes}
          targetMinutes={620}
          formatTime={(m) => `${Math.floor(m / 60)}h${Math.floor(m % 60)}m`}
        />
      )}

      {weeklyLoading ? (
        <View className="bg-surface rounded-3xl p-5 m-2 h-44 items-center justify-center">
          <ActivityIndicator size="small" color="#10b981" />
          <Text className="text-secondaryText mt-2 text-xs">
            Chargement de la semaine...
          </Text>
        </View>
      ) : (
        <WeeklyChart weeklyData={weeklyData} targetTime={620} formatTime={formatTime} />
      )}
    </>
  );
}
