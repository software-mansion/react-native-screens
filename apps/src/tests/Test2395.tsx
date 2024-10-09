import * as React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
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
            headerLargeTitle: true,
            headerRight: () => (
              <View
                style={{
                  backgroundColor: 'lightblue',
                  padding: 3,
                  height: 100,
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

function Item({ children, ...props }: ViewProps) {
  return (
    <View style={styles.item} {...props}>
      <Image source={require('../assets/trees.jpg')} style={styles.image} />
      <Text style={styles.text}>{children}</Text>
    </View>
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
          <Item>List item {index + 1}</Item>
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
  image: {
    width: 50,
    height: 50,
  },
  pressed: {
    backgroundColor: 'seagreen',
  },
});
