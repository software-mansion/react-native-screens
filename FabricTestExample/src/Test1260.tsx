import * as React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackNavigationProp} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        swipeDirection: 'vertical',
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

function First({navigation}: {navigation: NativeStackNavigationProp<ParamListBase>}) {
  return (
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <Button title="Tap me for second screen" onPress={() => navigation.navigate('Second')} />
    </View>

  );
}

function Second({navigation}: {navigation: NativeStackNavigationProp<ParamListBase>}) {
  return (
    <View style={{flex: 1, backgroundColor: 'blue'}}>
      <Button title="Tap me for second screen" onPress={() => navigation.navigate('First')} />
    </View>
  );
}
