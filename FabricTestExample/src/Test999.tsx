import * as React from 'react';
import {Button} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackNavigationProp} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} options={{replaceAnimation: 'push'}}/>
        <Stack.Screen
          name="Second"
          component={Second}
          options={{replaceAnimation: 'pop'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <Button title="Tap me for second screen" onPress={() => navigation.replace('Second')} />

  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <Button title="Tap me for second screen" onPress={() => navigation.replace('First')} />
  );
}

