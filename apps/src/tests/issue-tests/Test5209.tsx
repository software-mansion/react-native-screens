import React, { useLayoutEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { StyleSheet, Switch, Text, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5209
//
// A FullWindowOverlay strip covers the native header. On iOS 27, holding a
// finger on the strip above the header's star bar button plays the button's
// Liquid Glass press animation, although its onPress never fires.
// UIKit drives that press from a flex pan gesture recognizer attached to the
// UIWindow, and the overlay's container is a subview of the same window, so
// the recognizer also receives touches that land on the overlay.
// Expected: holding on the overlay does not animate the bar button underneath.
// The bug is visual only: "Bar button presses" stays 0 either way and checks
// that the button still works with the overlay hidden. The switch inside the
// overlay must keep its own press animation.

type StackParamList = {
  Repro: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function Repro({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList>;
}) {
  const insets = useSafeAreaInsets();
  const [presses, setPresses] = useState(0);
  const [overlayTouches, setOverlayTouches] = useState(0);
  const [overlayShown, setOverlayShown] = useState(true);
  const [overlaySwitchOn, setOverlaySwitchOn] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      unstable_headerRightItems: () => [
        {
          type: 'button',
          label: 'Star',
          icon: { type: 'sfSymbol', name: 'star' },
          onPress: () => setPresses(count => count + 1),
        },
      ],
    });
  }, [navigation]);

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Issue 5209: overlay over header</Text>
      <Text style={styles.label} testID="bar-presses">
        Bar button presses: {presses}
      </Text>
      <Text style={styles.label} testID="overlay-touches">
        Overlay touch-downs: {overlayTouches}
      </Text>
      <View style={styles.toggleRow}>
        <Text style={styles.label}>Show overlay</Text>
        <Switch
          value={overlayShown}
          onValueChange={setOverlayShown}
          testID="toggle-overlay"
        />
      </View>
      <Text style={styles.hint}>
        Hold a finger 1-2 s on the dark overlay strip at the top, over the star
        button (top right), then release.
      </Text>

      {overlayShown && (
        <FullWindowOverlay>
          <View
            style={[styles.overlay, { top: insets.top }]}
            onTouchStart={() => setOverlayTouches(count => count + 1)}
            testID="overlay">
            <Switch
              value={overlaySwitchOn}
              onValueChange={setOverlaySwitchOn}
              testID="overlay-switch"
            />
            <Text style={styles.overlayText}>OVERLAY: hold over the star</Text>
          </View>
        </FullWindowOverlay>
      )}
    </View>
  );
}

export default function Test5209() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Repro"
            component={Repro}
            options={{ title: 'Test5209' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 24,
    backgroundColor: 'white',
  },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  label: { fontSize: 20 },
  hint: { fontSize: 16, textAlign: 'center' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  overlayText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
