import { SettingsPicker } from '../../../shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import StackConfigProvider, { StackAutoconfig, useDispatchStackConfig, useStackConfig } from '../../shared/StackConfigProvider';

function ConfigScreen() {
  const config = useStackConfig();
  const dispatch = useDispatchStackConfig();

  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsPicker
        label='orientation'
        items={['portrait', 'landscape', 'undefined']}
        value={config.find(c => c.name === 'Screen1')?.options?.orientation ?? 'undefined'}
        onValueChange={value => dispatch({ type: 'screen', name: 'Screen1', config: { orientation: value === 'undefined' ? undefined : value } })}
      />
    </ScrollView>
  );
};

export default function Orientation() {
  return (
    <StackConfigProvider screens={{ Screen1: ConfigScreen }}>
      <StackAutoconfig />
    </StackConfigProvider>
  )
}

