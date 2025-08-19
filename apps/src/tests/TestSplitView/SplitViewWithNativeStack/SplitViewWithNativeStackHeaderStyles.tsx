import React from 'react';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitViewBaseConfig } from '../helpers/types';
import Colors from '../../../shared/styling/Colors';

export const SplitViewWithNativeStackHeaderStyles = ({
  splitViewBaseConfig,
}: {
  splitViewBaseConfig: SplitViewBaseConfig;
}) => {
  return (
    <SplitViewHost {...splitViewBaseConfig}>
      <SplitViewScreen.Column>
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
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
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
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
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
      </SplitViewScreen.Column>
    </SplitViewHost>
  );
};
