import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CorsetToggleBarProps {
  bottomInset: number;
  isUpdating: boolean;
  localState: string | null;
  onToggle: () => void;
}

export default function CorsetToggleBar({
  bottomInset,
  isUpdating,
  localState,
  onToggle,
}: CorsetToggleBarProps) {
  return (
    <View
      style={{ paddingBottom: bottomInset + 16 }}
      className="absolute bottom-12 left-0 right-0 px-4 pt-4 border-t border-surface bg-bgColor/95 z-50"
    >
      <TouchableOpacity
        disabled={isUpdating}
        onPress={onToggle}
        className={`w-full py-4 rounded-xl items-center justify-center ${
          localState === "WORN" ? "bg-rose-500" : "bg-emerald-500"
        } ${isUpdating ? "opacity-50" : ""}`}
      >
        <Text className="text-white font-bold">
          {isUpdating
            ? "MISE À JOUR..."
            : localState === "WORN"
              ? "JE NE PORTE PAS LE CORSET"
              : "JE PORTE LE CORSET"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
