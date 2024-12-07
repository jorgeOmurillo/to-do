import { getValueFor, saveItem } from "@/utils/secureStorage";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<any> {
  try {
    const token = await getValueFor("token");

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    console.log("the request --->>> ", `${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 401 && retry) {
      console.warn("Token expired. Attempting refresh...");
      const newToken = await refreshAuthToken();

      if (newToken) {
        await saveItem("token", newToken);
        return await fetchWithAuth(endpoint, options, false);
      }
    }

    const errorDetails = await response.json();
    throw new Error(
      `Request failed: ${response.status} - ${
        errorDetails.message || "Unknown error"
      }`
    );
  } catch (error) {
    console.error("fetchWithAuth error:", error);
    throw error;
  }
}

async function refreshAuthToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: await getValueFor("refreshToken") }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token.");
      return null;
    }

    const data = await response.json();
    return data.newToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}
