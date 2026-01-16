import { SettingsSwitch } from '../../../shared/SettingsSwitch';
import React from 'react';
import { ScrollView } from 'react-native';
import {
  createTabsConfig,
  useBottomTabsConfig,
  useDispatchBottomTabsConfig,
} from '../../shared/BottomTabsConfigProvider';

type TabsParamList = {
  Tab1: undefined;
};

function ConfigScreen() {
  const config = useBottomTabsConfig<TabsParamList>();
  const dispatch = useDispatchBottomTabsConfig<TabsParamList>();

  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsSwitch
        label="tabBarHidden"
        value={config.tabBarHidden ?? false}
        onValueChange={value =>
          dispatch({ type: 'tabBar', config: { tabBarHidden: value } })
        }
      />
    </ScrollView>
  );
}

const Tabs = createTabsConfig<TabsParamList>({ Tab1: ConfigScreen });

export default function BottomAccessory() {
  return (
    <Tabs.Provider>
      <Tabs.Autoconfig />
    </Tabs.Provider>
  );
}
