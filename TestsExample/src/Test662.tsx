import * as React from 'react';
import { Button, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackAnimation: 'slide_from_bottom',
          stackPresentation: 'transparentModal',
        }}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
        <Stack.Screen name="Third" component={Third} />
        <Stack.Screen name="Fourth" component={Fourth} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const First = ({ navigation }: Props): JSX.Element => (
  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'blue' }}>
    <Button
      title="Tap me for the second screen"
      onPress={() => navigation.navigate('Second')}
    />
  </View>
);

const Second = ({ navigation }: Props): JSX.Element => (
  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'red' }}>
    <Button
      title="Tap me for the third screen"
      onPress={() => navigation.navigate('Third')}
    />
  </View>
);

const Third = ({ navigation }: Props): JSX.Element => (
  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'purple' }}>
    <Button
      title="Tap me for fourth screen"
      onPress={() => navigation.navigate('Fourth')}
    />
  </View>
);

const Fourth = ({ navigation }: Props): JSX.Element => (
  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'orange' }}>
    <Button
      title="Tap me for first screen"
      onPress={() => navigation.navigate('First')}
    />
  </View>
);
