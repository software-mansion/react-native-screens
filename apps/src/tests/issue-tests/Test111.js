import React from 'react';
import { View, Text, Button } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

const Screen2 = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: '#08141B',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Button title="Go back" onPress={() => navigation.goBack()}>
        <Text>to screen 2</Text>
      </Button>
    </View>
  );
};

const Screen1 = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: 'red',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Button
        title="Go to Screen 2"
        onPress={() => navigation.navigate('Screen2')}
      />
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // mode="modal"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}>
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Screen2" component={Screen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
