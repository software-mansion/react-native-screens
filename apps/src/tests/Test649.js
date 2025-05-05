import * as React from 'react';
import { Button, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} options={{
          headerLargeTitle: true,
        }}/>
        <Stack.Screen name="Second" component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ marginTop: 160, height: 1500 }}>
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
        testID="first-button-go-to-second"
      />
    </ScrollView>
  );
}

function Second({ navigation }) {
  return (
    <ScrollView>
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.popTo('First')}
        testID="second-button-go-to-first"
      />
    </ScrollView>
  );
}
