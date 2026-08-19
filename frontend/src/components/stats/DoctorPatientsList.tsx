import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { api } from "@/api/client";

export interface Patient {
  id: number;
  username: string;
  prescription?: {
    id: number;
  };
  corset?: {
    id: number;
  } | null;
}

interface Props {
  doctorId: number;
  onPatientClick: (patient: Patient) => void;
}

export default function DoctorPatientsList({ doctorId, onPatientClick }: Props) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await api.get(`/users/patients/${doctorId}`);
        setPatients(response as Patient[]);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, [doctorId]);

  if (loading) {
    return (
      <View className="bg-surface rounded-3xl p-5 m-2 items-center justify-center">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View className="bg-surface rounded-3xl p-5 m-2">
      <Text className="text-purpleColor font-black text-xl tracking-wide mb-4">
        MES PATIENTS
      </Text>
      {patients.length === 0 ? (
        <Text className="text-secondaryText text-center">Aucun patient trouvé.</Text>
      ) : (
        <View className="space-y-3">
          {patients.map((patient) => (
            <TouchableOpacity 
              key={patient.id} 
              onPress={() => onPatientClick(patient)}
              className="flex-row items-center justify-between p-4 rounded-2xl border bg-bgColor border-zinc-800"
            >
              <Text className="font-bold text-base text-white">
                {patient.username}
              </Text>
              <Text className="text-secondaryText text-xs">{">"}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
