import { saveItem, getValueFor, deleteItem } from "@/utils/secureStorage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

jest.mock("expo-secure-store");

describe("secureStorage utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe("on web platform", () => {
    beforeAll(() => {
      Platform.OS = "web";
      global.localStorage = {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
      } as any;
    });

    it("saveItem saves to localStorage", async () => {
      const setItemSpy = jest.spyOn(localStorage, "setItem");
      const key = "itKey";
      const value = "itValue";

      await saveItem(key, value);

      expect(setItemSpy).toHaveBeenCalledWith(key, value);
    });

    it("getValueFor retrieves from localStorage", async () => {
      const getItemSpy = jest
        .spyOn(localStorage, "getItem")
        .mockReturnValue("itValue");
      const key = "itKey";

      const result = await getValueFor(key);

      expect(getItemSpy).toHaveBeenCalledWith(key);
      expect(result).toBe("itValue");
    });

    it("deleteItem removes from localStorage", async () => {
      const removeItemSpy = jest.spyOn(localStorage, "removeItem");
      const key = "itKey";

      await deleteItem(key);

      expect(removeItemSpy).toHaveBeenCalledWith(key);
    });
  });

  describe("on native platform", () => {
    beforeAll(() => {
      Platform.OS = "ios"; // Or "android"
    });

    it("saveItem saves to SecureStore", async () => {
      const key = "itKey";
      const value = "itValue";

      await saveItem(key, value);

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(key, value);
    });

    it("getValueFor retrieves from SecureStore", async () => {
      const key = "itKey";
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("itValue");

      const result = await getValueFor(key);

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith(key);
      expect(result).toBe("itValue");
    });

    it("deleteItem removes from SecureStore", async () => {
      const key = "itKey";

      await deleteItem(key);

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(key);
    });
  });

  describe("error handling", () => {
    beforeAll(() => {
      Platform.OS = "ios"; // Or "web"
    });

    it("saveItem throws an error if SecureStore fails", async () => {
      const key = "itKey";
      const value = "itValue";
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(
        new Error("SecureStore error")
      );

      await expect(saveItem(key, value)).rejects.toThrow("SecureStore error");
    });

    it("getValueFor throws an error if SecureStore fails", async () => {
      const key = "itKey";
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(
        new Error("SecureStore error")
      );

      await expect(getValueFor(key)).rejects.toThrow("SecureStore error");
    });

    it("deleteItem throws an error if SecureStore fails", async () => {
      const key = "itKey";
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(
        new Error("SecureStore error")
      );

      await expect(deleteItem(key)).rejects.toThrow("SecureStore error");
    });
  });
});
