import * as React from 'react';
import {Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
      animationEnabled: false,
    }}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen
          name="Second"
          component={Second}
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
    <Button title="Tap me for second screen" onPress={() => navigation.navigate('First')} />
  );
}

