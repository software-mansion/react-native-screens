import { SettingsPicker } from '../../../shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import { DummyScreen } from '../../shared/DummyScreens';
import useTabsConfigState from '../../shared/hooks/tabs-config';
import {
  createAutoConfiguredTabs,
  findTabScreenOptions,
} from '../../shared/tabs';
import { Scenario } from '../../shared/helpers';

const SCENARIO: Scenario = {
  name: 'Tabs Screen Orientation',
  key: 'tabs-screen-orientation',
  AppComponent: App,
  platforms: ['ios', 'android'],
};

export default SCENARIO;

type TabParamList = {
  Tab1: undefined;
  Tab2: undefined;
};

function ConfigScreen() {
  const [config, dispatch] = useTabsConfigState<TabParamList>();

  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsPicker
        label="orientation"
        items={['portrait', 'landscape', 'undefined']}
        value={
          findTabScreenOptions(config, 'Tab1')?.tabScreenProps.orientation ??
          'undefined'
        }
        onValueChange={value =>
          dispatch({
            type: 'tabScreen',
            tabKey: 'Tab1',
            config: {
              tabScreenProps: {
                orientation: value === 'undefined' ? undefined : value,
              },
            },
          })
        }
      />
    </ScrollView>
  );
}

const Tabs = createAutoConfiguredTabs<TabParamList>({
  Tab1: ConfigScreen,
  Tab2: DummyScreen,
});

export function App() {
  return (
    <Tabs.Provider>
      <Tabs.Autoconfig />
    </Tabs.Provider>
  );
}
