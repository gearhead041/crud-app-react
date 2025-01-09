import { Colors } from "@/constants/Colors";
import {
  Appearance,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  FlatList,
  TextInput,
  Pressable,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { data as TODOS } from "@/data/todos";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";

export default function Index() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme == "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const Container = Platform.OS == "web" ? ScrollView : SafeAreaView;
  const separatorComp: any = <View style={styles.separator} />;
  const [inputText, setText] = useState("");
  const [tasks, setTasks] = useState(TODOS);

  const addTask = () => {
    if (inputText.trim()) {
      const lastId = tasks.length > 0 ? tasks[tasks.length - 1].id : 0;
      tasks.push({
        id: lastId + 1,
        title: inputText,
        completed: false,
      });
      setTasks(tasks);
      setText("");
    }
  };

  const removeTask = (itemId: number) => {
    const newTasks = tasks.filter((item: any) => item.id !== itemId);
    setTasks(newTasks);
  };

  const filterTodos = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  return (
    <Container style={styles.contentContainer}>
      <StatusBar hidden={true} />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add New Task..."
          placeholderTextColor={"grey"}
          style={[styles.input, styles.text]}
          onChangeText={setText}
          value={inputText}
        />
        <Pressable style={styles.addButton} onPress={addTask}>
          <Feather
            name="plus-circle"
            size={30}
            color={colorScheme == "dark" ? "white" : "black"}
          />
        </Pressable>
      </View>
      <FlatList
        data={tasks.toReversed()}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={separatorComp}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <View style={styles.row}>
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
            <Pressable onPress={() => removeTask(item.id)}>
              <MaterialCommunityIcons
                name="delete-circle"
                size={35}
                color="red"
              />
            </Pressable>
          </View>
        )}
      />
    </Container>
  );
}

function createStyles(theme: any, colorScheme: any) {
  return StyleSheet.create({
    input: {
      height: 50,
      width: "80%",
      borderWidth: 1,
      borderColor: theme.text,
      borderRadius: 10,
      paddingTop: 5,
      paddingLeft: 10,
      fontSize: 20,
      flexDirection: "row",
    },
    inputContainer: {
      padding: 5,
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center",
    },
    contentContainer: {
      paddingTop: 10,
      paddingHorizontal: 5,
      backgroundColor: theme.background,
    },
    separator: {
      height: 1,
      backgroundColor: colorScheme == "dark" ? "papayawhip" : "black",
      width: "100%",
      marginBottom: 2,
    },
    row: {
      padding: 15,
      marginBottom: 2,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 20,
      width: "100%",
    },
    text: {
      color: theme.text,
    },
    addButton: {
      marginTop: 7,
    },
  });
}
