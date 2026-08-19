import React from "react";
import { Image, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import YoutubePlayer from "react-native-youtube-iframe";
import { ExerciseCard, getYouTubeId } from "./exerciseUtils";

interface ExerciseItemProps {
  item: ExerciseCard;
  playerHeight: number;
  playerWidth: number;
}

export default function ExerciseItem({
  item,
  playerHeight,
  playerWidth,
}: ExerciseItemProps) {
  const videoId = getYouTubeId(item.url);

  return (
    <View className="bg-surface rounded-3xl m-2 overflow-hidden">
      <View className="bg-black/50 relative">
        {videoId ? (
          <YoutubePlayer
            height={playerHeight}
            width={playerWidth + 16}
            videoId={videoId}
            play={false}
          />
        ) : item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: playerHeight }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{ height: playerHeight, width: "100%" }}
            className="bg-zinc-900 justify-center items-center"
          >
            <Svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="#6b7280"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </Svg>
          </View>
        )}
      </View>
      <View className="p-5">
        <Text className="text-xl font-bold text-primaryText mb-2">
          {item.name}
        </Text>
        {item.description ? (
          <Text className="text-sm text-secondaryText leading-5 mb-5">
            {item.description}
          </Text>
        ) : null}
        <View className="flex-row flex-wrap gap-2">
          {item.time ? (
            <View className="bg-zinc-800/80 px-3 py-1.5 rounded-lg flex-row items-center border border-zinc-700/50">
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke="#A98CF0" strokeWidth="2" />
                <Path
                  d="M12 6v6l4 2"
                  stroke="#A98CF0"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </Svg>
              <Text className="text-primaryText text-xs font-bold ml-1.5">
                {item.time} min
              </Text>
            </View>
          ) : null}
          {item.sets ? (
            <View className="bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700/50">
              <Text className="text-primaryText text-xs font-bold">
                {item.sets} séries
              </Text>
            </View>
          ) : null}
          {item.repetitions ? (
            <View className="bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700/50">
              <Text className="text-primaryText text-xs font-bold">
                {item.repetitions} reps
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
