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
import { SettingsPicker, SettingsSwitch, ThemedText } from '@apps/shared';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Colors } from '@apps/shared/styling';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';

const UNDEFINED = 'undefined';
type MinimizationBehaviorOption = HeaderMinimizationBehavior | typeof UNDEFINED;

const MINIMIZATION_BEHAVIORS: MinimizationBehaviorOption[] = [
  UNDEFINED,
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

function TestStackV4HeaderBarMinimization() {
  const [minimizationBehavior, setMinimizationBehavior] =
    React.useState<MinimizationBehaviorOption>(UNDEFINED);
  const [restorationBehavior, setRestorationBehavior] =
    React.useState<HeaderRestorationBehavior>('automatic');
  const [translucent, setTranslucent] = React.useState(true);

  return (
    <ScreenStack style={styles.container}>
      <Screen key="scroll" activityState={2} isNativeStack>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <SettingsSwitch
            label="translucent"
            value={translucent}
            onValueChange={setTranslucent}
          />
          <SettingsPicker<MinimizationBehaviorOption>
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
        <ScreenStackHeaderConfig
          title="Scroll"
          translucent={translucent}
          backgroundColor={translucent ? 'transparent' : Colors.BlueLight100}
          minimizationBehavior={
            minimizationBehavior === UNDEFINED
              ? undefined
              : minimizationBehavior
          }
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
  TestStackV4HeaderBarMinimization,
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
