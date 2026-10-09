import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
  type HeaderSafeAreaAdjustment,
} from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import { SettingsPicker, ThemedText } from '@apps/shared';
import { Colors } from '@apps/shared/styling';

const SAFE_AREA_ADJUSTMENTS: HeaderSafeAreaAdjustment[] = [
  'automatic',
  'enabled',
  'disabled',
];

export default function Test4732() {
  const [safeAreaAdjustment, setSafeAreaAdjustment] =
    React.useState<HeaderSafeAreaAdjustment>('automatic');

  return (
    <ScreenStack style={styles.container}>
      <Screen key="scroll" activityState={2} isNativeStack>
        {/* SafeAreaView applies the top inset as a margin, so the area above
            the yellow background is the inset it currently applies. */}
        <SafeAreaView edges={{ top: true }} style={styles.safeArea}>
          <ScrollView contentInsetAdjustmentBehavior="never">
            <SettingsPicker<HeaderSafeAreaAdjustment>
              label="safeAreaAdjustment"
              value={safeAreaAdjustment}
              onValueChange={setSafeAreaAdjustment}
              items={SAFE_AREA_ADJUSTMENTS}
              style={styles.firstPicker}
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
          minimizationBehavior="onScrollDown"
          safeAreaAdjustment={safeAreaAdjustment}
        />
      </Screen>
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.YellowLight100,
  },
  firstPicker: {
    marginTop: 6,
  },
  row: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.BlueLight40,
    backgroundColor: Colors.BlueLight100,
  },
});
