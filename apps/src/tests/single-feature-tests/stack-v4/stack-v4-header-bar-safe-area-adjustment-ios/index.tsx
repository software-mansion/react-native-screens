import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
  type HeaderMinimizationBehavior,
  type HeaderSafeAreaAdjustment,
} from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import { SettingsPicker, ThemedText } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';

const MINIMIZATION_BEHAVIORS: HeaderMinimizationBehavior[] = [
  'automatic',
  'never',
  'onScrollDown',
  'onScrollUp',
];

const SAFE_AREA_ADJUSTMENTS: HeaderSafeAreaAdjustment[] = [
  'automatic',
  'enabled',
  'disabled',
];

function TestStackV4HeaderBarSafeAreaAdjustmentIOS() {
  const [minimizationBehavior, setMinimizationBehavior] =
    React.useState<HeaderMinimizationBehavior>('onScrollDown');
  const [safeAreaAdjustment, setSafeAreaAdjustment] =
    React.useState<HeaderSafeAreaAdjustment>('automatic');

  return (
    <ScreenStack style={styles.container}>
      <Screen key="scroll" activityState={2} isNativeStack>
        {/* SafeAreaView applies the top inset as a margin, so the area above
            the yellow background is the inset it currently applies. */}
        <SafeAreaView edges={{ top: true }} style={styles.safeArea}>
          <ScrollView contentInsetAdjustmentBehavior="never">
            <SettingsPicker<HeaderMinimizationBehavior>
              label="minimizationBehavior"
              value={minimizationBehavior}
              onValueChange={setMinimizationBehavior}
              items={MINIMIZATION_BEHAVIORS}
            />
            <SettingsPicker<HeaderSafeAreaAdjustment>
              label="safeAreaAdjustment"
              value={safeAreaAdjustment}
              onValueChange={setSafeAreaAdjustment}
              items={SAFE_AREA_ADJUSTMENTS}
            />
            {Array.from({ length: 100 }, (_, index) => (
              <ThemedText key={index} style={styles.row}>
                Row {index}
              </ThemedText>
            ))}
          </ScrollView>
        </SafeAreaView>
        {/* HeaderConfig must not be the first child of a Screen, otherwise
            UIKit does not find the scroll view that drives bar minimization.
            See https://github.com/software-mansion/react-native-screens/pull/1825 */}
        <ScreenStackHeaderConfig
          title="Safe area"
          // Translucent header, so that the screen is laid out under the bar
          // and its safe area includes the navigation bar.
          translucent
          backgroundColor="transparent"
          minimizationBehavior={minimizationBehavior}
          safeAreaAdjustment={safeAreaAdjustment}
        />
      </Screen>
    </ScreenStack>
  );
}

export default createScenario(
  TestStackV4HeaderBarSafeAreaAdjustmentIOS,
  scenarioDescription,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.YellowLight100,
  },
  row: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.BlueLight40,
    backgroundColor: Colors.BlueLight100,
  },
});
