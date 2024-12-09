import { useEffect, useState } from "react";
import { Button, View } from "react-native";
import { router } from "expo-router";

import { useTodos } from "@/context/todoContext";
import { ToDoList } from "@/components/to-do/ToDoList";
import { ToDoAdd } from "@/components/to-do/toDoAdd";

type ToDosFilter = "all" | "completed" | "incomplete";

export default function HomeScreen() {
  const { fetchToDos, removeCompletedToDos, toDos } = useTodos();
  const [toDosFilter, setToDosFilter] = useState<ToDosFilter>("all");

  useEffect(() => {
    fetchToDos();
  }, []);

  const handleOnRemoveCompleted = () => {
    removeCompletedToDos();
  };

  const filteredToDos = toDos.filter((toDo) => {
    if (toDosFilter === "completed") {
      return toDo.completed;
    }

    if (toDosFilter === "incomplete") {
      return !toDo.completed;
    }

    return true;
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ToDoList toDos={filteredToDos} />
      </View>
      <View style={{ flex: 0.2, flexDirection: "row" }}>
        <Button title="Remove Completed" onPress={handleOnRemoveCompleted} />
        <Button title="All" onPress={() => setToDosFilter("all")} />
        <Button title="Completed" onPress={() => setToDosFilter("completed")} />
        <Button
          title="Incomplete"
          onPress={() => setToDosFilter("incomplete")}
        />
      </View>
      <ToDoAdd onPress={() => router.navigate("/(app)/(todo)/toDoAdd")} />
    </View>
  );
}
