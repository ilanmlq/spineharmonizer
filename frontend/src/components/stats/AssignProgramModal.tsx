import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { api } from "@/api/client";

interface Patient {
  id: number;
  username: string;
  prescription?: {
    id: number;
  };
  corset?: {
    id: number;
  } | null;
}

interface Exercise {
  id: number;
  name: string;
  description: string;
}

interface ProgramExerciseInput {
  exerciseId: number;
  name: string;
  sets: string;
  repetitions: string;
  time: string;
}

interface AssignProgramModalProps {
  visible: boolean;
  patient: Patient | null;
  doctorId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignProgramModal({
  visible,
  patient,
  doctorId,
  onClose,
  onSuccess,
}: AssignProgramModalProps) {
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loadingExo, setLoadingExo] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assigningCorset, setAssigningCorset] = useState(false);

  const [selectedExercises, setSelectedExercises] = useState<ProgramExerciseInput[]>([]);

  useEffect(() => {
    if (visible) {
      fetchExercisesAndProgram();
    }
  }, [visible, patient?.id]);

  async function fetchExercisesAndProgram() {
    setLoadingExo(true);
    try {
      const [exercisesResponse, programResponse] = await Promise.all([
        api.get("/exercice/"),
        patient?.id ? api.get(`/program/me/${patient.id}`).catch(() => []) : Promise.resolve([]),
      ]);
      setAvailableExercises(exercisesResponse as Exercise[]);
      setSelectedExercises(
        ((programResponse as any[]) ?? []).map((poe) => ({
          exerciseId: poe.exerciseId,
          name: poe.exercise?.name ?? `Exercice #${poe.exerciseId}`,
          sets: String(poe.sets ?? 1),
          repetitions: String(poe.repetitions ?? 1),
          time: String(poe.time ?? 1),
        })),
      );
    } catch (error) {
      console.error("Error fetching exercises:", error);
      Alert.alert("Erreur", "Impossible de charger les exercices.");
    } finally {
      setLoadingExo(false);
    }
  }

  const handleAddExercise = (exo: Exercise) => {
    if (selectedExercises.find((e) => e.exerciseId === exo.id)) return;
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: exo.id,
        name: exo.name,
        sets: "3",
        repetitions: "10",
        time: "5",
      },
    ]);
  };

  const handleRemoveExercise = (id: number) => {
    setSelectedExercises(selectedExercises.filter((e) => e.exerciseId !== id));
  };

  const updateExercise = (id: number, field: keyof ProgramExerciseInput, value: string) => {
    setSelectedExercises(
      selectedExercises.map((e) => (e.exerciseId === id ? { ...e, [field]: value } : e))
    );
  };

  const handleSubmit = async () => {
    if (!patient) return;
    if (!patient.prescription) {
      Alert.alert("Erreur", "Le patient n'a pas de prescription active.");
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un exercice.");
      return;
    }

    setSubmitting(true);
    try {
      const programData = {
        patientId: patient.id,
        doctorId: doctorId,
        prescriptionId: patient.prescription.id,
        name: `Programme pour ${patient.username}`,
        description: "Programme d'exercices personnalisé.",
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        exercises: selectedExercises.map((e) => ({
          exerciseId: e.exerciseId,
          sets: parseInt(e.sets) || 1,
          repetitions: parseInt(e.repetitions) || 1,
          time: parseInt(e.time) || 1,
        })),
      };

      await api.post("/program/", programData);
      Alert.alert("Succès", "Le programme a été mis à jour.");
      onSuccess();
    } catch (error) {
      console.error("Error assigning program:", error);
      Alert.alert("Erreur", "Impossible d'assigner le programme.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignCorset = async () => {
    if (!patient) return;
    setAssigningCorset(true);
    try {
      await api.post("/corset/", { patientId: patient.id });
      Alert.alert("Succès", "Le corset a été assigné au patient.");
    } catch (error: any) {
      console.error("Error assigning corset:", error);
      Alert.alert("Erreur", error.message || "Impossible d'assigner le corset.");
    } finally {
      setAssigningCorset(false);
    }
  };

  if (!patient) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-surface h-5/6 rounded-t-3xl p-5 border-t border-zinc-800">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-bold text-lg">
              Assigner un programme à {patient.username}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-rose-500 font-bold">Fermer</Text>
            </TouchableOpacity>
          </View>

          {loadingExo ? (
            <ActivityIndicator size="large" color="#10b981" className="mt-10" />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-secondaryText mb-2 font-bold">Exercices sélectionnés :</Text>
              {selectedExercises.length === 0 && (
                <Text className="text-zinc-500 text-sm italic mb-4">
                  Aucun exercice sélectionné.
                </Text>
              )}
              {selectedExercises.map((exo) => (
                <View key={exo.exerciseId} className="bg-bgColor border border-zinc-800 rounded-xl p-3 mb-3">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-bold flex-1">{exo.name}</Text>
                    <TouchableOpacity onPress={() => handleRemoveExercise(exo.exerciseId)}>
                      <Text className="text-rose-500 text-xs font-bold">Retirer</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row justify-between">
                    <View className="flex-1 mr-2">
                      <Text className="text-secondaryText text-xs mb-1">Séries</Text>
                      <TextInput
                        className="bg-zinc-800 text-white rounded-lg p-2 text-center"
                        keyboardType="numeric"
                        value={exo.sets}
                        onChangeText={(t) => updateExercise(exo.exerciseId, "sets", t)}
                      />
                    </View>
                    <View className="flex-1 mr-2">
                      <Text className="text-secondaryText text-xs mb-1">Répétitions</Text>
                      <TextInput
                        className="bg-zinc-800 text-white rounded-lg p-2 text-center"
                        keyboardType="numeric"
                        value={exo.repetitions}
                        onChangeText={(t) => updateExercise(exo.exerciseId, "repetitions", t)}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-secondaryText text-xs mb-1">Temps (min)</Text>
                      <TextInput
                        className="bg-zinc-800 text-white rounded-lg p-2 text-center"
                        keyboardType="numeric"
                        value={exo.time}
                        onChangeText={(t) => updateExercise(exo.exerciseId, "time", t)}
                      />
                    </View>
                  </View>
                </View>
              ))}

              <Text className="text-secondaryText mt-4 mb-2 font-bold">Ajouter un exercice :</Text>
              <View className="flex-row flex-wrap">
                {availableExercises.map((exo) => {
                  const isSelected = selectedExercises.some((e) => e.exerciseId === exo.id);
                  if (isSelected) return null;
                  return (
                    <TouchableOpacity
                      key={exo.id}
                      onPress={() => handleAddExercise(exo)}
                      className="bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 mr-2 mb-2"
                    >
                      <Text className="text-white text-sm">+ {exo.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                className={`mt-8 py-4 rounded-xl items-center justify-center ${
                  submitting ? "bg-emerald-500/50" : "bg-emerald-500"
                }`}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">Valider le programme</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleAssignCorset}
                disabled={assigningCorset}
                className={`mt-4 py-4 rounded-xl items-center justify-center border border-emerald-500 ${
                  assigningCorset ? "bg-zinc-800/50" : "bg-transparent"
                }`}
              >
                {assigningCorset ? (
                  <ActivityIndicator size="small" color="#10b981" />
                ) : (
                  <Text className="text-emerald-500 font-bold text-base">Assigner un corset</Text>
                )}
              </TouchableOpacity>
              <View className="h-10" />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
