import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export async function saveItem(key: string, value: string) {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (e) {
    console.error("Error saving to SecureStore", e);
    throw e;
  }
}

export async function getValueFor(key: string) {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (e) {
    console.error("Error retrieving from SecureStore", e);
    throw e;
  }
}

export async function deleteItem(key: string) {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (e) {
    console.error("Error deleting from SecureStore", e);
    throw e;
  }
}
