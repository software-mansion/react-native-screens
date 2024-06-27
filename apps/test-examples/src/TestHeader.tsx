import * as React from 'react';
import { Button, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            headerShown: true,
            statusBarTranslucent: false,
            // headerTitleStyle: {
            //   fontSize: 64,
            // }
          }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Third"
          component={Third}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const First = ({ navigation }: Props) => (
  <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: 'seagreen' }}>
    <View style={{ height: 100, width: 100, justifyContent: 'flex-start', backgroundColor: 'blue' }} />
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('Second')}
    />
    <View style={{ height: 100, width: 100, justifyContent: 'flex-end', backgroundColor: 'red' }} />
  </View>
);

const Second = ({ navigation }: Props) => (
  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'steelblue' }}>
    <Button
      title="Tap me for first screen"
      onPress={() => navigation.navigate('First')}
    />
    <Button
      title="Tap me for third screen"
      onPress={() => navigation.navigate('Third')}
    />
  </View>
);

const Third = ({ navigation }: Props) => (
  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'salmon' }}>
    <Button
      title="Tap me for first screen"
      onPress={() => navigation.navigate('First')}
    />
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('Second')}
    />
    <Button
      title="Tap me for third screen"
      onPress={() => navigation.navigate('Third')}
    />
  </View>
);
