import * as React from 'react';
import {Button} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackNavigationProp, useHeaderHeight} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{stackPresentation: 'formSheet', headerShown: false}}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen
          name="Second"
          component={Second}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({navigation}: {navigation: NativeStackNavigationProp<ParamListBase>}) {
  console.log(useHeaderHeight());
  return (
    <Button title="Tap me for second screen" onPress={() => navigation.navigate('Second')} />

  );
}

function Second({navigation}: {navigation: NativeStackNavigationProp<ParamListBase>}) {
  console.log(useHeaderHeight());
  return (
    <Button title="Tap me for first screen" onPress={() => navigation.navigate('First')} />
  );
}

