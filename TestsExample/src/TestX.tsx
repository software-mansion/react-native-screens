import React from 'react';
import { Image, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

function First() {
  return (
    <View>
      <Element />
    </View>
  );
}

function Element() {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#FADFAD',
      }}>
      <Image source={require('./tf.png')} />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            fullScreenSwipeEnabled: true,
            stackAnimation: 'default',
            customAnimationOnSwipe: true,
            headerLargeTitle: true,
          }}>
          <Stack.Screen name="First" component={First} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
