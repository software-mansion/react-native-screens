import { SettingsPicker } from '../../../shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import BottomTabsConfigProvider, { BottomTabsAutoconfig, useBottomTabsConfig, useDispatchBottomTabsConfig } from '../../shared/BottomTabsConfigProvider';
import { DummyScreen } from '../../shared/DummyScreens';

function ConfigScreen() {
  const config = useBottomTabsConfig();
  const dispatch = useDispatchBottomTabsConfig();

  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsPicker
        label='orientation'
        items={['portrait', 'landscape', 'undefined']}
        value={config.tabConfigs.find(c => c.tabScreenProps.tabKey === 'Tab1')?.tabScreenProps.orientation ?? 'undefined'}
        onValueChange={value => dispatch({ type: 'tabScreen', tabKey: 'Tab1', config: { tabScreenProps: { orientation: value === 'undefined' ? undefined : value } } })}
      />
    </ScrollView>
  );
};

export default function Orientation() {
  return (
    <BottomTabsConfigProvider tabs={{ Tab1: ConfigScreen, Tab2: DummyScreen }}>
      <BottomTabsAutoconfig />
    </BottomTabsConfigProvider>
  )
}
