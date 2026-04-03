import { SettingsPicker } from '@apps/shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';
import type { Scenario } from '@apps/tests/shared/helpers';
import {
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';

const SCENARIO: Scenario = {
  name: 'Tabs Screen Orientation',
  key: 'tabs-screen-orientation',
  AppComponent: App,
  platforms: ['ios', 'android'],
};

export default SCENARIO;

function ConfigScreen() {
  const { routeKey, routeOptions, setRouteOptions } = useTabsNavigationContext();

  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsPicker
        label="orientation"
        items={['portrait', 'landscape', 'undefined']}
        value={routeOptions.orientation ?? 'undefined'}
        onValueChange={value =>
          setRouteOptions(routeKey, {
            orientation: value === 'undefined' ? undefined : value,
          })
        }
      />
    </ScrollView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: ConfigScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab1',
    },
  },
  {
    name: 'Tab2',
    Component: DummyScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
    },
  },
];

export function App() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} />;
}
