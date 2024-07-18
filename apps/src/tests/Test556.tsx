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
          headerTitle: () => (
            <View style={styles.container}>
              <Text>Simple Native Stack</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.container}>
              <Text>Right</Text>
            </View>
          ),
        }}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
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
    backgroundColor: 'cyan',
  },
});
