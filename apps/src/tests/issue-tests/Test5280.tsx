import React, { useLayoutEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5280
//
// On Android, a header item is cut at its own edges. The square below has a
// dot reaching past its top-right corner and a hitSlop reaching past every
// edge. In the screen, the dot is whole and a press just outside the square
// counts. In headerRight, only the part of the dot inside the square was
// drawn, and a press just outside the square did nothing.
// Expected: the header's square draws and takes presses as the screen's does.

type StackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function Item({ onPress, testID }: { onPress: () => void; testID: string }) {
  return (
    <Pressable
      hitSlop={12}
      onPress={onPress}
      style={styles.square}
      testID={testID}>
      <View style={styles.dot} />
    </Pressable>
  );
}

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList>;
}) {
  const [headerPresses, setHeaderPresses] = useState(0);
  const [screenPresses, setScreenPresses] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Item
          testID="header-item"
          onPress={() => setHeaderPresses(n => n + 1)}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>The header's item, in the screen:</Text>
      <Item testID="screen-item" onPress={() => setScreenPresses(n => n + 1)} />
      <Text testID="header-presses">Header item presses: {headerPresses}</Text>
      <Text testID="screen-presses">Screen item presses: {screenPresses}</Text>
    </View>
  );
}

export default function Test5280() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: Colors.White,
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: Colors.NavyLight100,
  },
  dot: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.RedLight100,
  },
});
