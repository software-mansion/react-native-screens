import React from 'react';
import { View, Button } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

enableScreens();

const Tab = createBottomTabNavigator();
export default function TabNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator lazy={false}>
        <Tab.Screen name="Tab1" component={Tab1} />
        <Tab.Screen name="Tab2" component={StackNav} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();
function StackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Screen1" component={Screen1} options={{ headerShown: true }} />
      <Stack.Screen name="Screen2" component={Screen2} />
    </Stack.Navigator>
  );
}

const Tab1 = () => <View style={{ flex: 1, backgroundColor: 'red' }} />;
const Screen1 = ({ navigation }) => (
  <View style={{ flex: 1, backgroundColor: 'green', justifyContent: 'center' }}>
    <Button title="navigate" onPress={() => navigation.navigate('Screen2')} />
  </View>
);
const Screen2 = () => <View style={{ flex: 1 }} />;
