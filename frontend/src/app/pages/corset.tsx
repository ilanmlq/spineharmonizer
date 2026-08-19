import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useApi } from "@/hooks/useApi";
import { api } from "@/api/client";
import { displayName, normalizeRole, User } from "@/type/roles";
import CorsetSettingsModal from "@/components/stats/CorsetSettingsModal";

function childrenOf(user: User | null) {
  return user?.children ?? user?.patients ?? [];
}

function pressureStatus(current?: number, target?: number) {
  if (current == null || target == null) return "Aucune donnée";
  const diff = Math.abs(current - target);
  if (diff <= 3) return "Bon serrage";
  if (current < target) return "À resserrer";
  return "Trop serré";
}

function MetricCard({
  label,
  current,
  target,
}: {
  label: string;
  current?: number;
  target?: number;
}) {
  return (
    <View className="w-1/2 p-1">
      <View className="aspect-square bg-surface rounded-2xl p-4 justify-between">
        <Text className="text-secondaryText text-[10px] font-bold uppercase">
          {label}
        </Text>
        <View>
          <View className="flex-row items-end">
            <Text className="text-primaryText text-4xl font-bold">
              {current ?? "-"}
            </Text>
            <Text className="text-secondaryText text-xl font-bold ml-1">
              / {target ?? "-"}
            </Text>
          </View>
          <Text className="text-secondaryText text-xs mt-2">
            {pressureStatus(current, target)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function CorsetScreen() {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: user, loading: userLoading, refetch: refetchUser } = useApi<User>(
    () => api.get("/users/me"),
    [],
  );
  const role = normalizeRole(user?.role);
  const selectablePatients = childrenOf(user);

  useEffect(() => {
    if ((role === "parent" || role === "docteur") && selectablePatients.length > 0 && !selectedId) {
      setSelectedId(selectablePatients[0].id);
    }
  }, [role, selectablePatients, selectedId]);

  const targetUser = useMemo(() => {
    if (role === "enfant") return user;
    return selectablePatients.find((patient) => patient.id === selectedId) ?? selectablePatients[0] ?? null;
  }, [role, selectablePatients, selectedId, user]);
  const corsetId = targetUser?.corset?.id ?? null;

  const {
    data: event,
    loading: eventLoading,
    refetch: refetchEvent,
  } = useApi<any>(
    () => (corsetId ? api.get(`/corset/${corsetId}/latest-event`) : Promise.resolve(null)),
    [corsetId, refreshKey],
  );

  const {
    data: settings,
    loading: settingsLoading,
    refetch: refetchSettings,
  } = useApi<any>(
    () => (corsetId ? api.get(`/corset-settings/${corsetId}`) : Promise.resolve(null)),
    [corsetId, refreshKey],
  );

  useFocusEffect(
    useCallback(() => {
      refetchUser();
      refetchEvent();
      refetchSettings();
    }, [refetchEvent, refetchSettings, refetchUser]),
  );

  const loading = userLoading || eventLoading || settingsLoading;

  return (
    <View className="flex-1 bg-bgColor pt-16">
      <View
        style={{ paddingTop: insets.top + 16 }}
        className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pb-3 border-b border-surface bg-bgColor/95 z-50"
      >
        <View className="flex-1 pr-3">
          <Text className="text-3xl font-bold text-primaryText">Corset</Text>
          {targetUser && (
            <Text className="text-secondaryText mt-1">
              {displayName(targetUser)}
            </Text>
          )}
        </View>
        {role === "docteur" && targetUser && (
          <TouchableOpacity
            onPress={() => setSettingsModalVisible(true)}
            className="bg-emerald-500 px-4 py-2 rounded-xl"
          >
            <Text className="text-white font-bold">Régler</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="px-6 flex-1"
        style={{ paddingTop: insets.top + 25 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {(role === "parent" || role === "docteur") && (
          <View className="bg-surface rounded-2xl p-4 mb-4">
            <Text className="text-purpleColor font-black text-lg mb-3">
              {role === "parent" ? "ENFANT" : "PATIENT"}
            </Text>
            <View className="flex-row flex-wrap">
              {selectablePatients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  onPress={() => setSelectedId(patient.id)}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
                    targetUser?.id === patient.id
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-bgColor border-zinc-800"
                  }`}
                >
                  <Text className="text-white font-bold">{displayName(patient)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {loading ? (
          <View className="py-20 items-center">
            <ActivityIndicator size="large" color="#A98CF0" />
          </View>
        ) : !targetUser ? (
          <View className="bg-surface rounded-2xl p-4">
            <Text className="text-secondaryText text-center">
              Aucun patient disponible.
            </Text>
          </View>
        ) : !corsetId ? (
          <View className="bg-surface rounded-2xl p-4">
            <Text className="text-secondaryText text-center">
              Aucun corset assigné.
            </Text>
            {role === "docteur" && (
              <TouchableOpacity
                onPress={() => setSettingsModalVisible(true)}
                className="bg-emerald-500 py-3 rounded-xl items-center mt-4"
              >
                <Text className="text-white font-bold">Assigner un corset</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <View className="flex-row flex-wrap">
              <MetricCard
                label="SUB-AUX"
                current={event?.subAuxiliary}
                target={settings?.subAuxiliary}
              />
              <MetricCard
                label="LOMBAIRE"
                current={event?.lumbar}
                target={settings?.lumbar}
              />
              <MetricCard
                label="THORACIQUE"
                current={event?.thoracic}
                target={settings?.thoracic}
              />
              <MetricCard
                label="TROCHANTER"
                current={event?.trochanter}
                target={settings?.trochanter}
              />
            </View>

            <View className="w-full mt-4">
              <View className="bg-surface rounded-2xl p-4">
                <Text className="text-zinc-500 text-[10px] font-bold uppercase mb-2">
                  Batterie
                </Text>
                <Text className="text-white text-3xl font-bold">
                  {event?.battery ?? "-"}%
                </Text>
              </View>
            </View>
            <View className="w-full mt-4 mb-6">
              <View className="bg-surface rounded-2xl p-4">
                <Text className="text-zinc-500 text-[10px] font-bold uppercase mb-2">
                  État du corset
                </Text>
                {event?.state === "WORN" ? (
                  <Text className="text-greenText text-2xl font-bold">PORTÉ</Text>
                ) : (
                  <Text className="text-redText text-2xl font-bold">PAS PORTÉ</Text>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {role === "docteur" && targetUser && (
        <CorsetSettingsModal
          visible={settingsModalVisible}
          corsetId={corsetId}
          patientId={targetUser.id}
          onClose={() => setSettingsModalVisible(false)}
          onSuccess={(newCorsetId) => {
            if (newCorsetId && targetUser) {
              refetchUser();
            }
            setRefreshKey((prev) => prev + 1);
          }}
        />
      )}
    </View>
  );
}
