import { useState } from "react";
import { Text, TextInput, StyleSheet, View } from "react-native";

type ToDo = {
  _id: string;
  description: string;
  title: string;
  completed: boolean;
};

type Props = {
  item: ToDo;
  onToDoCompleted: (_id: string) => void;
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

function ToDoItem(props: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.toDoItemContainer}>
        {editingId === props.item._id ? (
          <TextInput
            numberOfLines={1}
            style={styles.textInput}
            value={editedText}
            onChangeText={setEditedText}
            autoCorrect={false}
          />
        ) : (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              flex: 1,
              paddingRight: 10,
            }}
          >
            {props.item.title}
          </Text>
        )}
        <View style={styles.toDoButtons}>
          {editingId === props.item._id ? (
            <Text
              ellipsizeMode="clip"
              numberOfLines={1}
              onPress={() => {
                props.onSaveEditedToDo({
                  editingId: props.item._id,
                  editedText,
                });
                setEditedText("");
                setEditingId(null);
              }}
            >
              Save
            </Text>
          ) : (
            <Text
              onPress={() => {
                setEditingId(props.item._id);
                setEditedText(props.item.title);
              }}
            >
              Edit
            </Text>
          )}
          <Text
            onPress={() => {
              props.onSaveEditedToDo({
                editingId: props.item._id,
                editedCompleted: !props.item.completed,
              });
            }}
          >
            {"\u2713"}
          </Text>
        </View>
      </View>
    </View>
  );
}

export { ToDoItem };

const styles = StyleSheet.create({
  container: {},
  toDoItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 5,
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    shadowColor: "grey",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1.0,
  },
  textInput: {
    flex: 1,
    borderColor: "gray",
    paddingRight: 10,
  },
  toDoButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
