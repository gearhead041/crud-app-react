import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  TextInput,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { data as TODOS } from "@/data/todos";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext, useState, useEffect } from "react";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { ThemeContext } from "@/context/ThemeContext";
import Octicons from "@expo/vector-icons/Octicons";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function Index() {
  const { colorScheme, setColorScheme, theme }: any = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);
  const Container = Platform.OS == "web" ? ScrollView : SafeAreaView;
  const separatorComp: any = <View style={styles.separator} />;
  const [inputText, setText] = useState("");
  const [tasks, setTasks]: any = useState([]);
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          setTasks(
            storageTodos.sort(
              (a: { id: number }, b: { id: number }) => b.id - a.id
            )
          );
        } else {
          setTasks(TODOS.sort((a, b) => b.id - a.id));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [TODOS]);

  useEffect(() => {
    const storedata = async () => {
      try {
        const jsonValue = JSON.stringify(tasks);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (error) {
        console.log(error);
      }
    };

    storedata();
  }, [tasks]);

  if (!loaded && !error) {
    return null;
  }

  const addTask = () => {
    if (inputText.trim()) {
      const lastId = tasks.length > 0 ? tasks[0].id : 0;
      setTasks([
        {
          id: lastId + 1,
          title: inputText,
          completed: false,
        },
        ...tasks,
      ]);
      setText("");
    }
  };

  const removeTask = (itemId: number) => {
    const newTasks = tasks.filter((item: any) => item.id !== itemId);
    setTasks(newTasks);
  };

  const toggleTodo = (id: number) => {
    setTasks(
      tasks.map((todo: any) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filterTodos = () => {
    setTasks(tasks.filter((task: any) => !task.completed));
  };

  const handlePress = (id: any) => {
    router.push(`/todos/${id}`);
  };

  return (
    <Container style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          maxLength={30}
          placeholder="Add New Task..."
          placeholderTextColor={"grey"}
          style={[styles.input, styles.text]}
          onChangeText={setText}
          value={inputText}
        />
        <Pressable style={styles.addButton} onPress={addTask}>
          <MaterialCommunityIcons
            name="clipboard-plus"
            size={30}
            color={colorScheme == "dark" ? "white" : "black"}
          />
        </Pressable>
        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "light" ? "dark" : "light")
          }
          style={styles.addButton}
        >
          <Octicons
            name={colorScheme === "light" ? "sun" : "moon"}
            color={colorScheme === "light" ? "black" : "white"}
            size={25}
            s
          />
        </Pressable>
      </View>
      <Animated.FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        itemLayoutAnimation={LinearTransition.duration(200)}
        keyboardDismissMode="on-drag"
        ItemSeparatorComponent={separatorComp}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              onPress={() => handlePress(item.id)}
              onLongPress={() => toggleTodo(item.id)}
            >
              <Text
                style={[
                  styles.text,
                  styles.title,
                  item.completed
                    ? { textDecorationLine: "line-through", color: "grey" }
                    : {},
                ]}
              >
                {item.title}
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{ borderless: true, radius: 50, color: "red" }}
              onPress={() => removeTask(item.id)}
            >
              <MaterialCommunityIcons
                name="delete-circle"
                size={35}
                color="red"
              />
            </Pressable>
          </View>
        )}
      />
      <StatusBar style={colorScheme == "dark" ? "light" : "dark"} />
    </Container>
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
    separator: {
      height: 1,
      backgroundColor: colorScheme == "dark" ? "papayawhip" : "black",
      width: "100%",
      marginBottom: 2,
    },
    row: {
      padding: 15,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 20,
      width: "100%",
    },
    text: {
      color: theme.text,
      fontFamily: "Inter_500Medium",
    },
    addButton: {
      marginTop: 11,
      marginLeft: 15,
    },
  });
}
