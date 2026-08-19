import React from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ExerciseFormState } from "./exerciseUtils";

interface DoctorExerciseFormProps {
  exercise: ExerciseFormState;
  submitting: boolean;
  onChange: (exercise: ExerciseFormState) => void;
  onSubmit: () => void;
}

export default function DoctorExerciseForm({
  exercise,
  submitting,
  onChange,
  onSubmit,
}: DoctorExerciseFormProps) {
  return (
    <View className="bg-surface rounded-3xl m-2 p-5">
      <Text className="text-purpleColor font-black text-xl mb-4">
        AJOUTER UN EXERCICE
      </Text>
      <TextInput
        className="bg-bgColor text-white rounded-xl p-3 mb-3 border border-zinc-800"
        placeholder="Nom"
        placeholderTextColor="#71717a"
        value={exercise.name}
        onChangeText={(name) => onChange({ ...exercise, name })}
      />
      <TextInput
        className="bg-bgColor text-white rounded-xl p-3 mb-3 border border-zinc-800"
        placeholder="Description"
        placeholderTextColor="#71717a"
        value={exercise.description}
        onChangeText={(description) => onChange({ ...exercise, description })}
        multiline
      />
      <TextInput
        className="bg-bgColor text-white rounded-xl p-3 mb-3 border border-zinc-800"
        placeholder="Image URL"
        placeholderTextColor="#71717a"
        value={exercise.image}
        onChangeText={(image) => onChange({ ...exercise, image })}
      />
      <TextInput
        className="bg-bgColor text-white rounded-xl p-3 mb-4 border border-zinc-800"
        placeholder="Video URL"
        placeholderTextColor="#71717a"
        value={exercise.url}
        onChangeText={(url) => onChange({ ...exercise, url })}
      />
      <TouchableOpacity
        onPress={onSubmit}
        disabled={submitting}
        className={`py-4 rounded-xl items-center ${
          submitting ? "bg-emerald-500/50" : "bg-emerald-500"
        }`}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white font-bold">AJOUTER</Text>
        )}
      </TouchableOpacity>
      <Text className="text-secondaryText font-bold mt-6">
        Tous les exercices
      </Text>
    </View>
  );
}
