import { SettingsPicker } from '../../../shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import {
  createAutoConfiguredStack,
  findStackScreenOptions,
  useDispatchStackConfig,
  useStackConfig,
} from '../../shared/contexts/stack-config';

type StackParamList = {
  Screen1: undefined;
};

function ConfigScreen() {
  const config = useStackConfig<StackParamList>();
  const dispatch = useDispatchStackConfig<StackParamList>();

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

export default function Orientation() {
  return (
    <Stack.Provider>
      <Stack.Autoconfig />
    </Stack.Provider>
  );
}
