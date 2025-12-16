import React from 'react';
import { Split } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitViewBaseConfig } from '../helpers/types';

export const SplitViewWithNativeStackBase = ({ splitViewBaseConfig }: { splitViewBaseConfig: SplitViewBaseConfig }) => {
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
