import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { api } from "@/api/client";

interface CorsetSettingsModalProps {
  visible: boolean;
  corsetId: number | null;
  patientId?: number;
  onClose: () => void;
  onSuccess?: (newCorsetId?: number) => void;
}

export default function CorsetSettingsModal({
  visible,
  corsetId,
  patientId,
  onClose,
  onSuccess,
}: CorsetSettingsModalProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [settings, setSettings] = useState({
    subAuxiliary: "",
    lumbar: "",
    thoracic: "",
    trochanter: "",
  });

  useEffect(() => {
    if (visible) {
      if (corsetId) {
        fetchSettings();
      } else {
        setSettings({ subAuxiliary: "", lumbar: "", thoracic: "", trochanter: "" });
        setLoading(false);
      }
    }
  }, [visible, corsetId]);

  async function fetchSettings() {
    setLoading(true);
    try {
      const response = await api.get(`/corset-settings/${corsetId}`) as any;
      if (response) {
        const latest = Array.isArray(response) ? response[0] : response;
        setSettings({
          subAuxiliary: String(latest.subAuxiliary || 0),
          lumbar: String(latest.lumbar || 0),
          thoracic: String(latest.thoracic || 0),
          trochanter: String(latest.trochanter || 0),
        });
      }
    } catch (error) {
      console.error("Error fetching corset settings:", error);
      Alert.alert("Erreur", "Impossible de charger les paramètres.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async () => {
    if (!corsetId && !patientId) return;

    if (
      settings.subAuxiliary === "" ||
      settings.lumbar === "" ||
      settings.thoracic === "" ||
      settings.trochanter === ""
    ) {
      Alert.alert("Erreur", "Veuillez remplir toutes les valeurs.");
      return;
    }

    setSubmitting(true);
    try {
      let targetCorsetId = corsetId;

      if (!targetCorsetId && patientId) {
        const newCorset = await api.post("/corset/", { patientId });
        targetCorsetId = (newCorset as any).id;
      }

      const data = {
        corsetId: targetCorsetId,
        subAuxiliary: {
          subAuxiliary: parseInt(settings.subAuxiliary) || 0,
          subAuxiliaryInstruction: "",
        },
        thoracic: {
          thoracic: parseInt(settings.thoracic) || 0,
          thoracicInstruction: "",
        },
        lumbar: {
          lumbar: parseInt(settings.lumbar) || 0,
          lumbarInstruction: "",
        },
        trochanter: {
          trochanter: parseInt(settings.trochanter) || 0,
          trochanterInstruction: "",
        },
      };

      await api.post("/corset-settings/", data);
      Alert.alert("Succès", "Les paramètres du corset ont été mis à jour.");
      if (onSuccess) onSuccess(targetCorsetId || undefined);
      onClose();
    } catch (error: any) {
      console.error("Error updating corset settings:", error);
      Alert.alert("Erreur", error.message || "Impossible de mettre à jour les paramètres.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-surface h-2/3 rounded-t-3xl p-5 border-t border-zinc-800">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-bold text-lg">Paramètres du Corset</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-rose-500 font-bold">Fermer</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#10b981" className="mt-10" />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-secondaryText text-sm mb-1 font-bold">Sous-axillaire</Text>
                <TextInput
                  className="bg-zinc-800 text-white rounded-lg p-3"
                  keyboardType="numeric"
                  value={settings.subAuxiliary}
                  onChangeText={(t) => setSettings({ ...settings, subAuxiliary: t })}
                />
              </View>

              <View className="mb-4">
                <Text className="text-secondaryText text-sm mb-1 font-bold">Lombaire</Text>
                <TextInput
                  className="bg-zinc-800 text-white rounded-lg p-3"
                  keyboardType="numeric"
                  value={settings.lumbar}
                  onChangeText={(t) => setSettings({ ...settings, lumbar: t })}
                />
              </View>

              <View className="mb-4">
                <Text className="text-secondaryText text-sm mb-1 font-bold">Thoracique</Text>
                <TextInput
                  className="bg-zinc-800 text-white rounded-lg p-3"
                  keyboardType="numeric"
                  value={settings.thoracic}
                  onChangeText={(t) => setSettings({ ...settings, thoracic: t })}
                />
              </View>

              <View className="mb-4">
                <Text className="text-secondaryText text-sm mb-1 font-bold">Trochanter</Text>
                <TextInput
                  className="bg-zinc-800 text-white rounded-lg p-3"
                  keyboardType="numeric"
                  value={settings.trochanter}
                  onChangeText={(t) => setSettings({ ...settings, trochanter: t })}
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                className={`mt-6 py-4 rounded-xl items-center justify-center ${submitting ? "bg-emerald-500/50" : "bg-emerald-500"
                  }`}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">Enregistrer</Text>
                )}
              </TouchableOpacity>
              <View className="h-10" />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
