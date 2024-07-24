import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'fade',
        }}>
        <Stack.Screen name="First" component={First} options={{
          headerTitle: () => (
            <View style={[styles.container, { backgroundColor: 'goldenrod' }]}>
              <Text>Hello there!</Text>
            </View>
          ),
          headerRight: () => (
            <View style={[styles.container, { backgroundColor: 'lightblue' }]}>
              <Text>Right-1</Text>
            </View>
          ),
        }} />
        <Stack.Screen name="Second" component={Second} options={{
          headerTitle: () => (
            <View style={[styles.container, { backgroundColor: 'mediumseagreen' }]}>
              <Text>General Kenobi</Text>
            </View>
          ),
          headerRight: () => (
            <View style={[styles.container, { backgroundColor: 'mediumvioletred' }]}>
              <Text>Right-2</Text>
            </View>
          ),
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({ navigation }: any) {
  return (
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('Second')}
    />
  );
}

function Second({ navigation }: any) {
  return (
    <Button
      title="Tap me for first screen"
      onPress={() => navigation.popTo('First')}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
});
