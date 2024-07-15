import * as React from 'react';
import { Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'fade',
          headerTitle: () => <Text>Simple Native Stack</Text>,
        }}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({ navigation }: any) {
  return (
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('Second')}
    />
  );
}

function Second({ navigation }: any) {
  return (
    <Button
      title="Tap me for first screen"
      onPress={() => navigation.popTo('First')}
    />
  );
}
