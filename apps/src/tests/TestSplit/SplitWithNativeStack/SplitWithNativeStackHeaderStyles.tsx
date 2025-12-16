import React from 'react';
import { Split } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitBaseConfig } from '../helpers/types';
import Colors from '../../../shared/styling/Colors';

export const SplitWithNativeStackHeaderStyles = ({
  splitViewBaseConfig,
}: {
  splitViewBaseConfig: SplitBaseConfig;
}) => {
  return (
    <Split.Host {...splitViewBaseConfig}>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            headerBackButtonDisplayMode: 'generic',
          }}
          customScreenTwoNavigationOptions={{
            headerBackButtonDisplayMode: 'minimal',
            headerBackButtonMenuEnabled: true,
          }}
          customScreenThreeNavigationOptions={{
            headerBackButtonDisplayMode: 'generic',
            headerBackButtonMenuEnabled: false,
          }}
        />
      </Split.Column>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            headerLargeTitle: true,
          }}
          customScreenTwoNavigationOptions={{
            headerLargeTitle: true,
            headerLargeTitleStyle: {
              color: Colors.RedDark100,
              fontSize: 30,
              fontWeight: 'bold',
            },
          }}
          customScreenThreeNavigationOptions={{
            headerLargeTitle: true,
            headerLargeStyle: {
              backgroundColor: Colors.GreenDark100,
            },
          }}
        />
      </Split.Column>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            headerStyle: {
              backgroundColor: Colors.BlueLight100,
            },
          }}
          customScreenTwoNavigationOptions={{
            headerStyle: {
              backgroundColor: Colors.GreenDark100,
            },
          }}
          customScreenThreeNavigationOptions={{
            headerStyle: {
              backgroundColor: Colors.YellowDark100,
            },
          }}
        />
      </Split.Column>
    </Split.Host>
  );
};
