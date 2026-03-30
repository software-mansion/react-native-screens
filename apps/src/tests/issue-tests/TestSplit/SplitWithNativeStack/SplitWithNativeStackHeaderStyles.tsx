import React from 'react';
import { SplitView, SplitScreen } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitBaseConfig } from '../helpers/types';
import Colors from '../../../../shared/styling/Colors';

export const SplitWithNativeStackHeaderStyles = ({
  splitBaseConfig,
}: {
  splitBaseConfig: SplitBaseConfig;
}) => {
  return (
    <SplitView {...splitBaseConfig}>
      <SplitView.Primary>
        <SplitScreen screenKey="primary" activityMode="attached">
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
        </SplitScreen>
      </SplitView.Primary>
      <SplitView.Supplementary>
        <SplitScreen screenKey="supplementary" activityMode="attached">
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
        </SplitScreen>
      </SplitView.Supplementary>
      <SplitView.Secondary>
        <SplitScreen screenKey="secondary" activityMode="attached">
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
        </SplitScreen>
      </SplitView.Secondary>
    </SplitView>
  );
};
