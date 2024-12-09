import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { Button, Square } from '../shared';

type ParamList = {
  Home: undefined;
  Second: undefined;
  Third: undefined;
}

type RoutePropBase<RouteName extends keyof ParamList> = {
  navigation: NativeStackNavigationProp<ParamList>,
  route: RouteProp<ParamList, RouteName>;
}

const Stack = createNativeStackNavigator<ParamList>();

function Contents(): React.ReactNode {
  return (
    <View>
      <Square size={200} color="lightblue" />
    </View>
  );
}

function Home({ navigation }: RoutePropBase<'Home'>): React.ReactNode {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightgreen', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '100%', height: 20, backgroundColor: 'red' }} />
      <Button title="Go Second" onPress={() => navigation.navigate('Second')} />
      <Contents />
    </View>
  );
}


function Second({ navigation }: RoutePropBase<'Second'>): React.ReactNode {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightblue', justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Go Third" onPress={() => navigation.navigate('Third')} />
      <Button title="Go back" onPress={() => navigation.popTo('Home')} />
      <Contents />
    </View>
  );
}

function Third({ navigation }: RoutePropBase<'Third'>): React.ReactNode {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightcoral', justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Go back" onPress={() => navigation.popTo('Second')} />
      <Contents />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        fullScreenGestureEnabled: true,
        animation: 'simple_push',
        //animationMatchesGesture: true,
      }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Second" component={Second} options={{
          headerShown: false,
        }}/>
        <Stack.Screen name="Third" component={Third} options={{
          headerShown: true,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
