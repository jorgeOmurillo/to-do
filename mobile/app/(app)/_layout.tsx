import { Text } from "react-native";
import { Redirect, Slot } from "expo-router";
import { useSession } from "@/context";
import { ToDoProvider } from "@/context/todoContext";

export default function AppLayout() {
  const { isLoading, token } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <ToDoProvider>
      <Slot />
    </ToDoProvider>
  );
}
