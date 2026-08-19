import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useApi } from "@/hooks/useApi";
import { api } from "@/api/client";
import { SafeAreaView } from "react-native-safe-area-context";
import { displayName, normalizeRole, User } from "@/type/roles";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";

function roleLabel(role: ReturnType<typeof normalizeRole>) {
  if (role === "docteur") return "Docteur";
  if (role === "parent") return "Parent";
  return "Enfant";
}

function RelationSection({
  title,
  users,
  empty,
}: {
  title: string;
  users: User[];
  empty: string;
}) {
  return (
    <View className="bg-surface rounded-3xl px-5 py-4 mt-4">
      <Text className="text-xs font-bold text-secondaryText uppercase mb-2">
        {title}
      </Text>
      {users.length === 0 ? (
        <Text className="text-secondaryText py-2">{empty}</Text>
      ) : (
        users.map((user) => (
          <View
            key={user.id}
            className="flex-row justify-between items-center py-4 border-b border-bgColor"
          >
            <View className="flex-1 pr-3">
              <Text className="text-primaryText font-bold">{displayName(user)}</Text>
              {user.email ? (
                <Text className="text-secondaryText text-xs mt-1">{user.email}</Text>
              ) : null}
            </View>
            <Text className="text-secondaryText text-xs uppercase">
              {roleLabel(normalizeRole(user.role))}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

export default function Profile() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data: userData, loading: isLoading } = useApi<User>(
    () => api.get("/users/me"),
    [],
  );

  async function handleLogout() {
    await logout();
    router.replace("/auth/login");
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bgColor">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 items-center justify-center bg-bgColor px-6">
        <Text className="text-rose-500 font-bold text-center">
          Impossible de charger le profil.
        </Text>
      </View>
    );
  }

  const role = normalizeRole(userData.role);
  const children = userData.children ?? userData.patients ?? [];
  const doctors = role === "parent"
    ? children.map((child) => child.doctor).filter(Boolean) as User[]
    : userData.doctor
      ? [userData.doctor]
      : [];
  const uniqueDoctors = doctors.filter(
    (doctor, index, array) => array.findIndex((item) => item.id === doctor.id) === index,
  );

  return (
    <SafeAreaView className="flex-1 bg-bgColor">
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="items-center mb-4">
          <View className="h-24 w-24 bg-blue-600 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl font-bold text-white uppercase">
              {displayName(userData)[0]}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-primaryText">
            {displayName(userData)}
          </Text>
          {userData.email ? (
            <Text className="text-secondaryText mt-1">{userData.email}</Text>
          ) : null}
          <View className="mt-2 px-3 py-1 rounded-full bg-surface">
            <Text className="text-xs font-semibold text-secondaryText uppercase tracking-widest">
              {roleLabel(role)}
            </Text>
          </View>
        </View>

        {role === "enfant" && (
          <>
            <RelationSection
              title="Parent"
              users={userData.parent ? [userData.parent] : []}
              empty="Aucun parent associé."
            />
            <RelationSection
              title="Docteur"
              users={userData.doctor ? [userData.doctor] : []}
              empty="Aucun docteur associé."
            />
          </>
        )}

        {role === "parent" && (
          <>
            <RelationSection
              title="Enfants"
              users={children}
              empty="Aucun enfant associé."
            />
            <RelationSection
              title="Docteurs"
              users={uniqueDoctors}
              empty="Aucun docteur associé aux enfants."
            />
          </>
        )}

        {role === "docteur" && (
          <RelationSection
            title="Patients"
            users={userData.patients ?? []}
            empty="Aucun patient associé."
          />
        )}

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-rose-500 rounded-2xl py-4 items-center mt-6"
        >
          <Text className="text-white font-bold text-base">Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
