import * as React from 'react';

import { View, Text, StyleSheet, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

type RootTabParamList = {
  First: undefined;
  Second: undefined;
  Third: undefined
};

type InnerParamList = {
  Inner: undefined;
  Second: undefined;
};

type Props = NativeStackScreenProps<InnerParamList, 'Inner'>;
const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<InnerParamList>();

const options = {
  tabBarIcon: () => null,
};

function RegularScreen({ route }: Props) {
  const { name } = route;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>{`${name} Screen`}</Text>
      <Button title='Push Second' onPress={() => navigation.navigate('Second')} />
    </View>
  );
}

function SecondScreen({ route }: Props) {
  const { name } = route;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>{`${name} Screen`}</Text>
      <Button title='Go back' onPress={() => navigation.popTo('Inner')} />
    </View>
  );
}


function FirstStack() {
  return (
    <Stack.Navigator screenOptions={{ title: 'First', statusBarStyle: 'dark' }}>
      <Stack.Screen name="Inner" component={RegularScreen} />
      <Stack.Screen name="Second" component={SecondScreen} />
    </Stack.Navigator>
  );
}

function SecondStack() {
  return (
    <Stack.Navigator screenOptions={{ title: 'Second', statusBarStyle: 'dark' }}>
      <Stack.Screen name="Inner" component={RegularScreen} />
      <Stack.Screen name="Second" component={SecondScreen} />
    </Stack.Navigator>
  );
}

function ThirdStack() {
  return (
    <Stack.Navigator screenOptions={{ title: 'Third', statusBarStyle: 'dark' }}>
      <Stack.Screen name="Inner" component={RegularScreen} />
      <Stack.Screen name="Second" component={SecondScreen} />
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

