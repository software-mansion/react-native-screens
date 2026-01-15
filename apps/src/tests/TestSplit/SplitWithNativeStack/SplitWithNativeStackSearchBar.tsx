import React from 'react';
import { Split } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitBaseConfig } from '../helpers/types';
import { ScrollViewWithText } from './common';
import Colors from '../../../shared/styling/Colors';

export const SplitWithNativeStackSearchBar = ({
  splitBaseConfig,
}: {
  splitBaseConfig: SplitBaseConfig;
}) => {
  return (
    <Split.Host {...splitBaseConfig}>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            headerSearchBarOptions: {
              autoCapitalize: 'words',
              autoFocus: true,
              barTintColor: Colors.GreenLight100,
              tintColor: Colors.RedDark100,
              // Added in https://github.com/software-mansion/react-native-screens/pull/3186
              // to preserve test's original search bar configuration.
              placement: 'stacked',
              hideWhenScrolling: false,
            },
          }}
        />
      </Split.Column>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            headerSearchBarOptions: {
              hideNavigationBar: true,
              // Added in https://github.com/software-mansion/react-native-screens/pull/3186
              // to preserve test's original search bar configuration.
              placement: 'stacked',
              hideWhenScrolling: false,
            },
          }}
          customScreenTwoNavigationOptions={{
            headerSearchBarOptions: {
              // Added in https://github.com/software-mansion/react-native-screens/pull/3186
              // to preserve test's original search bar configuration.
              placement: 'stacked',
              hideWhenScrolling: false,
              hideNavigationBar: false,
            },
          }}
        />
      </Split.Column>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenTwoNavigationOptions={{
            headerSearchBarOptions: {
              // Added in https://github.com/software-mansion/react-native-screens/pull/3186
              // to preserve test's original search bar configuration.
              placement: 'stacked',
              hideWhenScrolling: false,
            },
          }}
          CustomScreenTwo={ScrollViewWithText}
        />
      </Split.Column>
    </Split.Host>
  );
};
