import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Screen, ScreenStack } from 'react-native-screens';
import { SettingsPicker } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

const EDGES = ['none', 'bottom', 'top', 'all'] as const;

function TestStackV4DeferSystemGestures() {
  const [edge, setEdge] = useState<(typeof EDGES)[number]>('bottom');
  const [touchCount, setTouchCount] = useState(0);

  return (
    <ScreenStack style={styles.container}>
      <Screen
        activityState={2}
        isNativeStack
        screenEdgesDeferringSystemGestures={[edge]}
        style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>
            screenEdgesDeferringSystemGestures: [{edge}]
          </Text>
          <SettingsPicker
            label="edge"
            items={[...EDGES]}
            value={edge}
            onValueChange={setEdge}
          />
          <Text testID="defer-system-gestures-touch-count">
            Touches on the strip: {touchCount}
          </Text>
          <Button title="Reset counter" onPress={() => setTouchCount(0)} />
        </View>
        <View
          style={styles.edgeStrip}
          onTouchStart={() => setTouchCount(count => count + 1)}>
          <Text>Swipe up from the very bottom edge</Text>
        </View>
      </Screen>
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  edgeStrip: {
    alignItems: 'center',
    backgroundColor: Colors.cardBorder,
    height: 80,
    justifyContent: 'center',
  },
});

export default createScenario(
  TestStackV4DeferSystemGestures,
  scenarioDescription,
);
