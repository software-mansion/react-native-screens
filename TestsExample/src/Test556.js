import * as React from 'react';
import {Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{backButtonMenuHidden: true}}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen
          name="Second"
          component={Second}
        />
        <Stack.Screen
          name="Third"
          component={Third}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({navigation}) {
  return (
    <Button title="Tap me for second screen" onPress={() => navigation.navigate('Second')} />

  );
}

function Second({navigation}) {
  return (
    <Button title="Tap me for third screen" onPress={() => navigation.navigate('Third')} />
  );
}

function Third({navigation}) {
  return (
    <Button title="Tap me for first screen" onPress={() => navigation.navigate('First')} />
  );
}
