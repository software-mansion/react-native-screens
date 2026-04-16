import { SettingsPicker } from '@apps/shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import {
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';


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

export default function App() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} />;
}

App.scenarioDescription = {
  name: 'Tabs Screen Orientation',
  key: 'tabs-screen-orientation',
  platforms: ['ios', 'android'],
} as ScenarioDescription;
