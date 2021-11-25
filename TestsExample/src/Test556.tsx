import * as React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{stackAnimation: 'custom'}}>
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
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <Button title="Tap me for second screen" onPress={() => navigation.replace('Second')} />
    </View>
  );
}

function Second({navigation}) {
  return (
    <View style={{flex: 1, backgroundColor: 'blue'}}>
      <Button title="Tap me for second screen" onPress={() => navigation.replace('First')} />
    </View>
  );
}
