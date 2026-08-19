import React, { useCallback } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useFocusEffect } from "expo-router";
import { UserRole } from "@/type/roles";
import { ProgramOnExercise } from "../../type/exercices";
import { useApi } from "@/hooks/useApi";
import { api } from "@/api/client";

interface ExerciseListProps {
  user: UserRole;
  userId: number;
  onViewAll: () => void;
  refreshKey?: number;
}

function isDoneToday(po: ProgramOnExercise): boolean {
  const todayStr = new Date().toDateString();
  const real = po.exerciseRealizations;
  if (!real || real.length === 0) {
    return false;
  }
  return real[0].done;
}

export default function ExerciseList({
  user,
  userId,
  onViewAll,
  refreshKey,
}: ExerciseListProps) {
  const {
    data: programData,
    loading: programLoading,
    refetch: refetchProgram,
  } = useApi<ProgramOnExercise[]>(
    () => api.get(`/program/me/${userId}`),
    [userId, refreshKey],
  );

  useFocusEffect(
    useCallback(() => {
      refetchProgram();
    }, [refetchProgram])
  );

  const exercises: ProgramOnExercise[] = programData ?? [];

  const handleToggleExercise = async (programOnExerciseId: number) => {
    if (user !== "enfant") return;
    try {
      const now = new Date().toISOString();
      await api.get(`/exercice/${programOnExerciseId}/toggle`);
      refetchProgram();
    } catch (error) {}
  };

  const withDoneFlag = exercises.map((ex) => ({
    ...ex,
    isDone: isDoneToday(ex),
  }));

  let sortedExercises = [...withDoneFlag];
  if (user === "parent" || user === "docteur") {
    sortedExercises.sort((a, b) => Number(a.isDone) - Number(b.isDone));
  } else if (user === "enfant") {
    sortedExercises.sort((a, b) => Number(b.isDone) - Number(a.isDone));
  }
  return (
    <View className="bg-surface rounded-3xl p-5 m-2">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-purpleColor font-black text-xl tracking-wide">
          EXERCICES DU JOUR
        </Text>
        <TouchableOpacity
          onPress={onViewAll}
          className="w-9 h-9 bg-secondaryText rounded-xl items-center justify-center border border-zinc-800"
          activeOpacity={0.7}
        >
          <Text className="text-bgColor font-bold text-base -mr-0.5">
            {">"}
          </Text>
        </TouchableOpacity>
      </View>

      {programLoading ? (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <View className="space-y-3">
          {sortedExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              onPress={() => handleToggleExercise(exercise.id)}
              activeOpacity={0.7}
              disabled={user !== "enfant"}
              className={`flex-row items-center justify-between p-4 rounded-2xl border ${
                exercise.isDone
                  ? "bg-bgColor/40 border-zinc-800/50 opacity-60"
                  : "bg-bgColor border-zinc-800"
              }`}
            >
              <View className="flex-1 pr-3">
                <Text
                  className={`font-bold text-base ${
                    exercise.isDone
                      ? "text-zinc-500 line-through"
                      : "text-white"
                  }`}
                >
                  {exercise.exercise?.name ??
                    `Exercice #${exercise.exerciseId}`}
                </Text>
                <Text className="text-secondaryText text-xs mt-1">
                  Conseillé : {exercise.time} min • {exercise.sets} x{" "}
                  {exercise.repetitions} reps
                </Text>
              </View>

              <View
                className={`w-8 h-8 rounded-xl items-center justify-center border-2 ${
                  exercise.isDone
                    ? "bg-green-500 border-green-500"
                    : "border-zinc-700 bg-transparent"
                }`}
              >
                {exercise.isDone && (
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17L4 12"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
