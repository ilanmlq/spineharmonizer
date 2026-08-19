import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/authContext";
import { api } from "@/api/client";
import { useRouter } from "expo-router";

// Définition des rôles basés sur ton schéma Prisma
type Role = "PATIENT" | "DOCTOR" | "PARENT";

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const router = useRouter();

  // États du formulaire
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("PATIENT");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Le nom d'utilisateur et le mot de passe sont requis.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        username,
        password,
        role,
        email: email.trim() === "" ? undefined : email, // Gère l'email optionnel
      };

      const res = await api.post<{ token: string; refreshToken: string }>(
        "/auth/register",
        payload
      );

      await login(res.token, res.refreshToken);
      
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
      router.push("/pages"); // Redirige vers la page principale après l'inscription
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bgColor"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 40,
          paddingHorizontal: 24,
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        {/* En-tête */}
        <View className="items-start mb-8">
          <Text className="text-xl text-secondaryText">Rejoins-nous</Text>
          <Text className="text-3xl font-bold font-mono text-primaryText">
            Inscription
          </Text>
        </View>

        {error && (
          <View className="mb-4 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
            <Text className="text-rose-400 text-sm font-medium">{error}</Text>
          </View>
        )}

        {/* Champ Username (Nom / Prénom) */}
        <View className="mb-4">
          <Text className="text-sm text-secondaryText mb-2 ml-1">Nom d'utilisateur / Nom complet</Text>
          <View className="flex-row items-center bg-surface rounded-2xl px-4 border border-surface">
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 py-4 px-3 text-primaryText text-base"
              placeholder="Ex: Pierre Dubois"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Champ Email (Optionnel) */}
        <View className="mb-4">
          <Text className="text-sm text-secondaryText mb-2 ml-1">Email (Optionnel)</Text>
          <View className="flex-row items-center bg-surface rounded-2xl px-4 border border-surface">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 py-4 px-3 text-primaryText text-base"
              placeholder="email@exemple.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Champ Mot de passe */}
        <View className="mb-6">
          <Text className="text-sm text-secondaryText mb-2 ml-1">Mot de passe</Text>
          <View className="flex-row items-center bg-surface rounded-2xl px-4 border border-surface">
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 py-4 px-3 text-primaryText text-base"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sélecteur de Rôle (Boutons radio modernes) */}
        <View className="mb-8">
          <Text className="text-sm text-secondaryText mb-3 ml-1">Je suis un :</Text>
          <View className="flex-row space-x-2 justify-between">
            {(["PATIENT", "DOCTOR", "PARENT"] as Role[]).map((r) => {
              const isSelected = role === r;
              let label = "Patient";
              if (r === "DOCTOR") label = "Médecin";
              if (r === "PARENT") label = "Parent";

              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  className={`flex-1 py-3 rounded-xl border items-center justify-center ${
                    isSelected
                      ? "bg-primaryText border-primaryText"
                      : "bg-surface border-surface"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      isSelected ? "text-bgColor" : "text-secondaryText"
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bouton Soumettre */}
        <TouchableOpacity
          className="bg-primaryText rounded-2xl py-4 items-center mb-6 h-14 justify-center"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#09090b" />
          ) : (
            <Text className="text-bgColor text-base font-bold font-mono">
              Créer mon compte
            </Text>
          )}
        </TouchableOpacity>

        {/* Lien vers Connexion */}
        <View className="flex-row justify-center">
          <Text className="text-secondaryText text-sm">Déjà inscrit ? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text className="text-primaryText text-sm font-bold">
              Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}