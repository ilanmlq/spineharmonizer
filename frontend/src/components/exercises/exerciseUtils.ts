import { User } from "@/type/roles";

export type ExerciseCard = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  url?: string;
  time?: number;
  sets?: number;
  repetitions?: number;
};

export type ExerciseFormState = {
  name: string;
  description: string;
  image: string;
  url: string;
};

export function getYouTubeId(url?: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function childrenOf(user: User | null) {
  return user?.children ?? user?.patients ?? [];
}

export const DEFAULT_EXERCISE_FORM: ExerciseFormState = {
  name: "",
  description: "",
  image: "https://placehold.co/800x450/png",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};
