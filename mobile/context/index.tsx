import {
  useContext,
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { deleteItem, getValueFor, saveItem } from "@/utils/secureStorage";

const AuthContext = createContext<{
  logIn: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;
  register: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;

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
      const token = await getValueFor("token");
      if (token) {
        setToken(token);
      }
      setIsLoading(false);
    }

    checkToken();
  }, []);

  const handleLogin = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await saveItem("token", data.token);
        setToken(data.token);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegister = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await saveItem("token", data.token);
        setToken(data.token);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await deleteItem("token");
      setIsLoading(false);
    } catch (error) {
      console.log("Token deletion error:", error);
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
