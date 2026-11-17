import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useAnimatedKeyboard } from 'react-native-reanimated';

type Routes = { Home: undefined; Sheet: undefined; KeyboardSheet: undefined };

const Stack = createNativeStackNavigator<Routes>();

function KeyboardProbe() {
  useAnimatedKeyboard();
  return <View style={styles.probeBar} />;
}

function Home({ navigation }: NativeStackScreenProps<Routes, 'Home'>) {
  const [probeMounted, setProbeMounted] = useState(false);
  return (
    <View style={styles.home}>
      {probeMounted && <KeyboardProbe />}
      <Text style={styles.instructions}>
        1. Open sheet: the sheet must sit below the status bar. Close it.{'\n'}
        2. Mount, then unmount the keyboard probe.{'\n'}
        3. Open sheet again: before the fix it is laid out under the status bar.
        Open keyboard sheet: before the fix it stays at the half detent although
        the keyboard is visible.
      </Text>
      <Button title="Open sheet" onPress={() => navigation.navigate('Sheet')} />
      <Button
        title="Open keyboard sheet"
        onPress={() => navigation.navigate('KeyboardSheet')}
      />
      <Button
        title={probeMounted ? 'Unmount keyboard probe' : 'Mount keyboard probe'}
        onPress={() => setProbeMounted(mounted => !mounted)}
      />
    </View>
  );
}

function Sheet({ navigation }: NativeStackScreenProps<Routes, 'Sheet'>) {
  return (
    <View style={styles.sheet}>
      <Text style={styles.marker}>TOP OF THE SHEET</Text>
      <Text>The sheet must stay below the status bar.</Text>
      <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );
}

function KeyboardSheet({
  navigation,
}: NativeStackScreenProps<Routes, 'KeyboardSheet'>) {
  return (
    <View style={styles.sheet}>
      <Text style={styles.marker}>TOP OF THE SHEET</Text>
      <TextInput autoFocus placeholder="Focus me" style={styles.input} />
      <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Sheet"
          component={Sheet}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: [1.0],
            sheetCornerRadius: 24,
          }}
        />
        <Stack.Screen
          name="KeyboardSheet"
          component={KeyboardSheet}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: [0.5, 1.0],
            sheetCornerRadius: 24,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  instructions: {
    textAlign: 'left',
  },
  probeBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'red',
  },
  sheet: {
    flex: 1,
    padding: 24,
    gap: 12,
    backgroundColor: '#cfe8ff',
  },
  marker: {
    fontSize: 28,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    padding: 8,
  },
});
