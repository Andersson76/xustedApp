import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import AlbumScreen from "./screens/AlbumScreen";
import { AlbumProvider } from "./AlbumContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AlbumProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Album" component={AlbumScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AlbumProvider>
  );
}
