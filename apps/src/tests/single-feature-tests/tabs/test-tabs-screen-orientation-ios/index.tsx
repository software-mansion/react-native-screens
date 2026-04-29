import { SettingsPicker } from '@apps/shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import type { TabsScreenOrientation } from 'react-native-screens';

const scenarioDescription: ScenarioDescription = {
  name: 'Tabs Screen Orientation',
  key: 'tabs-screen-orientation',
  platforms: ['ios'],
};

const ORIENTATION_VALUES: Array<TabsScreenOrientation | 'undefined'> = [
  'undefined',
  'inherit',
  'all',
  'allButUpsideDown',
  'portrait',
  'portraitUp',
  'portraitDown',
  'landscape',
  'landscapeLeft',
  'landscapeRight',
];

function ConfigScreen() {
  const { routeKey, routeOptions, setRouteOptions } =
    useTabsNavigationContext();

  const currentValue: TabsScreenOrientation | 'undefined' =
    routeOptions.orientation ?? 'undefined';

  return (
    <ScrollView style={{padding: 40}}>
      <SettingsPicker<TabsScreenOrientation | 'undefined'>
        testID="orientation-picker"
        label="orientation"
        items={ORIENTATION_VALUES}
        value={currentValue}
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

export default createScenario(App, scenarioDescription);
