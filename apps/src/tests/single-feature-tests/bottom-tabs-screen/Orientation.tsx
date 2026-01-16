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

type TabParamList = {
  Tab1: undefined;
  Tab2: undefined;
};

function ConfigScreen() {
  const config = useBottomTabsConfig<TabParamList>();
  const dispatch = useDispatchBottomTabsConfig<TabParamList>();

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

const Tabs = createTabsConfig<TabParamList>({
  Tab1: ConfigScreen,
  Tab2: DummyScreen,
});

export default function Orientation() {
  return (
    <Tabs.Provider>
      <Tabs.Autoconfig />
    </Tabs.Provider>
  );
}
