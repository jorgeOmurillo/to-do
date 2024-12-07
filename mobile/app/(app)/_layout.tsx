import { Redirect, Slot } from "expo-router";
import { useSession } from "@/context";
import { ToDoProvider } from "@/context/todoContext";

export default function AppLayout() {
  const { token } = useSession();

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <ToDoProvider>
      <Slot />
    </ToDoProvider>
  );
}
