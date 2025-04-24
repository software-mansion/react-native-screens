import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const TabThreeStack = createNativeStackNavigator();

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
  const navigation = useNavigation();

  React.useEffect(() => {
    // console.log("PRELOAD RootSheet");
    // navigation.preload('RootSheet');
  }, [navigation]);

  return (
    <Tabs.Navigator>
      <Tabs.Screen name="TabOne" component={TabOne} />
      <Tabs.Screen name="TabTwo" component={TabTwo} />
      <Tabs.Screen name="TabThree" component={TabThree} listeners={({ route, navigation }) => {
        return {
          tabPress: (event) => {
            event.preventDefault();
            console.log("PRELOAD TabThree");
            navigation.preload('TabThree');
            navigation.navigate('RootSheet');
          },
        };
      }} />
    </Tabs.Navigator>
  );
}

function RootSheet() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: 'seagreen' }}>
      <Text>RootSheet</Text>
      <Button title="Open TabTwo" onPress={() => navigation.navigate('TabsHost', { screen: 'TabTwo' })} />
      <Button title="Open TabThree" onPress={() => navigation.navigate('TabsHost', { screen: 'TabThree' })} />
      <Button title="Open TabThreeStackScreenOne" onPress={() => navigation.navigate('TabsHost', { screen: 'TabThree', params: { screen: 'TabThreeStackScreenOne' } })} />
      <Button title="Open TabThreeStackScreenTwo" onPress={() => navigation.navigate('TabsHost', { screen: 'TabThree', params: { screen: 'TabThreeStackScreenTwo' } })} />
      <Button title="Open TabThreeStackScreenOne OS" onPress={() => navigation.navigate('TabThreeStackScreenOne')} />
      <Button title="Open TabThreeStackScreenTwo OS" onPress={() => navigation.navigate('TabThreeStackScreenTwo')} />
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
    <TabThreeStackHost />
  );
}

function TabThreeStackScreenOne() {
  return (
    <View style={{ flex: 1, backgroundColor: 'orange' }}>
      <Text>TabThreeStackScreenOne</Text>
    </View>
  );
}

function TabThreeStackScreenTwo() {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
      <Text>TabThreeStackScreenTwo</Text>
    </View>
  );
}

function TabThreeStackHost() {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen name="TabThreeStackScreenOne" component={TabThreeStackScreenOne} />
      <TabThreeStack.Screen name="TabThreeStackScreenTwo" component={TabThreeStackScreenTwo} />
    </TabThreeStack.Navigator>

  );
}

function App() {
  return (
    <NavigationContainer navigationInChildEnabled onStateChange={(state) => console.log("Navigation State Change", state)} onUnhandledAction={(action) => console.log("ON UNHANDLED ACTION", action)}>
      <RootStackHost />
    </NavigationContainer>
  );
}
export default App;
