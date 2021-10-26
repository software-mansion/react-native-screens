import * as React from 'react';
import {Button} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackNavigationProp} from 'react-native-screens/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} options={{stackAnimation: 'none'}}/>
        <Stack.Screen
          name="Second"
          component={Second}
          options={{stackAnimation: 'slide_from_bottom', replaceAnimation: 'push'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({navigation} : Props) {
  return (
    <>
      <Button title="Tap me for push second screen" onPress={() => navigation.push('Second')} />
      <Button title="Tap me for replace with second screen" onPress={() => navigation.replace('Second')} />
      <Button title="Tap me for go back" onPress={() => navigation.goBack()} />
    </>
  );
}

function Second({navigation} : Props) {
  return (
    <>
      <Button title="Tap me for push first screen" onPress={() => navigation.push('First')} />
      <Button title="Tap me for replace with first screen" onPress={() => navigation.replace('First')} />
      <Button title="Tap me for go back" onPress={() => navigation.goBack()} />
    </>
  );
}
