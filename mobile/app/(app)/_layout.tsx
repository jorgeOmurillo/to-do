import { Text } from "react-native";
import { Redirect, Slot, Stack } from "expo-router";
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(todo)/toDoAdd"
          options={{ headerShown: true, title: "Add ToDo" }}
        />
      </Stack>
    </ToDoProvider>
  );
}
