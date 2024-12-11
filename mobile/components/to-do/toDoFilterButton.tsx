import { StyleSheet, Text, TouchableOpacity } from "react-native";

function ToDoFilterButton({
  title,
  onPress,
  isActive,
}: {
  title: string;
  onPress: () => void;
  isActive?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.activeButton]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export { ToDoFilterButton };

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: "#7C4DFF",
  },
  buttonText: {
    color: "#333",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  activeButtonText: {
    color: "#fff",
  },
});
