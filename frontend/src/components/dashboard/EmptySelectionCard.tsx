import React from "react";
import { Text, View } from "react-native";

export default function EmptySelectionCard() {
  return (
    <View className="bg-surface rounded-3xl p-5 m-2">
      <Text className="text-secondaryText text-center">
        Aucun enfant sélectionné.
      </Text>
    </View>
  );
}
