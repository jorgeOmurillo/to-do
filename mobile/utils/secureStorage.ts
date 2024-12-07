import * as SecureStore from "expo-secure-store";

export async function saveItem(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.error("Error saving to SecureStore", e);
    throw e;
  }
}

export async function getValueFor(key: string) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    console.error("Error retrieving from SecureStore", e);
    throw e;
  }
}

export async function deleteItem(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.error("Error deleting from SecureStore", e);
    throw e;
  }
}
