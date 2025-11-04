import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../convex/_generated/api";

const images = {
  logo: require('../assets/images/TODO.svg'),
  Check: require('../assets/images/icon-check.svg'),
  Cross: require('../assets/images/icon-cross.svg'),
  Moon: require('../assets/images/icon-moon.svg'),
  Sun: require('../assets/images/icon-sun.svg'),
};

export default function Home() {
  const todos = useQuery(api.todos.get) ?? [];
  const addTodo = useMutation(api.todos.add);
  const toggleTodo = useMutation(api.todos.toggle);
  const removeTodo = useMutation(api.todos.remove);

  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) setIsDarkMode(savedTheme === "dark");
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleAddTodo = async () => {
    if (!inputValue.trim()) return;
    await addTodo({ text: inputValue.trim() });
    setInputValue("");
  };

  const handleToggleTodo = async (id: string) => {
    await toggleTodo({ id });
  };

  const handleRemoveTodo = async (id: string) => {
    await removeTodo({ id });
  };

  const filteredTodos =
    todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    }) ?? [];

  const itemsLeft = todos.filter((t) => !t.completed).length ?? 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <ImageBackground
        source={
          isDarkMode
            ? require("../assets/images/bg-mobile-dark.jpg")
            : require("../assets/images/bg-mobile-light.jpg")
        }
        resizeMode="cover"
        style={styles.header}
      />

      <View style={styles.main}>
        <View style={styles.mainChild}>
          <View style={styles.headerRow}>
            <Image source={images['logo']} />
            <TouchableOpacity onPress={toggleTheme}>
              <Image source={isDarkMode ? images.Sun : images.Moon} />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.card, shadowColor: theme.shadow },
            ]}
          >
            <Text style={[styles.round, { borderColor: theme.border }]}></Text>
            <TextInput
              placeholder="Create a new todo..."
              placeholderTextColor={theme.placeholder}
              style={[styles.input, { color: theme.text }]}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleAddTodo}
              returnKeyType="done"
            />
          </View>

          <View style={[styles.todoListContainer, { backgroundColor: theme.card }]}>
            {filteredTodos.map((todo) => (
              <View key={todo._id} style={[styles.todoList, { borderBottomColor: theme.border }]}>
                <View style={styles.flex}>
                  <TouchableOpacity
                    style={[
                      styles.sround,
                      { borderColor: theme.border },
                      todo.completed && styles.completedRound,
                    ]}
                    onPress={() => handleToggleTodo(todo._id)}
                  >
                    {todo.completed && (
                      <Image source={images['Check']} style={{ width: 15, height: 15 }} resizeMode="contain" />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.todoText,
                      { color: theme.text },
                      todo.completed && styles.completedText,
                    ]}
                  >
                    {todo.text}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => handleRemoveTodo(todo._id)}>
                  <Image source={images['Cross']} style={styles.remove} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.bottom}>
              <Text style={[styles.item, { color: theme.subtext }]}>
                {itemsLeft} items left
              </Text>
            </View>
          </View>

          <View style={[styles.filterContainer, { backgroundColor: theme.card }]}>
            <TouchableOpacity onPress={() => setFilter("all")}>
              <Text
                style={[
                  styles.filterText,
                  { color: theme.subtext },
                  filter === "all" && styles.active,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setFilter("active")}>
              <Text
                style={[
                  styles.filterText,
                  { color: theme.subtext },
                  filter === "active" && styles.active,
                ]}
              >
                Active
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setFilter("completed")}>
              <Text
                style={[
                  styles.filterText,
                  { color: theme.subtext },
                  filter === "completed" && styles.active,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              textAlign: "center",
              color: "hsl(236, 9%, 61%)",
              marginTop: 100,
            }}
          >
            Drag and drop to reorder list
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const lightTheme = {
  background: "hsl(0, 0%, 98%)",
  card: "hsl(0, 0%, 98%)",
  text: "hsl(235, 19%, 35%)",
  subtext: "hsl(236, 9%, 61%)",
  border: "hsl(233, 11%, 84%)",
  placeholder: "hsl(236, 9%, 61%)",
  shadow: "rgba(0,0,0,0.1)",
};

const darkTheme = {
  background: "hsl(235, 21%, 11%)",
  card: "hsl(235, 24%, 19%)",
  text: "hsl(234, 39%, 85%)",
  subtext: "hsl(235, 16%, 43%)",
  border: "hsl(233, 14%, 35%)",
  placeholder: "hsl(234, 39%, 85%)",
  shadow: "rgba(0,0,0,0.5)",
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { width: "100%", minHeight: 200 },
  main: { width: "100%", position: "absolute", alignItems: "center" },
  mainChild: { width: "90%", minHeight: 400, marginTop: 30 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    borderRadius: 6,
    height: 60,
    paddingHorizontal: 10,
  },
  round: { width: 30, height: 30, borderRadius: 100, borderWidth: 1, marginRight: 10 },
  input: { height: 60, width: "100%" },
  todoListContainer: { borderRadius: 6, marginTop: 10 },
  todoList: {
    flexDirection: "row",
    height: 60,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  flex: { flexDirection: "row", alignItems: "center" },
  sround: {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  completedRound: { backgroundColor: "hsl(220, 98%, 61%)", borderColor: "hsl(220, 98%, 61%)" },
  todoText: { fontSize: 16 },
  completedText: { textDecorationLine: "line-through", color: "hsl(236, 9%, 61%)" },
  remove: { marginRight: 20 },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
  },
  item: { fontSize: 14 },
  filterContainer: {
    width: "100%",
    height: 50,
    marginTop: 20,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  filterText: { fontSize: 14 },
  active: { color: "hsl(220, 98%, 61%)", fontWeight: "bold" },
});
