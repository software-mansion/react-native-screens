import { SettingsSwitch } from '../../../shared/SettingsSwitch';
import React from 'react';
import { ScrollView } from 'react-native';
import BottomTabsConfigProvider, {
  BottomTabsAutoconfig,
  useBottomTabsConfig,
  useDispatchBottomTabsConfig,
} from '../../shared/BottomTabsConfigProvider';

function ConfigScreen() {
  const config = useBottomTabsConfig();
  const dispatch = useDispatchBottomTabsConfig();

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

export default function BottomAccessory() {
  return (
    <BottomTabsConfigProvider tabs={{ Tab1: ConfigScreen }}>
      <BottomTabsAutoconfig />
    </BottomTabsConfigProvider>
  );
}
