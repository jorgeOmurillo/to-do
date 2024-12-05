import { useState } from "react";
import { Alert } from "react-native";
import { ToDoInput } from "@/components/to-do/ToDoInput";
import { ToDoList } from "@/components/to-do/ToDoList";

type ToDo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function ToDo() {
  const [toDos, setToDos] = useState<ToDo[]>([]);

  const handleOnAddToDo = (toDoInput: string) => {
    const duplicateToDo = toDos.some(
      (value) => toDoInput.trim() === value.text
    );

    if (duplicateToDo) {
      Alert.alert("This To-Do item already exists.");
      return;
    }

    setToDos([
      { id: Date.now(), text: toDoInput.trim(), completed: false },
      ...toDos,
    ]);
  };

  const handleOnToDoCompleted = (id: number) => {
    setToDos(
      toDos.map((toDo) =>
        toDo.id === id ? { ...toDo, completed: !toDo.completed } : toDo
      )
    );
  };

  const handleOnSaveEditedToDo = ({
    editingId,
    editedText,
  }: {
    editingId: number;
    editedText: string;
  }) => {
    setToDos(
      toDos.map((toDo) =>
        toDo.id === editingId ? { ...toDo, text: editedText } : toDo
      )
    );
  };

  return (
    <>
      <ToDoInput onAddToDo={handleOnAddToDo} />
      <ToDoList
        toDos={toDos}
        onToDoCompleted={handleOnToDoCompleted}
        onSaveEditedToDo={handleOnSaveEditedToDo}
      />
    </>
  );
}
