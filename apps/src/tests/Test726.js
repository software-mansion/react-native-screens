import * as React from 'react';
import { Text, TextInput, View, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function TestScreen({ navigation }) {
  return (
    <View style={styles.content}>
      <Button
        title="PUSH ME"
        onPress={() => navigation.push('Test')}
        style={styles.button}
      />
    </View>
  );
}

function TestScreen2() {
  return (
    <View style={styles.content}>
      <Text>Try to swipe back, it will freeze</Text>
      <TextInput autoFocus />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator keyboardHandlingEnabled={false}>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Test" component={TestScreen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  button: { margin: 8 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
