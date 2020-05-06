import * as React from 'react';
import { View, Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

enableScreens();
function HomeScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Click me" onPress={() => navigation.navigate('Edit')} />
    </View>
  );
}

function EditScreen({ navigation, route }) {
  return (
    <Button
      title="Click me"
      onPress={() => {
        navigation.navigate('EditStack');
      }}
    />
  );
}

function AnotherScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>
        Change the tab to the first one and see that you came back to
        HomeScreen. Look at the PR to see the details why it happens
      </Text>
    </View>
  );
}

const Tab = createMaterialBottomTabNavigator();

function HomeStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Edit" component={EditScreen} />
    </Stack.Navigator>
  );
}

function EditStack() {
  const Stack1 = createNativeStackNavigator();
  return (
    <Stack1.Navigator screenOptions={{ gestureEnabled: false }}>
      <Stack1.Screen name="AnotherScreen" component={AnotherScreen} />
    </Stack1.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HomeStack" component={HomeStack} />
        <Tab.Screen name="EditStack" component={EditStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
