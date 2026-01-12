import React, { useEffect, useState } from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';

// @ts-ignore: react-native-edge-to-edge is a dependency of example apps, not the library itself,
//             so we get an error here but it works correctly
import { SystemBars } from 'react-native-edge-to-edge';

type RouteParamList = {
  Home: undefined;
  Second: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

function Home({ navigation }: StackNavigationProp) {
  const [style, setStyle] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    SystemBars.setStyle({
      statusBar: style,
      navigationBar: style,
    });
  }, [style]);

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
        <View style={{ padding: 20 }}>
          <Text>
            The goal of this test is to check react-native-edge-to-edge's
            SystemBars.setStyle().
          </Text>
          <Text>
            Props from react-navigation/react-native-screens that modify the
            system bars interfere with the react-native-edge-to-edge's
            SystemBars so in order to test this properly, run this test as the
            main app content (without Example screen menu) by changing App.tsx.
          </Text>
        </View>
        <Button
          title="Change style"
          onPress={() =>
            style === 'dark' ? setStyle('light') : setStyle('dark')
          }
        />
        <Button
          title="Open second"
          onPress={() => navigation.navigate('Second')}
        />
      </View>
    </>
  );
}

function Second({ navigation }: StackNavigationProp) {
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Second" component={Second} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
