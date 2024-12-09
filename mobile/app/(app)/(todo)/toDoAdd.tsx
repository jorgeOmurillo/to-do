import { StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";

export default function ToDoAdd() {
  return (
    <View style={{ flex: 1 }}>
      <Text>ToDoAdd Page</Text>
      <ThemedText type="link">Go to ok screen!</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
