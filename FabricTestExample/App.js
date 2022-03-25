import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {View, Button, Text} from 'react-native';

const Stack = createNativeStackNavigator();

function First({navigation}) {
  const nav = navigation;
  return (
    <View>
      <Text>First screen</Text>
      <Button
        title="Navigate to second"
        onPress={() => nav.navigate('Second')}
      />
    </View>
  );
}

function Second() {
  return (
    <View>
      <Text>Second screen</Text>
    </View>
  );
}

const App = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        fullScreenGestureEnabled: true,
      }}>
      <Stack.Screen
        name="First"
        options={{
          title: 'Fabric Example',
          headerShown: true,
        }}
        component={First}
      />
      <Stack.Screen name="Second" component={Second} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
