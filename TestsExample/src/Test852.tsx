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
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            headerTitleStyle: {
              fontWeight: '300',
            },
          }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            headerTitleStyle: {
              fontWeight: '400',
            },
          }}
        />
        <Stack.Screen
          name="Third"
          component={Third}
          options={{
            headerTitleStyle: {
              fontWeight: '700',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const First = ({ navigation }: Props) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('Second')}
    />
  </View>
);

const Second = ({ navigation }: Props) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Button
      title="Tap me for third screen"
      onPress={() => navigation.navigate('Third')}
    />
  </View>
);

const Third = ({ navigation }: Props) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Button
      title="Tap me for first screen"
      onPress={() => navigation.navigate('First')}
    />
  </View>
);
