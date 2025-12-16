import React from 'react';
import { Split } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitBaseConfig } from '../helpers/types';

export const SplitWithNativeStackBase = ({ splitViewBaseConfig }: { splitViewBaseConfig: SplitBaseConfig }) => {
  return (
    <Split.Host {...splitViewBaseConfig}>
      <Split.Column>
        <NativeStackNavigatorComponent />
      </Split.Column>
      <Split.Column>
        <NativeStackNavigatorComponent />
      </Split.Column>
      <Split.Column>
        <NativeStackNavigatorComponent />
      </Split.Column>
    </Split.Host>
  );
}
