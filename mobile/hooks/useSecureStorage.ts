import * as SecureStore from "expo-secure-store";

function useSecureStorage() {
  async function save(key: any, value: any) {
    try {
      await SecureStore.setItemAsync(key, value);
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
    save,
  };
}

export { useSecureStorage };