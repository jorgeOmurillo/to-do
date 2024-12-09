import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useTodos } from "@/context/todoContext";
import { router } from "expo-router";

export default function ToDoAddScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { addToDo } = useTodos();
  const isTitleEmpty = title.trim() === "";

  const handleOnAddToDo = () => {
    if (isTitleEmpty) {
      Alert.alert("Please add a title to your ToDo.");
      return;
    }

    addToDo({ title, description });
    router.navigate("/(app)/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.textInput}
          value={title}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setTitle}
          placeholder="Enter ToDo title"
          placeholderTextColor="#B0B0C3"
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          value={description}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setDescription}
          placeholder="Enter ToDo description"
          placeholderTextColor="#B0B0C3"
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleOnAddToDo}>
        <Text style={styles.addButtonText}>ADD</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FC",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  form: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "#4A4A6A",
    borderColor: "#E4E4F1",
    borderWidth: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#6D65B4",
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#9286F3",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
