import { SettingsPicker } from '../../../shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import useStackConfigState from '../../shared/hooks/stack-config';
import {
  createAutoConfiguredStack,
  findStackScreenOptions,
} from '../../shared/stack';
import { Scenario } from '../../shared/helpers';

const SCENARIO: Scenario = {
  name: 'Orientation',
  key: 'stack-v4-orientation',
  platforms: ['ios', 'android'],
  AppComponent: App,
};

export default SCENARIO;

type StackParamList = {
  Screen1: undefined;
};

function ConfigScreen() {
  const [config, dispatch] = useStackConfigState<StackParamList>();

  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsPicker
        label="orientation"
        items={['portrait', 'landscape', 'undefined']}
        value={
          findStackScreenOptions(config, 'Screen1')?.orientation ?? 'undefined'
        }
        onValueChange={value =>
          dispatch({
            type: 'screen',
            name: 'Screen1',
            config: { orientation: value === 'undefined' ? undefined : value },
          })
        }
      />
    </ScrollView>
  );
}

const Stack = createAutoConfiguredStack<StackParamList>({
  Screen1: ConfigScreen,
});

export function App() {
  return (
    <Stack.Provider>
      <Stack.Autoconfig />
    </Stack.Provider>
  );
}
