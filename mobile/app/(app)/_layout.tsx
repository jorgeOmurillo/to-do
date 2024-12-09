import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useSession } from "@/context";
import { ToDoProvider } from "@/context/todoContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function AppLayout() {
  const { isLoading, token } = useSession();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <ToDoProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackTitle: "Home",
          headerTintColor: Colors[colorScheme ?? "light"].text,
          headerStyle: { backgroundColor: "#9395D3" },
        }}
      >
        <Stack.Screen
          name="(todo)/toDoAdd"
          options={{
            headerShown: true,
            title: "Add ToDo",
            headerTitleAlign: "left",
          }}
        />
        <Stack.Screen
          name="(todo)/toDoEdit"
          options={{
            headerShown: true,
            title: "Edit ToDo",
            headerTitleAlign: "left",
          }}
        />
      </Stack>
    </ToDoProvider>
  );
}
