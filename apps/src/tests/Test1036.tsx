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
