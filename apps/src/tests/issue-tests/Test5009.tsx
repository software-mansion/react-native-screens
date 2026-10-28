import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type Routes = { Home: undefined; Sheet: undefined };
const Stack = createNativeStackNavigator<Routes>();

/** Root screen: pushes the sheet-like screen. */
function Home({ navigation }: NativeStackScreenProps<Routes, 'Home'>) {
  return (
    <View style={styles.home}>
      <Button
        testID="open-sheet"
        title="Open the sheet-like screen"
        onPress={() => navigation.navigate('Sheet')}
      />
    </View>
  );
}

/**
 * Pushed with a vertical, gesture-matched custom animation.
 *
 * iOS: drag down a short way and let go. The screen must glide back over the
 * transition's duration, starting at the finger's speed, not snap back in a
 * frame. Drag past half and let go: it must close at the finger's speed.
 */
function Sheet() {
  return (
    <View style={styles.sheet}>
      <Text style={styles.title}>Drag down anywhere</Text>
      {Array.from({ length: 6 }, (_, i) => (
        <View
          key={i}
          style={[
            styles.stripe,
            { backgroundColor: `hsl(${i * 50}, 80%, 60%)` },
          ]}
        />
      ))}
    </View>
  );
}

/** Reproduction for #5009. */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Sheet"
          component={Sheet}
          options={{
            animation: 'slide_from_bottom',
            animationDuration: 250,
            animationMatchesGesture: true,
            gestureDirection: 'vertical',
            fullScreenGestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sheet: { flex: 1, padding: 24, gap: 12, backgroundColor: '#1c1c1e' },
  title: { fontSize: 24, fontWeight: '700', color: 'white' },
  stripe: { height: 60, borderRadius: 12 },
});
