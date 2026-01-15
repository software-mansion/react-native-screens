import { SettingsPicker } from '../../../shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import BottomTabsConfigProvider, {
  BottomTabsAutoconfig,
  useBottomTabsConfig,
  useDispatchBottomTabsConfig,
} from '../../shared/BottomTabsConfigProvider';
import { DummyScreen } from '../../shared/DummyScreens';

import StackConfigProvider, {
  StackAutoconfig,
  useDispatchStackConfig,
  useStackConfig,
} from '../../shared/StackConfigProvider';

function ConfigScreen() {
  const tabsConfig = useBottomTabsConfig();
  const tabsDispatch = useDispatchBottomTabsConfig();
  const stackConfig = useStackConfig();
  const stackDispatch = useDispatchStackConfig();

  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsPicker
        label="Tab Screen orientation"
        items={['portrait', 'landscape', 'undefined']}
        value={
          tabsConfig.tabConfigs.find(c => c.tabScreenProps.tabKey === 'Tab1')
            ?.tabScreenProps.orientation ?? 'undefined'
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
          stackConfig.find(c => c.name === 'Screen1')?.options?.orientation ??
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

function StackScreen() {
  return (
    <StackConfigProvider screens={{ Screen1: ConfigScreen }}>
      <StackAutoconfig />
    </StackConfigProvider>
  );
}

export default function TabsAndStack() {
  return (
    <BottomTabsConfigProvider tabs={{ Tab1: StackScreen, Tab2: DummyScreen }}>
      <BottomTabsAutoconfig />
    </BottomTabsConfigProvider>
  );
}
