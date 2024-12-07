import { Redirect, Slot } from "expo-router";
import { useSession } from "@/context";

export default function AppLayout() {
  const { token } = useSession();

  if (!token) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}
