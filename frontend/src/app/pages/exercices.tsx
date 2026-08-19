import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useApi } from "@/hooks/useApi";
import { api } from "@/api/client";
import { normalizeRole, User } from "@/type/roles";
import ExercisesContent from "@/components/exercises/ExercisesContent";
import ExercisesHeader from "@/components/exercises/ExercisesHeader";
import {
  childrenOf,
  DEFAULT_EXERCISE_FORM,
  ExerciseCard,
} from "@/components/exercises/exerciseUtils";

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newExercise, setNewExercise] = useState(DEFAULT_EXERCISE_FORM);

  const {
    data: user,
    loading: userLoading,
    refetch: refetchUser,
  } = useApi<User>(() => api.get("/users/me"), []);
  const role = normalizeRole(user?.role);
  const children = childrenOf(user);

  useEffect(() => {
    if (role === "parent" && children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, role, selectedChildId]);

  const selectedChild = useMemo(
    () => children.find((child) => child.id === selectedChildId) ?? children[0] ?? null,
    [children, selectedChildId],
  );
  const targetUserId = role === "parent" ? selectedChild?.id : user?.id;

  const {
    data: programData,
    loading: programLoading,
    error: programError,
    refetch: refetchProgram,
  } = useApi<any[] | null>(
    () => {
      if (role === "docteur" || !targetUserId) return Promise.resolve(null);
      return api.get<any[]>(`/program/me/${targetUserId}`).catch(() => []);
    },
    [targetUserId, role],
  );

  const {
    data: allExercises,
    loading: allExercisesLoading,
    error: allExercisesError,
    refetch: refetchAllExercises,
  } = useApi<ExerciseCard[] | null>(
    () => (role === "docteur" ? api.get("/exercice/") : Promise.resolve(null)),
    [role],
  );

  useFocusEffect(
    useCallback(() => {
      refetchUser();
      if (role === "docteur") refetchAllExercises();
      else refetchProgram();
    }, [refetchAllExercises, refetchProgram, refetchUser, role]),
  );

  const exercises: ExerciseCard[] =
    role === "docteur"
      ? allExercises ?? []
      : programData
        ? programData.map((poe) => ({
            ...poe.exercise,
            id: poe.exercise?.id ?? poe.exerciseId,
            programOnExerciseId: poe.id,
            time: poe.time,
            sets: poe.sets,
            repetitions: poe.repetitions,
          }))
        : [];

  const screenWidth = Dimensions.get("window").width;
  const playerWidth = screenWidth - 48;
  const playerHeight = (playerWidth * 9) / 16;
  const isLoading =
    userLoading ||
    (role === "docteur" ? allExercisesLoading : programLoading && !!targetUserId);
  const error = role === "docteur" ? allExercisesError : programError;

  async function handleCreateExercise() {
    if (!newExercise.name.trim() || !newExercise.description.trim()) {
      Alert.alert("Erreur", "Le nom et la description sont obligatoires.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/exercice/", {
        name: newExercise.name.trim(),
        description: newExercise.description.trim(),
        image: newExercise.image.trim(),
        url: newExercise.url.trim(),
      });
      setNewExercise(DEFAULT_EXERCISE_FORM);
      refetchAllExercises();
      Alert.alert("Succès", "L'exercice a été ajouté.");
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Impossible d'ajouter l'exercice.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-bgColor">
        <ActivityIndicator size="large" color="#A98CF0" />
        <Text className="text-secondaryText mt-4 font-medium">
          Chargement des exercices...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bgColor">
      <ExercisesHeader topInset={insets.top} />

      <View style={{ paddingTop: insets.top + 80 }} className="flex-1">
        {error ? (
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-rose-500 font-bold text-lg text-center">
              Erreur lors du chargement des exercices.
            </Text>
          </View>
        ) : (
          <ExercisesContent
            role={role}
            exercises={exercises}
            childrenList={children}
            selectedChildId={selectedChild?.id}
            playerHeight={playerHeight}
            playerWidth={playerWidth}
            newExercise={newExercise}
            submitting={submitting}
            onSelectChild={setSelectedChildId}
            onChangeNewExercise={setNewExercise}
            onCreateExercise={handleCreateExercise}
          />
        )}
      </View>
    </View>
  );
}
