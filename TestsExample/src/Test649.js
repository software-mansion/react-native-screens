import * as React from 'react';
import {
  Button,
  ScrollView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerLargeTitle: true,
        }}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen
          name="Second"
          component={Second}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({navigation}) {
  return (
    <ScrollView>
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
    </ScrollView>
  );
}

function Second({navigation}) {
  return (
    <ScrollView>
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
    </ScrollView>
  );
}
