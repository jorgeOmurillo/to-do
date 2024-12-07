import { FlatList } from "react-native";

import { ToDoItem } from "./ToDoItem";

type ToDo = {
  _id: string;
  description: string;
  title: string;
  completed: boolean;
};

type Props = {
  toDos: ToDo[];
  onSaveEditedToDo: ({
    editingId,
    editedText,
    editedCompleted,
  }: {
    editingId: string;
    editedText?: string;
    editedCompleted?: boolean;
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
