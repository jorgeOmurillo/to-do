import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { useTodos } from "@/context/todoContext";
import { ToDoList } from "@/components/to-do/ToDoList";
import { ToDoAdd } from "@/components/to-do/toDoAdd";
import { ToDoFilterButton } from "@/components/to-do/toDoFilterButton";

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
    <>
      <View style={styles.buttonsContainer}>
        <ToDoFilterButton
          title="All"
          isActive={toDosFilter === "all"}
          onPress={() => setToDosFilter("all")}
        />
        <ToDoFilterButton
          title="Completed"
          isActive={toDosFilter === "completed"}
          onPress={() => setToDosFilter("completed")}
        />
        <ToDoFilterButton
          title="Incomplete"
          isActive={toDosFilter === "incomplete"}
          onPress={() => setToDosFilter("incomplete")}
        />
        <ToDoFilterButton
          title="Remove Completed"
          onPress={handleOnRemoveCompleted}
        />
      </View>
      <ToDoList toDos={filteredToDos} />
      <ToDoAdd onPress={() => router.navigate("/(app)/(todo)/toDoAdd")} />
    </>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
  },
});
