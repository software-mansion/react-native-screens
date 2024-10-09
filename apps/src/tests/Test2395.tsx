import * as React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Title"
          component={Screen}
          options={{
            headerRight: () => (
              <View
                style={{
                  backgroundColor: 'lightblue',
                  padding: 3,
                  height: 200,
                }}>
                <Text>Right</Text>
              </View>
            ),
            headerLeft: () => (
              <View
                style={{
                  backgroundColor: 'goldenrod',
                  padding: 8,
                }}>
                <Text>Left</Text>
              </View>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Screen() {
  return (
    <FlatList
      style={styles.container}
      data={Array.from({ length: 20 }).fill(0) as number[]}
      renderItem={({ index }) => (
        <Pressable
          key={index}
          style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
          <Text style={styles.text}>List item {index + 1}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'mediumseagreen',
  },
  text: {
    fontSize: 24,
    color: 'black',
    padding: 10,
  },
  pressed: {
    backgroundColor: 'seagreen',
  },
});
