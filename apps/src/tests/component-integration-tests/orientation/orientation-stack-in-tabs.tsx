import React from 'react';
import { ScrollView } from 'react-native';
import { SettingsPicker } from '../../../shared/SettingsPicker';
import { DummyScreen } from '../../shared/DummyScreens';
import { Scenario } from '../../shared/helpers';
import useStackConfigState from '../../shared/hooks/stack-config';
import useTabsConfigState from '../../shared/hooks/tabs-config';
import {
  createAutoConfiguredStack,
  findStackScreenOptions,
} from '../../shared/stack';
import {
  createAutoConfiguredTabs,
  findTabScreenOptions,
} from '../../shared/tabs';

const SCENARIO: Scenario = {
  name: 'StackInTabs',
  details:
    'Configuration in Stack contained within TabScreen always takes precedence',
  key: 'cit-orientation-stack-in-tabs',
  AppComponent: App,
  platforms: ['ios'],
};

export default SCENARIO;

type StackParamsList = {
  Screen1: undefined;
};

type TabsParamsList = {
  Tab1: undefined;
  Tab2: undefined;
};

function ConfigScreen() {
  const [tabsConfig, tabsDispatch] = useTabsConfigState<TabsParamsList>();

  const [stackConfig, stackDispatch] = useStackConfigState<StackParamsList>();

  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsPicker
        label="Tab Screen orientation"
        items={['portrait', 'landscape', 'undefined']}
        value={
          findTabScreenOptions(tabsConfig, 'Tab1')?.options?.orientation ??
          'undefined'
        }
        onValueChange={value =>
          tabsDispatch({
            type: 'tabScreen',
            name: 'Tab1',
            config: {
              options: {
                orientation: value === 'undefined' ? undefined : value,
              },
            },
          })
        }
      />
      <SettingsPicker
        label="Stack Screen orientation"
        items={['portrait', 'landscape', 'undefined']}
        value={
          findStackScreenOptions(stackConfig, 'Screen1')?.orientation ??
          'undefined'
        }
        onValueChange={value =>
          stackDispatch({
            type: 'screen',
            name: 'Screen1',
            config: { orientation: value === 'undefined' ? undefined : value },
          })
        }
      />
    </ScrollView>
  );
}

const Stack = createAutoConfiguredStack<StackParamsList>({
  Screen1: ConfigScreen,
});

function StackScreen() {
  return (
    <Stack.Provider>
      <Stack.Autoconfig />
    </Stack.Provider>
  );
}

const Tabs = createAutoConfiguredTabs<TabsParamsList>({
  Tab1: StackScreen,
  Tab2: DummyScreen,
});

export function App() {
  return (
    <Tabs.Provider>
      <Tabs.Autoconfig />
    </Tabs.Provider>
  );
}
