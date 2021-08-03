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
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} options={{
          stackAnimation: 'custom',
          animationSpec: {
            entering: {
              alpha: {
                fromAlpha: 0.0,
                toAlpha: 1.0,
              },
              translate: {
                fromXDelta: -200,
                toXDelta: 0,
                fromYDelta: -200,
                toYDelta: 0,
              },
              rotate: {
                fromDegrees: 50,
                toDegrees: 0,
              },
              scale: {
                fromX: 0.5,
                toX: 1.0,
                fromY: 0.5,
                toY: 1.0,
              }
            },
            exiting: {
              alpha: {
                fromAlpha: 1.0,
                toAlpha: 0.0,
              },
              translate: {
                fromXDelta: 0,
                toXDelta: -200,
                fromYDelta: 0,
                toYDelta: -200,
              },
              rotate: {
                fromDegrees: 0,
                toDegrees: 50,
              },
              scale: {
                fromX: 1.0,
                toX: 0.5,
                fromY: 1.0,
                toY: 0.5,
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
