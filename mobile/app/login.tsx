import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useSession } from "@/context";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [error, setError] = useState("");
  const { logIn } = useSession();

  const handleOnLoginPress = async () => {
    try {
      await logIn({ username, password });
      router.replace("/(app)/(tabs)");
    } catch (error) {
      console.error("Login error: ", error);

      const errorMessage =
        (error as Error).message || "An unknown error occurred.";
      setError(errorMessage);
    }
  };

  const handleOnRegisterPress = async () => {
    router.navigate("/register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <View style={styles.passwordInput}>
        <TextInput
          style={styles.passwordTextInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={isPasswordSecure}
        />
        <TouchableOpacity
          testID="passwordSecureButton"
          onPress={() => setIsPasswordSecure(!isPasswordSecure)}
        >
          <Ionicons
            name={isPasswordSecure ? "eye" : "eye-off"}
            size={20}
            color="#9286F3"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        testID="loginButton"
        style={styles.button}
        onPress={handleOnLoginPress}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleOnRegisterPress}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
      {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordTextInput: {
    padding: 10,
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
  linkText: {
    color: "#7C4DFF",
    marginTop: 15,
    textAlign: "center",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "red",
  },
});
