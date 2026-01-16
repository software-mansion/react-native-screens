import { SettingsPicker } from '../../../shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import {
  createTabsConfig,
  findTabScreenOptions,
  useTabsConfig,
  useDispatchTabsConfig,
} from '../../shared/TabsConfigProvider';
import { DummyScreen } from '../../shared/DummyScreens';
import {
  createStackConfig,
  findStackScreenOptions,
  useDispatchStackConfig,
  useStackConfig,
} from '../../shared/StackConfigProvider';

type StackParamList = {
  Screen1: undefined;
};

type TabsParamList = {
  Tab1: undefined;
  Tab2: undefined;
};

function ConfigScreen() {
  const tabsConfig = useTabsConfig<TabsParamList>();
  const tabsDispatch = useDispatchTabsConfig<TabsParamList>();

  const stackConfig = useStackConfig<StackParamList>();
  const stackDispatch = useDispatchStackConfig<StackParamList>();

  return (
    <ScrollView style={{ padding: 40 }}>
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
    </ScrollView>
  );
}

const Tabs = createTabsConfig<TabsParamList>({
  Tab1: ConfigScreen,
  Tab2: DummyScreen,
});

function TabsScreen() {
  return (
    <Tabs.Provider>
      <Tabs.Autoconfig />
    </Tabs.Provider>
  );
}

const Stack = createStackConfig<StackParamList>({ Screen1: TabsScreen });

export default function TabsAndStack() {
  return (
    <Stack.Provider>
      <Stack.Autoconfig />
    </Stack.Provider>
  );
}
