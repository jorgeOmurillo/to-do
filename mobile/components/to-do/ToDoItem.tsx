import { Text, StyleSheet, View } from "react-native";

type ToDo = {
  id: number;
  text: string;
  completed: boolean;
};

type Props = {
  item: ToDo;
};

function ToDoItem(props: Props) {
  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          flex: 1,
          paddingRight: 10,
        }}
      >
        {props.item.text}
      </Text>
    </View>
  );
}

export { ToDoItem };

const styles = StyleSheet.create({
  container: {
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
});
