import { FlatList } from "react-native";

import { ToDoItem } from "./ToDoItem";

type ToDo = {
  id: string;
  description: string;
  title: string;
  completed: boolean;
};

type Props = {
  toDos: ToDo[];
  onToDoCompleted: (id: number) => void;
  onSaveEditedToDo: ({
    editingId,
    editedText,
  }: {
    editingId: string;
    editedText: string;
  }) => void;
};

function ToDoList(props: Props) {
  return (
    <FlatList
      data={props.toDos}
      renderItem={({ item }) => (
        <ToDoItem
          item={item}
          onToDoCompleted={props.onToDoCompleted}
          onSaveEditedToDo={props.onSaveEditedToDo}
        />
      )}
    />
  );
}

export { ToDoList };
