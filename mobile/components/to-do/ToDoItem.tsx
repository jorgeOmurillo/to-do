import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";

import { useTodos } from "@/context/todoContext";

type ToDo = {
  _id: string;
  description: string;
  title: string;
  completed: boolean;
};

type Props = {
  item: ToDo;
};

function ToDoItem(props: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const { editToDo, removeToDo } = useTodos();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.item.title}</Text>
        <Text style={styles.subtitle}>{props.item.description}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => {
            () => {
              editToDo(props.item._id, { title: editedText });
              setEditedText("");
              setEditingId(null);
            };
          }}
        >
          <Ionicons name="pencil-outline" size={20} color="#9286F3" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeToDo(props.item._id)}>
          <Ionicons name="trash-outline" size={20} color="#9286F3" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            editToDo(props.item._id, { completed: !props.item.completed });
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#9286F3" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export { ToDoItem };

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6D65B4",
  },
  subtitle: {
    fontSize: 14,
    color: "#9C9ABA",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 90,
  },
});
