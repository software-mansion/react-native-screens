import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Screen = () => {
  return null;
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Screen"
        screenOptions={{
          headerTitle: 'Title',
          headerSearchBarOptions: {
            // Added in https://github.com/software-mansion/react-native-screens/pull/3186
            // to preserve test's original search bar configuration.
            placement: 'stacked',
            onCancelButtonPress: () => {
              console.log('cancel button press');
            },
          },
        }}>
        <Stack.Screen name="Screen" component={Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
