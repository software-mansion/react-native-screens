import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  type HeaderBarButtonItem,
  type HeaderMinimizationBehavior,
  type HeaderRestorationBehavior,
} from 'react-native-screens';
import { SettingsPicker, ThemedText } from '@apps/shared';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Colors } from '@apps/shared/styling';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';

const MINIMIZATION_BEHAVIORS: HeaderMinimizationBehavior[] = [
  'automatic',
  'never',
  'onScrollDown',
  'onScrollUp',
];

const RESTORATION_BEHAVIORS: HeaderRestorationBehavior[] = [
  'automatic',
  'atScrollEdge',
];

const LEFT_SPACER = { type: 'spacing', spacing: 100, index: 1 } as const;
const RIGHT_SPACER = { type: 'spacing', spacing: 0, index: 1 } as const;
const LEFT_BAR_BUTTON_ITEMS: HeaderBarButtonItem[] = [LEFT_SPACER];
const RIGHT_BAR_BUTTON_ITEMS: HeaderBarButtonItem[] = [RIGHT_SPACER];

function ResizingItem() {
  const [large, setLarge] = React.useState(false);

  return (
    <PressableWithFeedback
      onPress={() => setLarge(value => !value)}
      style={{ width: large ? 60 : 20, height: large ? 30 : 20 }}
    />
  );
}

function TestStackV4HeaderBarMinimizationIOS() {
  const [minimizationBehavior, setMinimizationBehavior] =
    React.useState<HeaderMinimizationBehavior>('automatic');
  const [restorationBehavior, setRestorationBehavior] =
    React.useState<HeaderRestorationBehavior>('automatic');

  return (
    <ScreenStack style={styles.container}>
      <Screen key="scroll" activityState={2} isNativeStack>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <SettingsPicker<HeaderMinimizationBehavior>
            label="minimizationBehavior"
            value={minimizationBehavior}
            onValueChange={setMinimizationBehavior}
            items={MINIMIZATION_BEHAVIORS}
          />
          <SettingsPicker<HeaderRestorationBehavior>
            label="restorationBehavior"
            value={restorationBehavior}
            onValueChange={setRestorationBehavior}
            items={RESTORATION_BEHAVIORS}
          />
          {Array.from({ length: 100 }, (_, index) => (
            <ThemedText key={index} style={styles.row}>
              Row {index}
            </ThemedText>
          ))}
        </ScrollView>
        {/* HeaderConfig must not be the first child of a Screen, otherwise
            UIKit does not find the scroll view that drives bar minimization.
            See https://github.com/software-mansion/react-native-screens/pull/1825 */}
        <ScreenStackHeaderConfig
          title="Scroll"
          backgroundColor="transparent"
          minimizationBehavior={minimizationBehavior}
          restorationBehavior={restorationBehavior}
          headerLeftBarButtonItems={LEFT_BAR_BUTTON_ITEMS}
          headerRightBarButtonItems={RIGHT_BAR_BUTTON_ITEMS}>
          <ScreenStackHeaderLeftView>
            <ResizingItem />
          </ScreenStackHeaderLeftView>
          <ScreenStackHeaderLeftView>
            <ResizingItem />
          </ScreenStackHeaderLeftView>
          <ScreenStackHeaderRightView>
            <ResizingItem />
          </ScreenStackHeaderRightView>
          <ScreenStackHeaderRightView>
            <ResizingItem />
          </ScreenStackHeaderRightView>
        </ScreenStackHeaderConfig>
      </Screen>
    </ScreenStack>
  );
}

export default createScenario(
  TestStackV4HeaderBarMinimizationIOS,
  scenarioDescription,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.BlueLight40,
    backgroundColor: Colors.BlueLight100,
  },
});
