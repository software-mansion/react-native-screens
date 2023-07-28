import * as React from 'react';

import { View, Button } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="BottomTabStack"
          component={HomeScreen}
          options={{ orientation: 'portrait' }}
        />

        <Stack.Screen
          name="Landscape"
          component={LandscapeScreen}
          options={{
            orientation: 'landscape_right',
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const BottomNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
};

const HomeScreen = props => {
  return (
    <View style={{ flex: 1, backgroundColor: 'gold' }}>
      <Button
        title="Navigate to Landscape screen"
        onPress={() => props.navigation.navigate('Landscape')}
      />
    </View>
  );
};

const LandscapeScreen = props => {
  return (
    <View style={{ flex: 1, backgroundColor: 'purple' }}>
      <Button title="Back" onPress={props.navigation.goBack} />
    </View>
  );
};

export default App;
