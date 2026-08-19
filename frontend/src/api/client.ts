import { tokenStorage } from "./token.storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
let isRefreshing = false;

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await tokenStorage.getToken();
  
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}), // Injecté uniquement si présent
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401 && !isRefreshing && endpoint !== "/login" && endpoint !== "/refresh") {
    isRefreshing = true;
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) {
        // Appel à ton endpoint Express /refresh
        const refreshResponse = await fetch(`${BASE_URL}/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const newTokens = await refreshResponse.json();
          await tokenStorage.setTokens(newTokens.token, newTokens.refreshToken);
          
          isRefreshing = false;
          // On rejoue la requête initiale avec le nouveau token !
          return request<T>(endpoint, options);
        }
      }
    } catch (e) {
      await tokenStorage.clearTokens();
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};