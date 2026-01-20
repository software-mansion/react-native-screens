import { SettingsSwitch } from '../../../shared/SettingsSwitch';
import React from 'react';
import { ScrollView } from 'react-native';
import useTabsConfigState from '../../shared/hooks/tabs-config';
import { createAutoConfiguredTabs } from '../../shared/tabs';

type TabsParamList = {
  Tab1: undefined;
};

function ConfigScreen() {
  const [config, dispatch] = useTabsConfigState<TabsParamList>();

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

const Tabs = createAutoConfiguredTabs<TabsParamList>({ Tab1: ConfigScreen });

export default function BottomAccessory() {
  return (
    <Tabs.Provider>
      <Tabs.Autoconfig />
    </Tabs.Provider>
  );
}
