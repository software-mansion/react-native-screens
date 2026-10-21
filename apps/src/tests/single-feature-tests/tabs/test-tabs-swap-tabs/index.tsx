import React from 'react';
import { Button, type NativeSyntheticEvent, Text, View } from 'react-native';
import {
  Tabs,
  type TabSelectedEvent,
  type TabsHostNavStateRequest,
} from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { DEFAULT_TAB_ROUTE_OPTIONS } from '@apps/shared/containers/tabs';

type SwappableTabKey = 'TabA' | 'TabB';

function TabContent({
  screenKey,
  onSwap,
}: {
  screenKey: string;
  onSwap: () => void;
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text testID="swap-tabs-screen-key">{screenKey}</Text>
      <Button
        title="Swap TabA / TabB"
        onPress={onSwap}
        testID={`swap-tabs-button-${screenKey}`}
      />
    </View>
  );
}

function TestTabsSwapTabs() {
  const [swappableTabKey, setSwappableTabKey] =
    React.useState<SwappableTabKey>('TabA');
  const [navStateRequest, setNavStateRequest] =
    React.useState<TabsHostNavStateRequest>({
      selectedScreenKey: 'Home',
      baseProvenance: 0,
    });
  const lastProvenance = React.useRef(0);

  const onTabSelected = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectedEvent>) => {
      lastProvenance.current = event.nativeEvent.provenance;
    },
    [],
  );

  // Replace TabA with TabB (or the other way round) and go back to Home, like a navigator
  // does when the routes change and the selected one may be gone.
  const swap = React.useCallback(() => {
    setSwappableTabKey(key => (key === 'TabA' ? 'TabB' : 'TabA'));
    setNavStateRequest({
      selectedScreenKey: 'Home',
      baseProvenance: lastProvenance.current,
    });
  }, []);

  return (
    <Tabs.Host navStateRequest={navStateRequest} onTabSelected={onTabSelected}>
      <Tabs.Screen {...DEFAULT_TAB_ROUTE_OPTIONS} screenKey="Home" title="Home">
        <TabContent screenKey="Home" onSwap={swap} />
      </Tabs.Screen>
      <Tabs.Screen
        {...DEFAULT_TAB_ROUTE_OPTIONS}
        key={swappableTabKey}
        screenKey={swappableTabKey}
        title={swappableTabKey}>
        <TabContent screenKey={swappableTabKey} onSwap={swap} />
      </Tabs.Screen>
    </Tabs.Host>
  );
}

export default createScenario(TestTabsSwapTabs, scenarioDescription);
