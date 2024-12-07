import * as SecureStore from "expo-secure-store";

function useSecureStorage() {
  async function saveItem(key: any, value: any) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      throw e;
    }
  }

  async function deleteItem(key: any) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      throw e;
    }
  }

  async function getValueFor(key: any) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      throw e;
    }
  }

  return {
    getValueFor,
    deleteItem,
    saveItem,
  };
}

export { useSecureStorage };
