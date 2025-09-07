import * as React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

type RootTabParamList = {
  First: undefined;
  Second: undefined;
  Third: undefined
};

type InnerParamList = {
  Inner: undefined;
};

type Props = NativeStackScreenProps<InnerParamList, 'Inner'>;
const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<InnerParamList>();

const options = {
  tabBarIcon: () => null,
};

function RegularScreen({ route }: Props) {
  const { name } = route;
  return (
    <View style={styles.container}>
      <Text>{`${name} Screen`}</Text>
    </View>
  );
}


function FirstStack() {
  return (
    <Stack.Navigator screenOptions={{ title: 'First', statusBarStyle: 'dark' }}>
      <Stack.Screen name="Inner" component={RegularScreen} />
    </Stack.Navigator>
  );
}

function SecondStack() {
  return (
    <Stack.Navigator screenOptions={{ title: 'Second' }}>
      <Stack.Screen name="Inner" component={RegularScreen} />
    </Stack.Navigator>
  );
}

function ThirdStack() {
  return (
    <Stack.Navigator screenOptions={{ title: 'Third' }}>
      <Stack.Screen name="Inner" component={RegularScreen} />
    </Stack.Navigator>
  );
}

function RootStack() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="First" component={FirstStack} options={options} />
      <Tab.Screen name="Second" component={SecondStack} options={options} />
      <Tab.Screen name="Third" component={ThirdStack} options={options} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

