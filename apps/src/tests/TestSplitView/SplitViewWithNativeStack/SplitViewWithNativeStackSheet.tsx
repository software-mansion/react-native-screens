import React from 'react';
import { Split } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitViewBaseConfig } from '../helpers/types';
import { ScrollViewWithText } from './common';

export const SplitViewWithNativeStackSheet = ({ splitViewBaseConfig }: { splitViewBaseConfig: SplitViewBaseConfig }) => {
  return (
    <Split.Host {...splitViewBaseConfig}>
      <Split.Column>
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
      </Split.Column>
      <Split.Column>
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
      </Split.Column>
      <Split.Column>
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
      </Split.Column>
    </Split.Host>
  );
};
