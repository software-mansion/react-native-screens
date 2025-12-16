import React from 'react';
import { Split } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitBaseConfig } from '../helpers/types';

export const SplitWithNativeStackGestures = ({
  splitViewBaseConfig,
}: {
  splitViewBaseConfig: SplitBaseConfig;
}) => {
  return (
    <Split.Host {...splitViewBaseConfig}>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            gestureEnabled: true,
          }}
          customScreenTwoNavigationOptions={{
            gestureEnabled: true,
          }}
          customScreenThreeNavigationOptions={{
            gestureEnabled: false,
          }}
        />
      </Split.Column>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            fullScreenGestureEnabled: true,
            gestureEnabled: true,
          }}
          customScreenTwoNavigationOptions={{
            fullScreenGestureEnabled: true,
            gestureEnabled: true,
          }}
          customScreenThreeNavigationOptions={{
            fullScreenGestureEnabled: true,
            gestureEnabled: false,
          }}
        />
      </Split.Column>
      <Split.Column>
        <NativeStackNavigatorComponent
          customScreenOneNavigationOptions={{
            fullScreenGestureEnabled: true,
            animation: 'fade_from_bottom',
            animationMatchesGesture: true,
          }}
          customScreenTwoNavigationOptions={{
            fullScreenGestureEnabled: true,
            animation: 'fade_from_bottom',
            animationMatchesGesture: true,
          }}
          customScreenThreeNavigationOptions={{
            fullScreenGestureEnabled: true,
            animation: 'fade_from_bottom',
            animationMatchesGesture: true,
          }}
        />
      </Split.Column>
    </Split.Host>
  );
};
