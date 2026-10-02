import React from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  TabsContainerWithHostConfigContext,
} from '@apps/shared/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

function ContentView({ label }: { label: string }) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: 40 + progress.value * 120,
    height: 40,
    backgroundColor: 'tomato',
  }));

  return (
    <CenteredLayoutView>
      <Text>{label}</Text>
      <Animated.View style={animatedStyle} />
    </CenteredLayoutView>
  );
}

function makeRouteConfigs(badgeValue: string): TabRouteConfig[] {
  return ['First', 'Second', 'Third'].map(name => ({
    name,
    element: <ContentView label={name} />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: name,
      badgeValue,
      tabBarItemTestID: `recursive-emission-tab-${name.toLowerCase()}`,
    },
  }));
}

function TestTabsRecursiveEmission() {
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    let frameId = requestAnimationFrame(function tick() {
      setCounter(prev => prev + 1);
      frameId = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const routeConfigs = makeRouteConfigs(String(counter % 100));

  return (
    <TabsContainerWithHostConfigContext
      routeConfigs={routeConfigs}
      rejectStaleNavStateUpdates={true}
    />
  );
}

export default createScenario(TestTabsRecursiveEmission, scenarioDescription);
