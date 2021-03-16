import * as React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
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
          animationTypeForReplace: 'push',
          // replaceAnimation: 'push',
        }}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const First = ({navigation}: Props) => (
  <View style={{flex: 1, justifyContent: 'center'}}>
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.replace('Second')}
    />
  </View>
);

const Second = ({navigation}: Props) => (
  <View style={{flex: 1, justifyContent: 'center'}}>
    <Button
      title="Tap me for first screen"
      onPress={() => navigation.replace('First')}
    />
  </View>
);
