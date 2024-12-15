import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSession } from "@/context";

export default function TabTwoScreen() {
  const { logOut } = useSession();

  const handleOnLogoutPress = async () => {
    logOut();
    router.replace("/login");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <TouchableOpacity style={styles.button} onPress={handleOnLogoutPress}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  button: {
    backgroundColor: "#7C4DFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
