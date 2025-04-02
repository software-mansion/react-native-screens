import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function RootStackHost() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="TabsHost" component={TabsHost} options={{
        headerShown: false,
      }} />
      <RootStack.Screen name="RootSheet" component={RootSheet} options={{
        presentation: 'formSheet',
        sheetAllowedDetents: [0.54, 1],
        headerShown: false,
        sheetCornerRadius: 12,
        contentStyle: {

        },
      }} />
    </RootStack.Navigator>
  );
}

function TabsHost() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="TabOne" component={TabOne} />
      <Tabs.Screen name="TabTwo" component={TabTwo} />
      <Tabs.Screen name="TabThree" component={TabThree} listeners={({ route, navigation }) => {
        return {
          tabPress: (event) => {
            event.preventDefault();
            navigation.preload('TabThree');
            navigation.navigate('RootSheet');
          },
        };
      }} />
    </Tabs.Navigator>
  );
}

function RootHome() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: 'seagreen' }}>
      <Text>RootHome</Text>
      <Button title="Open TabThree" onPress={() => navigation.navigate('TabsHost', { screen: 'TabThree' })} />
    </View>
  );
}

function RootSheet() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: 'seagreen' }}>
      <Text>RootSheet</Text>
      <Button title="Open TabTwo" onPress={() => navigation.navigate('TabsHost', { screen: 'TabTwo' })} />
      <Button title="Open TabThree" onPress={() => navigation.navigate('TabsHost', { screen: 'TabThree' })} />
    </View>
  );
}

function TabOne() {
  return (
    <View style={{ flex: 1, backgroundColor: 'orange' }}>
      <Text>TabOne</Text>
    </View>
  );
}

function TabTwo() {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
      <Text>TabTwo</Text>
    </View>
  );
}

function TabThree() {
  return (
    <View style={{ flex: 1, backgroundColor: 'darkgreen' }}>
      <Text>TabThree</Text>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <RootStackHost />
    </NavigationContainer>
  );
}
export default App;
