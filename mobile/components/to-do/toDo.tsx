import { useEffect, useState } from "react";
import { Alert, Button } from "react-native";
import { ToDoInput } from "@/components/to-do/ToDoInput";
import { ToDoList } from "@/components/to-do/ToDoList";
import { useTodos } from "@/context/todoContext";

type ToDo = {
  _id: string;
  description: string;
  title: string;
  completed: boolean;
};

type ToDosFilter = "all" | "completed" | "incomplete";

export default function ToDo() {
  const { addToDo, fetchToDos, removeCompletedToDos, toDos } = useTodos();
  const [toDosFilter, setToDosFilter] = useState<ToDosFilter>("all");

  useEffect(() => {
    fetchToDos();
  }, []);

  const handleOnAddToDo = (toDoInput: string) => {
    const duplicateToDo = toDos.some(
      (value) => toDoInput.trim() === value.title
    );

    if (duplicateToDo) {
      Alert.alert("This To-Do item already exists.");
      return;
    }

    addToDo(toDoInput);
  };

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
      <ToDoInput onAddToDo={handleOnAddToDo} />
      <ToDoList toDos={filteredToDos} />
      <Button title="Remove Completed" onPress={handleOnRemoveCompleted} />
      <Button title="All" onPress={() => setToDosFilter("all")} />
      <Button title="Completed" onPress={() => setToDosFilter("completed")} />
      <Button title="Incomplete" onPress={() => setToDosFilter("incomplete")} />
    </>
  );
}
