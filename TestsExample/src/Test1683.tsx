import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme, LightTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react';

const RootStack = createNativeStackNavigator()

const HomeScreen = () => {
  return (
    <View style={styles.container} />
  )
}

const Navigator = () => {
  return (
      <NavigationContainer
        // theme={DefaultTheme}
        theme={DarkTheme}
      >
        <RootStack.Navigator>
          <RootStack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerSearchBarOptions: {}
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
  )
}

export default function App() {
  return (
    <Navigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
});
