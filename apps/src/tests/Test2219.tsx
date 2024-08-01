import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            headerLeft: () => (
              <Pressable
                style={[styles.pressable, { backgroundColor: 'goldenrod' }]}
                onPressIn={() => console.log('does work')}>
                <Text>Left</Text>
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                style={[styles.pressable, { backgroundColor: 'lightblue' }]}
                onPress={() => console.log('does not work')}>
                <Text>Right</Text>
              </Pressable>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First() {
  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={() => console.log('does work')}
        style={[styles.pressable, { backgroundColor: 'lightblue' }]}>
        <Text>Tap me for second screen by press in</Text>
      </Pressable>
      <Pressable
        onPress={() => console.log('does not work')}
        style={[styles.pressable, { backgroundColor: 'goldenrod' }]}>
        <Text>Tap me for second screen by press</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    padding: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
});
