import React, { useCallback, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5063
//
// On iOS, a `TextInput` with `autoFocus` on a native stack screen pushed with
// any custom animation (`none`, `simple_push`, `fade`, ...) fires `onFocus`,
// then a spurious `onBlur`, then `onFocus` again while the screen mounts. The
// input ends up focused and the keyboard stays open, so only JS sees the blur.
// With `animation: 'default'` there is no blur.

type Routes = {
  Home: undefined;
  None: undefined;
  SimplePush: undefined;
  Fade: undefined;
  Default: undefined;
};

const Stack = createNativeStackNavigator<Routes>();

function Home({ navigation }: NativeStackScreenProps<Routes, 'Home'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Open each screen. The input autofocuses and the log below it must show
        exactly one "focus" and no "blur". Before the fix, every animation but
        "default" logs "focus, blur, focus".
      </Text>
      <Button
        testID="home-none"
        title="animation: none"
        onPress={() => navigation.navigate('None')}
      />
      <Button
        testID="home-simple-push"
        title="animation: simple_push"
        onPress={() => navigation.navigate('SimplePush')}
      />
      <Button
        testID="home-fade"
        title="animation: fade"
        onPress={() => navigation.navigate('Fade')}
      />
      <Button
        testID="home-default"
        title="animation: default"
        onPress={() => navigation.navigate('Default')}
      />
    </View>
  );
}

function AutoFocusScreen() {
  const [events, setEvents] = useState<string[]>([]);
  const log = useCallback(
    (event: string) => setEvents(previous => [...previous, event]),
    [],
  );

  return (
    <View style={styles.container}>
      <TextInput
        testID="autofocus-input"
        autoFocus
        placeholder="Autofocused input"
        style={styles.input}
        onFocus={() => log('focus')}
        onBlur={() => log('blur')}
      />
      <Text testID="focus-events">
        Events: {events.length > 0 ? events.join(', ') : '(none)'}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="None"
          component={AutoFocusScreen}
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="SimplePush"
          component={AutoFocusScreen}
          options={{ animation: 'simple_push' }}
        />
        <Stack.Screen
          name="Fade"
          component={AutoFocusScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Default"
          component={AutoFocusScreen}
          options={{ animation: 'default' }}
        />
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
    padding: 24,
  },
  instructions: {
    textAlign: 'center',
  },
  input: {
    alignSelf: 'stretch',
    borderWidth: 1,
    padding: 8,
  },
});
