import { useState } from "react";
import { Button, TextInput, StyleSheet, View } from "react-native";

type Props = {
  onAddToDo: (toDoInput: string) => void;
};

function ToDoInput(props: Props) {
  const [toDoInput, setToDoInput] = useState("");
  const isTextEmpty = toDoInput.trim() === "";

  const handleOnAddToDo = () => {
    if (isTextEmpty) {
      return;
    }

    props.onAddToDo(toDoInput);

    setToDoInput("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={toDoInput}
        onChangeText={setToDoInput}
        autoCorrect={false}
      />
      <Button disabled={isTextEmpty} title="Add" onPress={handleOnAddToDo} />
    </View>
  );
}

export { ToDoInput };

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  textInput: {
    flex: 1,
    borderColor: "gray",
    // borderWidth: 1,
    // padding: 10,
    // marginBottom: 10,
    //
    // margin: 5,
    backgroundColor: "white",
    // borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    shadowColor: "grey",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1.0,
  },
  toDoButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
