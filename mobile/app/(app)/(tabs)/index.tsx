import ToDo from "../../../components/to-do/toDo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ToDo />
    </SafeAreaView>
  );
}
