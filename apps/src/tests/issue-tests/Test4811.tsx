import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';

// https://github.com/software-mansion/react-native-screens/issues/4811 (iOS)
//
// `updateHeaderStateInShadowTreeInContextOfNavigationBar:` loops over `reactSubviews`
// and updates the shadow state of each header subview. The update is synchronous, so
// it can mount a pending commit right away. If that commit adds or removes a header
// subview, `reactSubviews` changes during the loop and iOS throws
// "Collection <__NSArrayM> was mutated while being enumerated".
//
// This test commits as fast as possible and adds, removes and resizes the custom header
// items on every commit. The search bar is mounted after the right item, so the right
// item is never the last element in `reactSubviews` (a change during the last element
// isn't detected by fast enumeration).
//
// Press "Start". Without the fix the app crashes within a few seconds.

const Stack = createNativeStackNavigator();

function HeaderItem({ label, width }: { label: string; width: number }) {
  return (
    <View style={[styles.item, { width }]}>
      <Text numberOfLines={1}>{label}</Text>
    </View>
  );
}

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) {
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      setTick(t => t + 1);
      timer = setTimeout(loop, 0);
    };
    loop();
    return () => clearTimeout(timer);
  }, [running]);

  useLayoutEffect(() => {
    // A new size on every tick, so each header subview gets a new frame.
    const size = (n: number) => 24 + ((tick * n) % 7) * 9;

    navigation.setOptions({
      // Returning `null` unmounts the header subview, a component mounts it again.
      headerLeft: () =>
        tick % 2 === 0 ? <HeaderItem label="L" width={size(3)} /> : null,
      headerTitle: () => <HeaderItem label={`#${tick}`} width={40 + size(5)} />,
      headerRight: () =>
        tick % 3 !== 0 ? <HeaderItem label="R" width={size(2)} /> : null,
      headerSearchBarOptions: {},
    });
  }, [navigation, tick]);

  return (
    <View style={styles.container}>
      <Button
        title={running ? 'Stop' : 'Start'}
        onPress={() => setRunning(r => !r)}
      />
      <Text>Updates: {tick}</Text>
    </View>
  );
}

export default function App() {
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
  },
  item: {
    height: 28,
    borderRadius: 6,
    backgroundColor: '#f2b8b5',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
});
