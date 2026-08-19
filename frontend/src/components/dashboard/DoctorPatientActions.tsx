import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Patient } from "@/components/stats/DoctorPatientsList";

interface DoctorPatientActionsProps {
  patient: Patient;
  assigningCorset: boolean;
  onOpenProgramModal: () => void;
  onOpenSettingsModal: () => void;
  onAssignNewCorset: () => void;
  onBackToPatients: () => void;
}

export default function DoctorPatientActions({
  patient,
  assigningCorset,
  onOpenProgramModal,
  onOpenSettingsModal,
  onAssignNewCorset,
  onBackToPatients,
}: DoctorPatientActionsProps) {
  return (
    <View className="px-4 mt-4 mb-2">
      <TouchableOpacity
        onPress={onOpenProgramModal}
        className="w-full py-4 rounded-xl items-center justify-center bg-emerald-500 mb-3"
      >
        <Text className="text-white text-base font-bold">
          METTRE À JOUR LES EXERCICES
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onOpenSettingsModal}
        className="w-full py-4 rounded-xl items-center justify-center mb-3 border border-emerald-500 bg-transparent"
      >
        <Text className="text-emerald-500 text-base font-bold">
          PARAMÈTRES DU CORSET
        </Text>
      </TouchableOpacity>
      {patient.corset && (
        <TouchableOpacity
          onPress={onAssignNewCorset}
          disabled={assigningCorset}
          className={`w-full py-4 rounded-xl items-center justify-center mb-3 border border-emerald-500 ${
            assigningCorset ? "bg-zinc-800/50" : "bg-transparent"
          }`}
        >
          {assigningCorset ? (
            <ActivityIndicator size="small" color="#10b981" />
          ) : (
            <Text className="text-emerald-500 text-base font-bold">
              ASSIGNER UN NOUVEAU CORSET
            </Text>
          )}
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={onBackToPatients}
        className="w-full py-4 rounded-xl items-center justify-center bg-zinc-800"
      >
        <Text className="text-white text-base font-bold">
          RETOUR AUX PATIENTS
        </Text>
      </TouchableOpacity>
    </View>
  );
}
