import React from "react";
import { createNativeStackNavigator, NativeStackNavigationProp } from "react-native-screens/native-stack";
import { NavigationContainer, ParamListBase } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, View } from "react-native";

const Stack = createNativeStackNavigator();

function ButtonList(props: { navigation: NativeStackNavigationProp<ParamListBase>}): JSX.Element {
  return (
    <View>
      <Button title="PortraitUp" onPress={() => {
        console.log('Enforce PortraitUp')
        props.navigation.setOptions({screenOrientation: 'portrait_up'})
      }} />
      <Button title="LandscapeLeft" onPress={() => {
        console.log('Enforce LandscapeLeft')
        props.navigation.setOptions({screenOrientation: 'landscape_left'})
      }} />
      <Button title="LandscapeRight" onPress={() => {
        console.log('Enforce LandscapeRight')
        props.navigation.setOptions({screenOrientation: 'landscape_right'})
      }} />
    </View>

  );
}

function Second({ navigation }: { navigation: NativeStackNavigationProp<ParamListBase>}): JSX.Element {
  return (
    <View>
      <Button title="Go First" onPress={() => navigation.navigate("First")} />
      <ButtonList navigation={navigation} />
    </View>
  );
}

function First({ navigation }: { navigation: NativeStackNavigationProp<ParamListBase>}): JSX.Element {
  return (
    <View>
      <Button title="Go Second" onPress={() => navigation.navigate("Second")} />
      <ButtonList navigation={navigation} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} options={{
          fullScreenSwipeEnabled: true
        }} />
        <Stack.Screen name="Second" component={Second} options={{
          fullScreenSwipeEnabled: true
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
