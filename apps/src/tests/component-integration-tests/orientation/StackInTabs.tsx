import { SettingsPicker } from '../../../shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import {
  createTabsConfig,
  findTabScreenOptions,
  useBottomTabsConfig,
  useDispatchBottomTabsConfig,
} from '../../shared/BottomTabsConfigProvider';
import { DummyScreen } from '../../shared/DummyScreens';

import {
  createStackConfig,
  findStackScreenOptions,
  useDispatchStackConfig,
  useStackConfig,
} from '../../shared/StackConfigProvider';

type StackParamsList = {
  Screen1: undefined;
};

type TabsParamsList = {
  Tab1: undefined;
  Tab2: undefined;
};

function ConfigScreen() {
  const tabsConfig = useBottomTabsConfig<TabsParamsList>();
  const tabsDispatch = useDispatchBottomTabsConfig<TabsParamsList>();

  const stackConfig = useStackConfig<StackParamsList>();
  const stackDispatch = useDispatchStackConfig<StackParamsList>();

  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsPicker
        label="Tab Screen orientation"
        items={['portrait', 'landscape', 'undefined']}
        value={
          findTabScreenOptions(tabsConfig, 'Tab1')?.tabScreenProps
            .orientation ?? 'undefined'
        }
        onValueChange={value =>
          tabsDispatch({
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

const Stack = createStackConfig<StackParamsList>({ Screen1: ConfigScreen });

function StackScreen() {
  return (
    <Stack.Provider>
      <Stack.Autoconfig />
    </Stack.Provider>
  );
}

const Tabs = createTabsConfig<TabsParamsList>({
  Tab1: StackScreen,
  Tab2: DummyScreen,
});

export default function TabsAndStack() {
  return (
    <Tabs.Provider>
      <Tabs.Autoconfig />
    </Tabs.Provider>
  );
}
