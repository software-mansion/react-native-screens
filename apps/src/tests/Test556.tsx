import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Square } from '../shared';

const Stack = createNativeStackNavigator();

type ScreenBaseProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'fade',
        }}>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            headerTitle: () => (
              <View
                style={[styles.container, { backgroundColor: 'goldenrod' }]}>
                <Text>Hello there!</Text>
              </View>
            ),
            headerRight: () => (
              <View
                style={[styles.container, { backgroundColor: 'lightblue' }]}>
                <Text>Right-1</Text>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            headerTitle: () => (
              <View
                style={[
                  styles.container,
                  { backgroundColor: 'mediumseagreen' },
                ]}>
                <Text>General Kenobi</Text>
              </View>
            ),
            headerRight: () => (
              <View
                style={[
                  styles.container,
                  { backgroundColor: 'mediumvioletred' },
                ]}>
                <Text>Right-2</Text>
              </View>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({ navigation }: ScreenBaseProps) {
  return (
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('Second')}
    />
  );
}

function Second({ navigation }: ScreenBaseProps) {
  const [backButtonVisible, setBackButtonVisible] = React.useState(true);

  return (
    <>
      <Button
        title="Toggle left subview"
        onPress={() => {
          setBackButtonVisible(prev => !prev);
          navigation.setOptions({
            headerLeft: backButtonVisible
              ? () => (
                  <View
                    style={[
                      styles.container,
                      { backgroundColor: 'mediumblue' },
                    ]}>
                    <Text>Left</Text>
                  </View>
                )
              : undefined,
          });
        }}
      />
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.popTo('First')}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
});
