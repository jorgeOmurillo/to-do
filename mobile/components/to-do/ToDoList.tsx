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
};

function ToDoList(props: Props) {
  return (
    <FlatList
      data={props.toDos}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => `${item._id}`}
      renderItem={({ item }) => <ToDoItem item={item} />}
    />
  );
}

export { ToDoList };
