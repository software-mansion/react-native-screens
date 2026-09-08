import React from 'react';
import { Button, SafeAreaView, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const TestScreen = ({ navigation }): React.JSX.Element => {
  return (
    <SafeAreaView>
      <Button
        title={
          'Click me and drag around a bit and I should log something still'
        }
        onPress={() => {
          console.log(Date.now());
        }}
      />
      <Button
        title={'Navigate to modal'}
        onPress={() => {
          navigation.navigate('Test2');
        }}
      />
    </SafeAreaView>
  );
};
function App(): React.JSX.Element {
  return (
    <>
      <View style={{ width: 100, height: 200, backgroundColor: 'red' }} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Test"
          screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="Test"
            component={TestScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Test2"
            component={TestScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
