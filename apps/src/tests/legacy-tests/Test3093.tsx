import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, ScrollView } from 'react-native';
import Colors from '../../shared/styling/Colors';

type StackRouteParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
  Screen4: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();

function makeScreen(route: keyof StackRouteParamList, navigateTo?: keyof StackRouteParamList) {
  return function Screen({ navigation }: StackNavigationProp) {
    return (
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <Text>{route}</Text>
        { navigateTo != undefined && <Button title={"Go to " + navigateTo} onPress={() => navigation.navigate(navigateTo)} /> }
      </ScrollView>
    )
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        fullScreenGestureEnabled: true,
        headerStyle: {
          backgroundColor: Colors.PurpleDark120
        }
      }}>
      <Stack.Group>
        <Stack.Screen name="Screen1" component={makeScreen("Screen1", "Screen2")}/>
        <Stack.Screen name="Screen2" component={makeScreen("Screen2", "Screen3")}/>
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Screen3" component={makeScreen("Screen3", "Screen4")}/>
        <Stack.Screen name="Screen4" component={makeScreen("Screen4")}/>
      </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
