import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen, ScreenContainer } from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  CONTENT_MODES,
  type ContentMode,
  FLOATING_BAR_INSET,
  FloatingBar,
  InsetsListContent,
  InsetsSafeAreaViewContent,
} from '@apps/tests/shared/components/AdditionalSafeAreaInsetsContent';
import { scenarioDescription } from './scenario-description';

function TestStackV4AdditionalSafeAreaInsets() {
  const [selectedMode, setSelectedMode] = useState<ContentMode>('List');
  const [insetsEnabled, setInsetsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <ScreenContainer style={styles.container}>
        {CONTENT_MODES.map(mode => (
          <Screen
            key={mode}
            style={StyleSheet.absoluteFill}
            activityState={mode === selectedMode ? 2 : 0}
            additionalSafeAreaInsets={
              insetsEnabled ? { bottom: FLOATING_BAR_INSET } : undefined
            }>
            {mode === 'List' ? (
              <InsetsListContent />
            ) : (
              <InsetsSafeAreaViewContent />
            )}
          </Screen>
        ))}
      </ScreenContainer>
      <FloatingBar
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
        insetsEnabled={insetsEnabled}
        onToggleInsets={() => setInsetsEnabled(value => !value)}
      />
    </View>
  );
}

export default createScenario(
  TestStackV4AdditionalSafeAreaInsets,
  scenarioDescription,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
