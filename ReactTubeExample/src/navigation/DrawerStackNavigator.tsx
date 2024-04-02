import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LibraryScreen from "../screens/LibraryScreen";

export type RootDrawerParamList = {
  HomeFeed: undefined;
  SearchScreen: undefined;
  LibraryScreen: undefined;
};

const DrawerStack = createNativeStackNavigator<RootDrawerParamList>();

export default function DrawerStackNavigator() {
  return (
    <DrawerStack.Navigator screenOptions={{headerShown: false}}>
      <DrawerStack.Screen name={"HomeFeed"} component={HomeScreen} />
      <DrawerStack.Screen name={"LibraryScreen"} component={LibraryScreen} />
    </DrawerStack.Navigator>
  );
}
