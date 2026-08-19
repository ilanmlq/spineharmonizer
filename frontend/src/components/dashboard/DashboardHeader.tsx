import React from "react";
import { Text, View } from "react-native";
import { displayName, User, UserRole } from "@/type/roles";
import BatteryIcon from "@/components/stats/batterieLevel";
import { Patient } from "@/components/stats/DoctorPatientsList";
import { displayDate } from "./dashboardUtils";

interface DashboardHeaderProps {
  topInset: number;
  role: UserRole;
  user: User;
  viewingPatient: Patient | null;
  batteryLevel: { battery: number } | null;
  showBattery: boolean;
}

function getGreeting(role: UserRole) {
  if (role === "parent") return "Bonjour";
  if (role === "docteur") return "Bonjour, Docteur";
  return "Salut";
}

export default function DashboardHeader({
  topInset,
  role,
  user,
  viewingPatient,
  batteryLevel,
  showBattery,
}: DashboardHeaderProps) {
  return (
    <View
      style={{ paddingTop: topInset + 16 }}
      className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pb-3 border-b border-surface bg-bgColor/95 z-50"
    >
      <View className="flex-1 pr-3">
        <Text className="text-xl text-secondaryText">{displayDate()}</Text>
        <Text className="text-2xl font-bold text-primaryText">
          {role === "docteur" && viewingPatient
            ? `Dossier: ${displayName(viewingPatient)}`
            : `${getGreeting(role)}, ${displayName(user)}`}
        </Text>
      </View>
      {showBattery && batteryLevel && <BatteryIcon level={batteryLevel} />}
    </View>
  );
}
