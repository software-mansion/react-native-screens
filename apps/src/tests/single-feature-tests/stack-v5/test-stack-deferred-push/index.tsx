import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

function DeferredPush() {
  const [preset, setPreset] = useState<'fade' | 'slideFromRight' | null>(null);
  const [deferred, setDeferred] = useState(false);
  const [laidOut, setLaidOut] = useState(false);
  const [appeared, setAppeared] = useState(false);

  function push(animation: 'fade' | 'slideFromRight') {
    setLaidOut(false);
    setAppeared(false);
    setDeferred(true);
    setPreset(animation);
  }

  return (
    <View style={styles.container}>
      <Stack.Host>
        <Stack.Screen activityMode="attached" screenKey="list">
          <View style={styles.list}>
            <Text>Source</Text>
          </View>
        </Stack.Screen>
        {preset && (
          <Stack.Screen
            activityMode="attached"
            screenKey="detail"
            animation={preset}
            transitionStartDeferred={deferred}
            onDidAppear={() => setAppeared(true)}
            onNativeDismiss={() => setPreset(null)}>
            <View style={styles.detail} onLayout={() => setLaidOut(true)}>
              <Text>Destination</Text>
            </View>
          </Stack.Screen>
        )}
      </Stack.Host>
      {preset ? (
        <View>
          <Text>
            {appeared
              ? 'Appeared'
              : laidOut
              ? 'Destination laid out'
              : 'Preparing'}
          </Text>
          <Button title="Release" onPress={() => setDeferred(false)} />
          <Button title="Remove destination" onPress={() => setPreset(null)} />
        </View>
      ) : (
        <View>
          <Button title="Hold fade" onPress={() => push('fade')} />
          <Button title="Hold slide" onPress={() => push('slideFromRight')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1, backgroundColor: '#9dcafa', justifyContent: 'center' },
  detail: { flex: 1, backgroundColor: '#ffcf78', justifyContent: 'center' },
});

export default createScenario(DeferredPush, scenarioDescription);
