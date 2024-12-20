import {
  useContext,
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { deleteItem, getValueFor, saveItem } from "@/utils/secureStorage";

type LoginDetails = {
  username: string;
  password: string;
};

const AuthContext = createContext<{
  logIn: ({ username, password }: LoginDetails) => Promise<void> | null;
  register: ({ username, password }: LoginDetails) => Promise<void> | null;
  logOut: () => void;
  token: string | null;
  isLoading: boolean;
}>({
  logIn: () => null,
  register: () => null,
  logOut: () => {},
  token: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function checkToken() {
      setIsLoading(true);
      const token = await getValueFor("accessToken");
      if (token) {
        setToken(token);
      }
      setIsLoading(false);
    }

    checkToken();
  }, []);

  const handleLogin = async ({ username, password }: LoginDetails) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(
          `Request failed: ${response.status} - ${
            errorDetails.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      await saveItem("accessToken", data.accessToken);
      await saveItem("refreshToken", data.refreshToken);
      setToken(data.accessToken);
      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleRegister = async ({ username, password }: LoginDetails) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(
          `Request failed: ${response.status} - ${
            errorDetails.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      await saveItem("accessToken", data.accessToken);
      await saveItem("refreshToken", data.refreshToken);
      setToken(data.accessToken);
      setIsLoading(false);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await deleteItem("accessToken");
      await deleteItem("refreshToken");
      setToken(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Token deletion error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        logIn: handleLogin,
        register: handleRegister,
        logOut: handleLogout,
        isLoading,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
