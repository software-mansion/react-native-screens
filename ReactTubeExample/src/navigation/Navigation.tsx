import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import RootStackNavigator from "./RootStackNavigator";
import {DefaultTheme, DarkTheme} from "@react-navigation/native";
import {useAppStyle} from "../context/AppStyleContext";

export default function Navigation() {
  const {type} = useAppStyle();

  return (
    <NavigationContainer theme={type === "dark" ? DarkTheme : DefaultTheme}>
      <RootStackNavigator />
    </NavigationContainer>
  );
}
