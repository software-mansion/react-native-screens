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
  StackHeaderMinimizationBehaviorIOS,
  StackHeaderSafeAreaAdjustmentIOS,
} from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';

type InsetConsumer = 'safeAreaView' | 'scrollView';

const MINIMIZATION_BEHAVIORS: StackHeaderMinimizationBehaviorIOS[] = [
  'automatic',
  'never',
  'onScrollDown',
  'onScrollUp',
];

const SAFE_AREA_ADJUSTMENTS: StackHeaderSafeAreaAdjustmentIOS[] = [
  'automatic',
  'enabled',
  'disabled',
];

const INSET_CONSUMERS: InsetConsumer[] = ['safeAreaView', 'scrollView'];

interface SafeAreaAdjustmentConfig {
  minimizationBehavior: StackHeaderMinimizationBehaviorIOS;
  safeAreaAdjustment: StackHeaderSafeAreaAdjustmentIOS;
}

const INITIAL_CONFIG: SafeAreaAdjustmentConfig = {
  minimizationBehavior: 'onScrollDown',
  safeAreaAdjustment: 'automatic',
};

function buildHeaderConfig(
  config: SafeAreaAdjustmentConfig,
): StackHeaderConfigProps {
  return {
    title: 'Safe area',
    ios: {
      minimizationBehavior: config.minimizationBehavior,
      safeAreaAdjustment: config.safeAreaAdjustment,
    },
  };
}

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Scroll',
    element: <ScrollScreen />,
    options: {
      headerConfig: buildHeaderConfig(INITIAL_CONFIG),
    },
  },
];

function TestStackHeaderBarSafeAreaAdjustmentIOS() {
  return <StackContainer routeConfigs={ROUTE_CONFIGS} />;
}

function ScrollScreen() {
  const { routeKey, setRouteOptions } = useStackNavigationContext();
  const [config, setConfig] = React.useState(INITIAL_CONFIG);
  const [insetConsumer, setInsetConsumer] =
    React.useState<InsetConsumer>('safeAreaView');

  React.useLayoutEffect(() => {
    setRouteOptions(routeKey, { headerConfig: buildHeaderConfig(config) });
  }, [config, setRouteOptions, routeKey]);

  const content = (
    <>
      <SettingsPicker<StackHeaderMinimizationBehaviorIOS>
        label="minimizationBehavior"
        value={config.minimizationBehavior}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, minimizationBehavior: value }))
        }
        items={MINIMIZATION_BEHAVIORS}
      />
      <SettingsPicker<StackHeaderSafeAreaAdjustmentIOS>
        label="safeAreaAdjustment"
        value={config.safeAreaAdjustment}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, safeAreaAdjustment: value }))
        }
        items={SAFE_AREA_ADJUSTMENTS}
      />
      <SettingsPicker<InsetConsumer>
        label="insetConsumer"
        value={insetConsumer}
        onValueChange={setInsetConsumer}
        items={INSET_CONSUMERS}
      />
      {Array.from({ length: 100 }, (_, index) => (
        <ThemedText key={index} style={styles.row}>
          Row {index}
        </ThemedText>
      ))}
    </>
  );

  if (insetConsumer === 'safeAreaView') {
    // SafeAreaView applies the top inset as a margin, so the area above
    // the yellow background is the inset it currently applies.
    return (
      <SafeAreaView edges={{ top: true }} style={styles.safeArea}>
        <ScrollView contentInsetAdjustmentBehavior="never">
          {content}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {content}
    </ScrollView>
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
  row: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.BlueLight40,
    backgroundColor: Colors.BlueLight100,
  },
});
