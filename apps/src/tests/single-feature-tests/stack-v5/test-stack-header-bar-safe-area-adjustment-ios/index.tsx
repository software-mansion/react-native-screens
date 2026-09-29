import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  type StackRouteConfig,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker, ThemedText } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderConfigProps,
  StackHeaderSafeAreaAdjustmentIOS,
} from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';

const SAFE_AREA_ADJUSTMENTS: StackHeaderSafeAreaAdjustmentIOS[] = [
  'automatic',
  'enabled',
  'disabled',
];

const INITIAL_SAFE_AREA_ADJUSTMENT: StackHeaderSafeAreaAdjustmentIOS =
  'automatic';

function buildHeaderConfig(
  safeAreaAdjustment: StackHeaderSafeAreaAdjustmentIOS,
): StackHeaderConfigProps {
  return {
    title: 'Safe area',
    // Transparent header, so that the screen is laid out under the bar
    // and its safe area includes the navigation bar.
    transparent: true,
    ios: {
      minimizationBehavior: 'onScrollDown',
      safeAreaAdjustment,
    },
  };
}

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Scroll',
    element: <ScrollScreen />,
    options: {
      headerConfig: buildHeaderConfig(INITIAL_SAFE_AREA_ADJUSTMENT),
    },
  },
];

function TestStackHeaderBarSafeAreaAdjustmentIOS() {
  return <StackContainer routeConfigs={ROUTE_CONFIGS} />;
}

function ScrollScreen() {
  const { routeKey, setRouteOptions } = useStackNavigationContext();
  const [safeAreaAdjustment, setSafeAreaAdjustment] = React.useState(
    INITIAL_SAFE_AREA_ADJUSTMENT,
  );

  React.useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: buildHeaderConfig(safeAreaAdjustment),
    });
  }, [safeAreaAdjustment, setRouteOptions, routeKey]);

  return (
    // SafeAreaView applies the top inset as a margin, so the area above
    // the yellow background is the inset it currently applies.
    <SafeAreaView edges={{ top: true }} style={styles.safeArea}>
      <ScrollView contentInsetAdjustmentBehavior="never">
        <SettingsPicker<StackHeaderSafeAreaAdjustmentIOS>
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
  );
}

export default createScenario(
  TestStackHeaderBarSafeAreaAdjustmentIOS,
  scenarioDescription,
);

const styles = StyleSheet.create({
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
