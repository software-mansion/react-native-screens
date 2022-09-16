/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 */

import React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from 'react-native-screens/native-stack';

type Screens = {
  'Second Screen': undefined;
  'Screen With a Ridiculously Long Title and then some': undefined;
};

const HomeScreen = ({navigation, route}: NativeStackScreenProps<Screens>) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{route.name}</Text>
      <Button
        title="Navigate to second screen"
        onPress={() => {
          navigation.push('Second Screen');
        }}
      />
    </View>
  );
};

const SecondScreen = ({route}: NativeStackScreenProps<Screens>) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{route.name}</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen With a Ridiculously Long Title and then some"
          component={HomeScreen}
          options={{
            headerShown: false,
            headerTitle: 'Home',
          }}
        />
        <Stack.Screen
          name="Second Screen"
          component={SecondScreen}
          options={{
            headerBackTitleStyle: {
              fontFamily: 'AvenirNextCondensed-DemiBoldItalic',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
