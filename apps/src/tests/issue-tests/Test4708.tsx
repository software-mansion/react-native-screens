import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';

type PointerEventsMode = 'box-none' | 'box-only';

export default function Test4708() {
  const [mode, setMode] = React.useState<PointerEventsMode>('box-none');
  const [backgroundPresses, setBackgroundPresses] = React.useState(0);
  const [safeAreaTouches, setSafeAreaTouches] = React.useState(0);
  const [childPresses, setChildPresses] = React.useState(0);

  const resetCounters = () => {
    setBackgroundPresses(0);
    setSafeAreaTouches(0);
    setChildPresses(0);
  };

  const selectMode = (nextMode: PointerEventsMode) => {
    setMode(nextMode);
    resetCounters();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeAreaView pointerEvents</Text>
      <Text style={styles.instructions}>
        box-none: the blue background and pink child should both be pressable.
        {'\n'}box-only: every tap inside the yellow border should increment only
        the SafeAreaView counter.
      </Text>

      <View style={styles.controls}>
        {(['box-none', 'box-only'] as const).map(value => (
          <Pressable
            key={value}
            onPress={() => selectMode(value)}
            style={[styles.modeButton, mode === value && styles.selectedButton]}
            testID={`test4708-mode-${value}`}>
            <Text
              style={[
                styles.modeButtonText,
                mode === value && styles.selectedButtonText,
              ]}>
              {value}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.testSurface}>
        <Pressable
          onPress={() => setBackgroundPresses(count => count + 1)}
          style={styles.background}
          testID="test4708-background">
          <Text style={styles.backgroundLabel}>Blue background</Text>
        </Pressable>

        <SafeAreaView
          edges={{}}
          onTouchEnd={event => {
            if (event.target === event.currentTarget) {
              setSafeAreaTouches(count => count + 1);
            }
          }}
          pointerEvents={mode}
          style={styles.safeArea}
          testID="test4708-safe-area">
          <Pressable
            onPress={() => setChildPresses(count => count + 1)}
            style={styles.child}
            testID="test4708-child">
            <Text style={styles.childLabel}>Pink child</Text>
          </Pressable>
        </SafeAreaView>
      </View>

      <Text testID="test4708-background-count">
        Background presses: {backgroundPresses}
      </Text>
      <Text testID="test4708-safe-area-count">
        SafeAreaView touches: {safeAreaTouches}
      </Text>
      <Text testID="test4708-child-count">Child presses: {childPresses}</Text>
      <Pressable onPress={resetCounters} style={styles.resetButton}>
        <Text>Reset counters</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  instructions: {
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#1d4ed8',
  },
  modeButtonText: {
    color: '#1d4ed8',
  },
  selectedButtonText: {
    color: 'white',
  },
  testSurface: {
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#93c5fd',
  },
  backgroundLabel: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  safeArea: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#facc15',
  },
  child: {
    width: 160,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f9a8d4',
  },
  childLabel: {
    color: '#831843',
    fontWeight: '600',
  },
  resetButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
});
