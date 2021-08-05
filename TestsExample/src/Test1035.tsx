import * as React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import { SafeAreaProvider, useSafeAreaFrame } from 'react-native-safe-area-context';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const Stack = createNativeStackNavigator();

export default function Wrapper(): JSX.Element {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  )
}

function App(): JSX.Element {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="First" component={First} options={{stackAnimation: 'custom', animationSpec:{exiting: {duration: 2000}}}}/>
          <Stack.Screen name="Second" component={Second} options={{
            stackAnimation: 'custom',
            animationSpec: {
              entering: {
                alpha: {
                  value: 0,
                },
                translate: {
                  x: -200,
                  y: -200,
                },
                rotate: {
                  degrees: 50,
                },
                scale: {
                  x: 0.5,
                  y: 0.5,
                  duration: 500,
                  interpolator: 'linear',
                },
                interpolator: 'easeIn',
                duration: 1000,
                pivot: {
                  x: useSafeAreaFrame().width / 2,
                  y: useSafeAreaFrame().height / 2,
                }
              },
              exiting: {
                alpha: {
                  value: 0,
                },
                translate: {
                  x: -200,
                  y: -200,
                },
                rotate: {
                  degrees: 50,
                },
                scale: {
                  x: 0.5,
                  y: 0.5
                },
                interpolator: 'linear',
                pivot: {
                  x: useSafeAreaFrame().width / 2,
                  y: useSafeAreaFrame().height / 2,
                }
              }
            }
          }}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const First = ({navigation}: Props): JSX.Element => (
  <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'blue'}}>
    <Button
      title="Tap me for the second screen"
      onPress={() => navigation.navigate('Second')}
    />
    <Button
      title="Replace with second screen"
      onPress={() => navigation.replace('Second')}
    />
  </View>
);

const Second = ({navigation}: Props): JSX.Element => (
  <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'red'}}>
    <Button
      title="Tap me to go back"
      onPress={() => navigation.goBack()}
    />
    <Button
      title="Replace with first screen"
      onPress={() => navigation.replace('First')}
    />
  </View>
);
