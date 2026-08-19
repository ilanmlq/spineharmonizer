import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { normalizeRole, User } from "@/type/roles";
import ExerciseList from "@/components/stats/ExerciseList";
import DoctorPatientsList, {
  Patient,
} from "@/components/stats/DoctorPatientsList";
import AssignProgramModal from "@/components/stats/AssignProgramModal";
import CorsetSettingsModal from "@/components/stats/CorsetSettingsModal";
import ChildSelector from "@/components/users/ChildSelector";
import CorsetToggleBar from "@/components/dashboard/CorsetToggleBar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DoctorPatientActions from "@/components/dashboard/DoctorPatientActions";
import EmptySelectionCard from "@/components/dashboard/EmptySelectionCard";
import PatientMetrics from "@/components/dashboard/PatientMetrics";
import {
  childrenOf,
  getCurrentWeekDates,
  getISODate,
} from "@/components/dashboard/dashboardUtils";
import { useApi } from "@/hooks/useApi";
import { api } from "@/api/client";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 92;

  const {
    data: user,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useApi<User>(() => api.get("/users/me"), []);

  const role = normalizeRole(user?.role);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localState, setLocalState] = useState<string | null>(null);
  const [assigningCorset, setAssigningCorset] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [weeklyData, setWeeklyData] = useState<
    Array<{ day: string; duration: number; isToday?: boolean }>
  >([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const children = childrenOf(user);

  useEffect(() => {
    if (role === "parent" && children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, role, selectedChildId]);

  const selectedChild = useMemo(
    () => children.find((child) => child.id === selectedChildId) ?? children[0] ?? null,
    [children, selectedChildId],
  );

  const targetUser =
    role === "docteur" ? viewingPatient : role === "parent" ? selectedChild : user;
  const targetUserId = targetUser?.id;
  const corsetId = targetUser?.corset?.id ?? null;
  const canShowPatientData = !!targetUserId && (role !== "docteur" || !!viewingPatient);

  useEffect(() => {
    async function fetchWeeklyData() {
      if (!corsetId || !canShowPatientData) {
        setWeeklyData([]);
        setWeeklyLoading(false);
        return;
      }

      setWeeklyLoading(true);
      try {
        const currentIsoDate = getISODate();
        const results = await Promise.all(
          getCurrentWeekDates().map(async (dayInfo) => {
            if (dayInfo.date > currentIsoDate) {
              return { day: dayInfo.day, duration: 0, isToday: dayInfo.isToday };
            }

            try {
              const response = await api.get<{ totalWornMinutes: number }>(
                `/corset/${corsetId}/compliance/day?date=${dayInfo.date}`,
              );
              return {
                day: dayInfo.day,
                duration: response?.totalWornMinutes ?? 0,
                isToday: dayInfo.isToday,
              };
            } catch {
              return { day: dayInfo.day, duration: 0, isToday: dayInfo.isToday };
            }
          }),
        );

        setWeeklyData(results);
      } finally {
        setWeeklyLoading(false);
      }
    }

    fetchWeeklyData();
  }, [corsetId, canShowPatientData, refreshKey]);

  const { data: batteryLevel, loading: batteryLoading } = useApi<{
    battery: number;
  } | null>(
    () => (corsetId ? api.get(`/corset/${corsetId}/battery`) : Promise.resolve(null)),
    [corsetId, refreshKey],
  );
  const { data: complianceData, loading: complianceLoading } = useApi<{
    totalWornMinutes: number;
  }>(
    () =>
      corsetId
        ? api.get(`/corset/${corsetId}/compliance/day?date=${getISODate()}`)
        : Promise.resolve({ totalWornMinutes: 0 }),
    [corsetId, refreshKey],
  );
  const { data: lastEventData, refetch: refreshCorsetState } = useApi<{
    state: string;
  } | null>(
    () => (corsetId ? api.get(`/corset/${corsetId}/latest-event`) : Promise.resolve(null)),
    [corsetId, refreshKey],
  );

  useEffect(() => {
    if (lastEventData?.state && localState !== lastEventData.state) {
      setLocalState(lastEventData.state);
    }
  }, [lastEventData?.state, localState]);

  async function handleToggleCorset() {
    if (isUpdating || !corsetId || role !== "enfant") return;

    setIsUpdating(true);
    const nextState = localState === "WORN" ? "NOT_WORN" : "WORN";

    try {
      setLocalState(nextState);
      await api.post(`/corset-event/`, {
        corsetId,
        state: nextState,
        battery: batteryLevel?.battery ?? 0,
        subAuxiliary: 0,
        thoracic: 0,
        lumbar: 0,
        trochanter: 0,
        timestamp: new Date().toISOString(),
      });
      setRefreshKey((prev) => prev + 1);
      setTimeout(() => refreshCorsetState?.(), 300);
    } catch (error) {
      console.error(error);
      setLocalState(nextState === "WORN" ? "NOT_WORN" : "WORN");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleAssignNewCorset() {
    if (!viewingPatient?.corset) return;
    setAssigningCorset(true);
    try {
      await api.put(`/corset/${viewingPatient.corset.id}`, { patientId: null });
      setViewingPatient({ ...viewingPatient, corset: null });
      setRefreshKey((prev) => prev + 1);
      setSettingsModalVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setAssigningCorset(false);
    }
  }

  if (userLoading) {
    return (
      <View className="flex-1 bg-bgColor items-center justify-center">
        <ActivityIndicator size="large" color="#A98CF0" />
      </View>
    );
  }

  if (!user || userError) {
    return (
      <View className="flex-1 bg-bgColor items-center justify-center px-6">
        <Text className="text-rose-500 font-bold text-center">
          Impossible de charger l'utilisateur connecté.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bgColor">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight - 10,
          paddingBottom: 180,
        }}
      >
        {role === "parent" && (
          <ChildSelector
            title="MES ENFANTS"
            childrenList={children}
            selectedChildId={selectedChild?.id}
            onSelectChild={setSelectedChildId}
          />
        )}

        {canShowPatientData && (
          <PatientMetrics
            complianceLoading={complianceLoading}
            currentMinutes={complianceData?.totalWornMinutes ?? 0}
            weeklyLoading={weeklyLoading}
            weeklyData={weeklyData}
          />
        )}

        {role === "docteur" && !viewingPatient ? (
          <DoctorPatientsList
            doctorId={user.id}
            onPatientClick={setViewingPatient}
          />
        ) : targetUserId ? (
          <ExerciseList
            user={role}
            userId={targetUserId}
            onViewAll={() => navigation.navigate("exercices")}
            refreshKey={refreshKey}
          />
        ) : (
          <EmptySelectionCard />
        )}

        {role === "docteur" && viewingPatient && (
          <DoctorPatientActions
            patient={viewingPatient}
            assigningCorset={assigningCorset}
            onOpenProgramModal={() => setModalVisible(true)}
            onOpenSettingsModal={() => setSettingsModalVisible(true)}
            onAssignNewCorset={handleAssignNewCorset}
            onBackToPatients={() => {
              setViewingPatient(null);
              setRefreshKey((prev) => prev + 1);
            }}
          />
        )}
      </ScrollView>

      <DashboardHeader
        topInset={insets.top}
        role={role}
        user={user}
        viewingPatient={viewingPatient}
        batteryLevel={batteryLevel ?? null}
        showBattery={!batteryLoading && !!batteryLevel && canShowPatientData}
      />

      {role === "enfant" && corsetId && (
        <CorsetToggleBar
          bottomInset={insets.bottom}
          isUpdating={isUpdating}
          localState={localState}
          onToggle={handleToggleCorset}
        />
      )}

      {role === "docteur" && viewingPatient && (
        <>
          <AssignProgramModal
            visible={modalVisible}
            patient={viewingPatient}
            doctorId={user.id}
            onClose={() => setModalVisible(false)}
            onSuccess={() => {
              setModalVisible(false);
              setRefreshKey((prev) => prev + 1);
              refetchUser();
            }}
          />
          <CorsetSettingsModal
            visible={settingsModalVisible}
            corsetId={viewingPatient.corset?.id || null}
            patientId={viewingPatient.id}
            onClose={() => setSettingsModalVisible(false)}
            onSuccess={(newCorsetId) => {
              if (newCorsetId && !viewingPatient.corset) {
                setViewingPatient({
                  ...viewingPatient,
                  corset: { id: newCorsetId },
                });
              }
              setRefreshKey((prev) => prev + 1);
              refetchUser();
            }}
          />
        </>
      )}
    </View>
  );
}
