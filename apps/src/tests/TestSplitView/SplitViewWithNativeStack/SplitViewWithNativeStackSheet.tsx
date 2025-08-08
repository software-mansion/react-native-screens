import React from 'react';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitViewBaseConfig } from '../helpers/types';
import { ScrollViewWithText } from './common';

export const SplitViewWithNativeStackSheet = ({ splitViewBaseConfig }: { splitViewBaseConfig: SplitViewBaseConfig }) => {
  return (
    <SplitViewHost {...splitViewBaseConfig}>
      <SplitViewScreen.Column>
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
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
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
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
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
      </SplitViewScreen.Column>
    </SplitViewHost>
  );
};
