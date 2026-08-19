import React from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { User } from "@/type/roles";
import ChildSelector from "@/components/users/ChildSelector";
import DoctorExerciseForm from "./DoctorExerciseForm";
import ExerciseItem from "./ExerciseItem";
import { ExerciseCard, ExerciseFormState } from "./exerciseUtils";

interface ExercisesContentProps {
  role: "parent" | "enfant" | "docteur";
  exercises: ExerciseCard[];
  childrenList: User[];
  selectedChildId?: number | null;
  playerHeight: number;
  playerWidth: number;
  newExercise: ExerciseFormState;
  submitting: boolean;
  onSelectChild: (childId: number) => void;
  onChangeNewExercise: (exercise: ExerciseFormState) => void;
  onCreateExercise: () => void;
}

export default function ExercisesContent({
  role,
  exercises,
  childrenList,
  selectedChildId,
  playerHeight,
  playerWidth,
  newExercise,
  submitting,
  onSelectChild,
  onChangeNewExercise,
  onCreateExercise,
}: ExercisesContentProps) {
  if (role === "docteur") {
    return (
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <DoctorExerciseForm
            exercise={newExercise}
            submitting={submitting}
            onChange={onChangeNewExercise}
            onSubmit={onCreateExercise}
          />
        }
        renderItem={({ item }) => (
          <ExerciseItem
            item={item}
            playerHeight={playerHeight}
            playerWidth={playerWidth}
          />
        )}
      />
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {role === "parent" && (
        <ChildSelector
          title="ENFANT"
          childrenList={childrenList}
          selectedChildId={selectedChildId}
          onSelectChild={onSelectChild}
        />
      )}
      {exercises.length === 0 ? (
        <View className="bg-surface rounded-3xl m-2 p-5">
          <Text className="text-secondaryText text-center">
            Aucun exercice assigné.
          </Text>
        </View>
      ) : (
        exercises.map((item) => (
          <ExerciseItem
            key={item.id}
            item={item}
            playerHeight={playerHeight}
            playerWidth={playerWidth}
          />
        ))
      )}
    </ScrollView>
  );
}
