import React from 'react';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitViewBaseConfig } from '../helpers/types';

export const SplitViewWithNativeStackBase = ({ splitViewBaseConfig }: { splitViewBaseConfig: SplitViewBaseConfig }) => {
  return (
    <SplitViewHost {...splitViewBaseConfig}>
      <SplitViewScreen.Column>
        <NativeStackNavigatorComponent />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <NativeStackNavigatorComponent />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <NativeStackNavigatorComponent />
      </SplitViewScreen.Column>
    </SplitViewHost>
  );
}
