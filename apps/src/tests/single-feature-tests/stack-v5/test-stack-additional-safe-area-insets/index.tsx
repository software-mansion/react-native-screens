import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
  type StackRouteConfig,
} from '@apps/shared/containers/stack';
import {
  type ContentMode,
  FLOATING_BAR_INSET,
  FloatingBar,
  InsetsListContent,
  InsetsSafeAreaViewContent,
} from '@apps/tests/shared/components/AdditionalSafeAreaInsetsContent';
import { scenarioDescription } from './scenario-description';

const ScenarioStateContext = createContext<{
  mode: ContentMode;
  insetsEnabled: boolean;
}>({ mode: 'List', insetsEnabled: true });

function HomeScreen() {
  const { mode, insetsEnabled } = useContext(ScenarioStateContext);
  const { routeKey, setRouteOptions } = useStackNavigationContext();

  useEffect(() => {
    setRouteOptions(routeKey, {
      additionalSafeAreaInsets: insetsEnabled
        ? { bottom: FLOATING_BAR_INSET }
        : undefined,
    });
  }, [insetsEnabled, routeKey, setRouteOptions]);

  return mode === 'List' ? (
    <InsetsListContent topEdge={false} />
  ) : (
    <InsetsSafeAreaViewContent topEdge={false} />
  );
}

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Home',
    element: <HomeScreen />,
    options: {
      headerConfig: { title: 'Stack v5' },
    },
  },
];

function TestStackAdditionalSafeAreaInsets() {
  const [mode, setMode] = useState<ContentMode>('List');
  const [insetsEnabled, setInsetsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <ScenarioStateContext value={{ mode, insetsEnabled }}>
        <StackContainer routeConfigs={ROUTE_CONFIGS} />
      </ScenarioStateContext>
      <FloatingBar
        selectedMode={mode}
        onSelectMode={setMode}
        insetsEnabled={insetsEnabled}
        onToggleInsets={() => setInsetsEnabled(value => !value)}
      />
    </View>
  );
}

export default createScenario(
  TestStackAdditionalSafeAreaInsets,
  scenarioDescription,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
