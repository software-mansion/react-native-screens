import React from 'react';
import {Button, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

// swipe gesture works when using react-native-screens/native-stack
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from 'react-native-screens/native-stack';

// but it doesn't work with @react-navigation/native-stack
// use `@react-navigation/native@^6` & `@react-navigation/native-stack@^6` to test this
// import {
//   createNativeStackNavigator,
//   NativeStackScreenProps,
// } from '@react-navigation/native-stack';

type StackParams = {
  Screen: undefined;
  Screen2: undefined;
};

const Stack = createNativeStackNavigator<StackParams>();

const Screen2 = () => (
  <View style={{paddingTop: 200}}>
    <Text>
      Swipe gesture doesn't work on iOS 12 in @react-navigation/native-stack
    </Text>
  </View>
);

const Screen = ({navigation}: NativeStackScreenProps<StackParams>) => (
  <View style={{paddingTop: 200}}>
    <Button
      title="Go to Screen2"
      onPress={() => navigation.navigate('Screen2')}
    />
  </View>
);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Screen"
      screenOptions={
        {
          // headerShown: false,
          // gestureEnabled: false,
          // direction: 'rtl',
          // animation: 'simple_push',
        }
      }>
      <Stack.Screen name="Screen" component={Screen} />
      <Stack.Screen name="Screen2" component={Screen2} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
