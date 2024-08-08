import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ statusBarTranslucent: false }}>
        <Stack.Screen
          name="Screen"
          component={Screen}
          options={{
            headerRight: () => (
              <Pressable
                onPress={() => setCount(prev => prev + 1)}
                style={({ pressed }) => [
                  styles.pressable,
                  pressed && { backgroundColor: 'goldenrod' },
                ]}>
                <Text>Press (+)</Text>
              </Pressable>
            ),
            title: count.toString(),
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Screen() {
  const [count, setCount] = React.useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Pressable
        onPress={() => setCount(prev => prev + 1)}
        style={({ pressed }) => [
          styles.pressable,
          pressed && { backgroundColor: 'goldenrod' },
        ]}>
        <Text>Press (+)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'red',
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
});
