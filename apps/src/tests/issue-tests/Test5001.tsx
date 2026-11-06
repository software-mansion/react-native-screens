import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';
import { GestureDetectorProvider } from 'react-native-screens/gesture-handler';
import {
  ReanimatedScreenProvider,
  useReanimatedTransitionProgress,
} from 'react-native-screens/reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Button } from '@apps/shared';

// Reproduces https://github.com/software-mansion/react-native-screens/pull/5001
//
// With `goBackGesture` set to `swipeDown` or `swipeUp`, the transition progress
// reported while dragging the pushed screen towards the edge goes from 0 to -1
// instead of 0 to 1.

type VerticalGesture = 'swipeDown' | 'swipeUp';

function PushedScreenContent({ gesture }: { gesture: VerticalGesture }) {
  const { progress } = useReanimatedTransitionProgress();

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.min(Math.max(progress.value, 0), 1) * 100}%`,
  }));

  const negativeStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0 ? 1 : 0,
  }));

  const direction = gesture === 'swipeDown' ? 'down' : 'up';

  return (
    <View style={styles.screen}>
      <Text style={styles.step}>
        1. Slowly drag this screen {direction} without releasing it.
      </Text>
      <Text style={styles.step}>
        2. Expected: the green bar fills up as you drag, and the red box stays
        hidden.
      </Text>
      <Text style={styles.step}>
        Bug: the green bar stays empty and the red box appears, because the
        progress is negative.
      </Text>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, barStyle]} />
      </View>
      <Animated.View style={[styles.negative, negativeStyle]}>
        <Text style={styles.negativeText}>Negative progress</Text>
      </Animated.View>
    </View>
  );
}

export default function App() {
  const [gesture, setGesture] = useState<VerticalGesture | null>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ReanimatedScreenProvider>
        <GestureDetectorProvider>
          <ScreenStack
            style={styles.container}
            goBackGesture={gesture ?? undefined}
            currentScreenId={gesture ? 'pushed' : 'home'}>
            <ScreenStackItem screenId="home" headerConfig={{ title: 'Home' }}>
              <View style={styles.screen}>
                <Button
                  title="Push with swipeDown"
                  testID="home-push-swipe-down"
                  onPress={() => setGesture('swipeDown')}
                />
                <Button
                  title="Push with swipeUp"
                  testID="home-push-swipe-up"
                  onPress={() => setGesture('swipeUp')}
                />
              </View>
            </ScreenStackItem>
            {gesture && (
              <ScreenStackItem
                screenId="pushed"
                headerConfig={{ title: gesture }}
                onDismissed={() => setGesture(null)}>
                <PushedScreenContent gesture={gesture} />
              </ScreenStackItem>
            )}
          </ScreenStack>
        </GestureDetectorProvider>
      </ReanimatedScreenProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  step: {
    marginBottom: 8,
  },
  track: {
    height: 24,
    marginTop: 16,
    backgroundColor: 'lightgray',
  },
  bar: {
    height: '100%',
    backgroundColor: 'green',
  },
  negative: {
    marginTop: 16,
    padding: 8,
    backgroundColor: 'red',
  },
  negativeText: {
    color: 'white',
  },
});
