import { FlatList } from "react-native";

import { ToDoItem } from "./ToDoItem";

type ToDo = {
  id: number;
  text: string;
  completed: boolean;
};

type Props = {
  toDos: ToDo[];
  onSaveEditedToDo: ({
    editingId,
    editedText,
  }: {
    editingId: number;
    editedText: string;
  }) => void;
};

function ToDoList(props: Props) {
  return (
    <FlatList
      data={props.toDos}
      renderItem={({ item }) => (
        <ToDoItem item={item} onSaveEditedToDo={props.onSaveEditedToDo} />
      )}
    />
  );
}

export { ToDoList };
