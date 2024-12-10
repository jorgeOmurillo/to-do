import { getValueFor, saveItem } from "@/utils/secureStorage";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<any> {
  try {
    const token = await getValueFor("accessToken");

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && retry) {
      console.warn("Token expired. Attempting refresh...");
      const newToken = await refreshAuthToken();
      if (!newToken) {
        throw new Error("Session expired");
      }

      await saveItem("accessToken", newToken);
      return await fetchWithAuth(endpoint, options, false);
    }

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Request failed: ${response.status} - ${
          errorDetails.message || "Unknown error"
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("fetchWithAuth error:", error);
    throw error;
  }
}

async function refreshAuthToken(): Promise<string | null> {
  try {
    const refreshToken = await getValueFor("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token.");
      return null;
    }

    const { accessToken } = await response.json();
    await saveItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}
