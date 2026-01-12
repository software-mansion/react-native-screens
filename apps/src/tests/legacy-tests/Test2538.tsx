import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

type RouteNavProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

function Home({ navigation }: RouteNavProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightgreen' }}>
      <Text>Home screen</Text>
      <Button title="Go second" onPress={() => navigation.navigate('Second')} />
    </View>
  );
}

function Second({ navigation }: RouteNavProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
      <Text>Second screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Second" component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
