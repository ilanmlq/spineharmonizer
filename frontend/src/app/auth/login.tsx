import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/authContext";
import { Redirect, useRouter } from "expo-router";
import { api } from "@/api/client";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Le nom d'utilisateur et le mot de passe sont requis.");
      return;
    }

    try {
      const payload = {
        username,
        password,
      };

      const res = await api.post<{ token: string; refreshToken: string }>(
        "/auth/login",
        payload
      );

      await login(res.token, res.refreshToken);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion.");
    } finally {
      router.push("/pages"); // Redirige vers la page principale après la connexion
    }
  };

  const handleRegisterPress = () => {
    router.push("/auth/register");
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
          paddingTop: insets.top,
          paddingBottom: 40,
          paddingHorizontal: 24,
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <View className="items-start mb-10">
          <Text className="text-xl text-secondaryText">Bon retour</Text>
          <Text className="text-3xl font-bold font-mono text-primaryText">
            Connexion
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-secondaryText mb-2 ml-1">Nom d'utilisateur</Text>
          <View className="flex-row items-center bg-surface rounded-2xl px-4 border border-surface">
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 py-4 px-3 text-primaryText text-base"
              placeholder="username"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View className="mb-2">
          <Text className="text-sm text-secondaryText mb-2 ml-1">
            Mot de passe
          </Text>
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

        <TouchableOpacity className="self-end mb-8">
          <Text className="text-sm text-secondaryText font-medium">
            Mot de passe oublié ?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-primaryText rounded-2xl py-4 items-center mb-6"
          onPress={handleLogin}
        >
          <Text className="text-bgColor text-base font-bold font-mono">
            Se connecter
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-secondaryText text-sm">
            Pas encore de compte ?{" "}
          </Text>
          <TouchableOpacity onPress={handleRegisterPress}>
            <Text className="text-primaryText text-sm font-bold">
              S'inscrire
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
