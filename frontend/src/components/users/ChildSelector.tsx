import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { displayName, User } from "@/type/roles";

interface ChildSelectorProps {
  title: string;
  childrenList: User[];
  selectedChildId?: number | null;
  onSelectChild: (childId: number) => void;
}

export default function ChildSelector({
  title,
  childrenList,
  selectedChildId,
  onSelectChild,
}: ChildSelectorProps) {
  return (
    <View className="bg-surface rounded-3xl p-5 m-2">
      <Text className="text-purpleColor font-black text-xl tracking-wide mb-4">
        {title}
      </Text>
      <View className="flex-row flex-wrap">
        {childrenList.map((child) => (
          <TouchableOpacity
            key={child.id}
            onPress={() => onSelectChild(child.id)}
            className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
              selectedChildId === child.id
                ? "bg-emerald-500 border-emerald-500"
                : "bg-bgColor border-zinc-800"
            }`}
          >
            <Text className="text-white font-bold">{displayName(child)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
