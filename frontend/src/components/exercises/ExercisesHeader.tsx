import React from "react";
import { Text, View } from "react-native";

interface ExercisesHeaderProps {
  topInset: number;
}

export default function ExercisesHeader({ topInset }: ExercisesHeaderProps) {
  return (
    <View
      style={{ paddingTop: topInset + 16 }}
      className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pb-3 border-b border-surface bg-bgColor/95 z-50"
    >
      <Text className="text-3xl font-bold text-primaryText">Exercices</Text>
    </View>
  );
}
