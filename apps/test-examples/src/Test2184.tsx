import React, { useEffect } from 'react';
import { Button } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{ presentation: 'modal', gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const First = ({ navigation }: Props): JSX.Element => {
  return (
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('Second')}
    />
  );
};

const Second = ({ navigation }: Props): JSX.Element => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('gestureCancel', () => {
      console.log('gestureCancel');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Button
      title="Tap me for first screen"
      onPress={() => navigation.goBack()}
    />
  );
};
