import { ThemeContext } from "@/context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { Pressable, TextInput, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const [task, setTask]: any = useState({});
  const router = useRouter();
  const { colorScheme, setColorScheme, theme }: any = useContext(ThemeContext);
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });
  const styles = createStyles(theme, colorScheme);

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTasks = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTasks && storageTasks.length) {
          const myTask = storageTasks.find(
            (todos: any) => todos.id.toString() === id
          );
          setTask(myTask);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(id);
  }, [id]);

  if (!loaded && !error) {
    return null;
  }

  const handleSave = async () => {
    try {
      const savedTask = { ...task, title: task.title };
      const jsonValue = await AsyncStorage.getItem("TodoApp");
      const storageTasks = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storageTasks && storageTasks.length) {
        const otherTasks = storageTasks.filter(
          (todos: any) => todos.id.toString() != savedTask.id.toString()
        );
        const allTasks = [...otherTasks, savedTask];
        await AsyncStorage.setItem("TodoApp", JSON.stringify(allTasks));
      } else {
        await AsyncStorage.setItem("TodoApp", JSON.stringify([savedTask]));
      }
    } catch (error) {}
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Pressable
          onPress={() => router.push("/")}
          style={styles.addButton}
          android_ripple={{ borderless: true, radius: 50 }}
        >
          <Ionicons
            name="arrow-back-circle-sharp"
            size={40}
            color={colorScheme == "dark" ? "white" : "black"}
          />
        </Pressable>

        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "light" ? "dark" : "light")
          }
          style={[styles.addButton, { marginRight: 10 }]}
          android_ripple={{ borderless: true, radius: 50 }}
        >
          <Octicons
            name={colorScheme === "light" ? "sun" : "moon"}
            color={colorScheme === "light" ? "black" : "white"}
            size={25}
          />
        </Pressable>
      </View>
      <View style={styles.saveContainer}>
        <TextInput
          style={[styles.input, styles.text]}
          maxLength={30}
          placeholder="Edit Task..."
          placeholderTextColor="grey"
          value={task?.title || ""}
          onChangeText={(text) => setTask((prev) => ({ ...prev, title: text }))}
        />

        <Pressable
          onPress={handleSave}
          style={styles.addButton}
          android_ripple={{ borderless: true, radius: 50 }}
        >
          <MaterialIcons
            name="save-alt"
            size={30}
            color={colorScheme == "dark" ? "white" : "black"}
          />
        </Pressable>
      </View>
      <StatusBar style={colorScheme == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(theme: any, colorScheme: any) {
  return StyleSheet.create({
    input: {
      height: 50,
      width: "75%",
      borderWidth: 1,
      borderColor: theme.text,
      borderRadius: 10,
      paddingTop: 5,
      paddingLeft: 10,
      fontSize: 20,
    },
    inputContainer: {
      padding: 10,
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center",
    },
    container: {
      backgroundColor: theme.background,
      flexGrow: 1,
      flex: 1,
    },
    text: {
      color: theme.text,
      fontFamily: "Inter_500Medium",
    },
    addButton: {
      marginTop: 7,
      marginLeft: 15,
    },
    saveContainer: {
      flexDirection: "row",
      justifyContent: "center",
      padding: 5,
      paddingTop: 20,
      borderTopColor: colorScheme == "dark" ? "white" : "black",
      borderTopWidth: 1
    },
  });
}
