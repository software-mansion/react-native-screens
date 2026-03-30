import React from 'react';
import { SplitView, SplitScreen } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitBaseConfig } from '../helpers/types';
import { ScrollViewWithText } from './common';

export const SplitWithNativeStackSheet = ({ splitBaseConfig }: { splitBaseConfig: SplitBaseConfig }) => {
  return (
    <SplitView {...splitBaseConfig}>
      <SplitView.Primary>
        <SplitScreen screenKey="primary" activityMode="attached">
          <NativeStackNavigatorComponent
            customScreenTwoNavigationOptions={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.3, 0.8],
            }}
            customScreenThreeNavigationOptions={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents',
            }}
          />
        </SplitScreen>
      </SplitView.Primary>
      <SplitView.Supplementary>
        <SplitScreen screenKey="supplementary" activityMode="attached">
          <NativeStackNavigatorComponent
            customScreenTwoNavigationOptions={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.3, 0.8],
              sheetCornerRadius: 100,
            }}
            customScreenThreeNavigationOptions={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.3, 0.8],
              sheetCornerRadius: 100,
              sheetExpandsWhenScrolledToEdge: false
            }}
            CustomScreenThree={ScrollViewWithText}
          />
        </SplitScreen>
      </SplitView.Supplementary>
      <SplitView.Secondary>
        <SplitScreen screenKey="secondary" activityMode="attached">
          <NativeStackNavigatorComponent
            customScreenTwoNavigationOptions={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.3, 0.8],
              sheetInitialDetentIndex: 1,
              sheetLargestUndimmedDetentIndex: 1
            }}
            customScreenThreeNavigationOptions={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.3, 0.8],
              sheetGrabberVisible: true,
            }}
          />
        </SplitScreen>
      </SplitView.Secondary>
    </SplitView>
  );
};
