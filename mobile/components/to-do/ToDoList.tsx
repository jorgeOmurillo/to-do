import { FlatList } from "react-native";

import { ToDoItem } from "./ToDoItem";

type ToDo = {
  id: number;
  text: string;
  completed: boolean;
};

type Props = {
  toDos: ToDo[];
};

function ToDoList(props: Props) {
  return (
    <FlatList
      data={props.toDos}
      renderItem={({ item }) => <ToDoItem item={item} />}
    />
  );
}

export { ToDoList };
