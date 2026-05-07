import { SettingsPicker } from '@apps/shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import useStackConfigState from '@apps/tests/shared/hooks/stack-config';
import {
  createAutoConfiguredStack,
  findStackScreenOptions,
} from '@apps/tests/shared/stack';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Orientation',
  key: 'stack-v4-orientation',
  platforms: ['ios', 'android'],
};

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

export default createScenario(App, scenarioDescription);
