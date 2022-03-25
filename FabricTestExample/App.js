import React from 'react';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {View, Button, Text} from 'react-native';

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

const Stack = createNativeStackNavigator();

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
          headerShown: false,
        }}
        component={First}
      />
      <Stack.Screen name="HeaderDemo" component={Second} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
