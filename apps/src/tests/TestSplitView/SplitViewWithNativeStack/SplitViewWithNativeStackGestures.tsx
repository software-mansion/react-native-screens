import React from 'react';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitViewBaseConfig } from '../helpers/types';

export const SplitViewWithNativeStackGestures = ({
  splitViewBaseConfig,
}: {
  splitViewBaseConfig: SplitViewBaseConfig;
}) => {
  return (
    <SplitViewHost {...splitViewBaseConfig}>
      <SplitViewScreen.Column>
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
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
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
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
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
      </SplitViewScreen.Column>
    </SplitViewHost>
  );
};
