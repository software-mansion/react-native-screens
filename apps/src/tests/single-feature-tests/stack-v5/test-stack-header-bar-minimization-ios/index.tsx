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
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderConfigProps,
  StackHeaderMinimizationBehaviorIOS,
  StackHeaderRestorationBehaviorIOS,
} from 'react-native-screens';

const MINIMIZATION_BEHAVIORS: StackHeaderMinimizationBehaviorIOS[] = [
  'automatic',
  'never',
  'onScrollDown',
  'onScrollUp',
];

const RESTORATION_BEHAVIORS: StackHeaderRestorationBehaviorIOS[] = [
  'automatic',
  'atScrollEdge',
];

interface MinimizationConfig {
  minimizationBehavior: StackHeaderMinimizationBehaviorIOS;
  restorationBehavior: StackHeaderRestorationBehaviorIOS;
}

const INITIAL_CONFIG: MinimizationConfig = {
  minimizationBehavior: 'automatic',
  restorationBehavior: 'automatic',
};

function ResizingItem() {
  const [large, setLarge] = React.useState(false);

  return (
    <PressableWithFeedback
      onPress={() => setLarge(value => !value)}
      style={{ width: large ? 60 : 20, height: large ? 30 : 20 }}
    />
  );
}

function buildHeaderConfig(config: MinimizationConfig): StackHeaderConfigProps {
  return {
    title: 'Scroll',
    ios: {
      minimizationBehavior: config.minimizationBehavior,
      restorationBehavior: config.restorationBehavior,
      leadingItems: [
        {
          type: 'item',
          id: 'leading-0',
          render: () => <ResizingItem />,
        },
        {
          type: 'spacer',
          id: 'spacer-leading-1',
          sizing: 'fixed',
          width: 100,
        },
        {
          type: 'item',
          id: 'leading-1',
          render: () => <ResizingItem />,
        },
      ],
      trailingItems: [
        {
          type: 'item',
          id: 'trailing-0',
          render: () => <ResizingItem />,
        },
        {
          type: 'spacer',
          id: 'spacer-trailing-1',
          sizing: 'flexible',
        },
        {
          type: 'item',
          id: 'trailing-1',
          render: () => <ResizingItem />,
        },
      ],
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

function TestStackHeaderBarMinimizationIOS() {
  return <StackContainer routeConfigs={ROUTE_CONFIGS} />;
}

function ScrollScreen() {
  const { routeKey, setRouteOptions } = useStackNavigationContext();
  const [config, setConfig] = React.useState(INITIAL_CONFIG);

  React.useLayoutEffect(() => {
    setRouteOptions(routeKey, { headerConfig: buildHeaderConfig(config) });
  }, [config, setRouteOptions, routeKey]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SettingsPicker<StackHeaderMinimizationBehaviorIOS>
        label="minimizationBehavior"
        value={config.minimizationBehavior}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, minimizationBehavior: value }))
        }
        items={MINIMIZATION_BEHAVIORS}
      />
      <SettingsPicker<StackHeaderRestorationBehaviorIOS>
        label="restorationBehavior"
        value={config.restorationBehavior}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, restorationBehavior: value }))
        }
        items={RESTORATION_BEHAVIORS}
      />
      {Array.from({ length: 100 }, (_, index) => (
        <ThemedText key={index} style={styles.row}>
          Row {index}
        </ThemedText>
      ))}
    </ScrollView>
  );
}

export default createScenario(
  TestStackHeaderBarMinimizationIOS,
  scenarioDescription,
);

const styles = StyleSheet.create({
  row: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.BlueLight40,
    backgroundColor: Colors.BlueLight100,
  },
});
