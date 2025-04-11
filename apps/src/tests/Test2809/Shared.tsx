import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';


export function FinalScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center' }}>
      <Text>VOID</Text>
      <Button title="Pop to top" onPress={() => navigation.popTo('Home')} />
    </View>
  );
}

export function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: 'yellow' }}>
      <Button
        title="Open screen"
        onPress={() => navigation.navigate('Second')}
      />
    </View>
  );
}

export const createStackWithOptions = (options1: NativeStackNavigationOptions, options2: NativeStackNavigationOptions) => () => {
  const Stack = createNativeStackNavigator();

  return (
      <Stack.Navigator>
        <Stack.Screen name="First" component={Home} options={options1} />
        <Stack.Screen name="Second" component={FinalScreen} options={options2} />
      </Stack.Navigator>
  );
};
