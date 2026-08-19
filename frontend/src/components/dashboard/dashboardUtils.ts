import { User } from "@/type/roles";

export function displayDate() {
  const d = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return d.charAt(0).toUpperCase() + d.slice(1);
}

export function getISODate(d = new Date()) {
  return d.toISOString().split("T")[0];
}

export function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return `${hours}h ${minutes < 10 ? "0" : ""}${minutes}`;
}

export function getCurrentWeekDates() {
  const today = new Date();
  const currentDay = today.getDay();
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  const weekDates = [];
  const dayNames = ["D", "L", "M", "M", "J", "V", "S"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateString = getISODate(d);

    weekDates.push({
      date: dateString,
      day: dayNames[d.getDay()],
      isToday: dateString === getISODate(today),
    });
  }
  return weekDates;
}

export function childrenOf(user: User | null) {
  return user?.children ?? user?.patients ?? [];
}
