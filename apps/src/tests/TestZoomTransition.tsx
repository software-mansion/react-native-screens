import React from "react";
import { Button, View } from "react-native";
import Colors from "../shared/styling/Colors";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/routers";
import { NavigationContainer } from "@react-navigation/native";
import { Rectangle } from "../shared/Rectangle";
import { ZoomTransitionSource } from "react-native-screens";

interface StackRouteParams extends ParamListBase {
  Home: undefined,
  Second: undefined,
}

interface StackRouteProp {
  navigation: NativeStackNavigationProp<StackRouteParams>,
}

const Stack = createNativeStackNavigator<StackRouteParams>();

export default function App() {
  return (
    <AppStack />
  )
}

function AppStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Second' component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function Home({ navigation }: StackRouteProp) {
  return (
    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: Colors.YellowLight60 }}>
      <Button title="Go Second" onPress={() => navigation.navigate('Second')} />
      <View style={{ flexDirection: 'row', backgroundColor: Colors.BlueLight60 }} collapsable={false}>
        <ZoomTransitionSource transitionTag="zoom">
          <Rectangle width={64} height={64} color={Colors.RedLight60} />
        </ZoomTransitionSource>
      </View>
    </View >
  )
}

function Second({ navigation }: StackRouteProp) {
  return (
    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: Colors.PurpleLight60 }}>
      <Button title="Go back" onPress={() => navigation.popTo('Home')} />
    </View>
  )
}

