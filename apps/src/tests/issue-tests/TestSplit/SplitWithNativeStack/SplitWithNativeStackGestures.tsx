import React from 'react';
import { SplitView, SplitScreen } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent } from '../helpers';
import { SplitBaseConfig } from '../helpers/types';

export const SplitWithNativeStackGestures = ({
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
              gestureEnabled: true,
            }}
            customScreenTwoNavigationOptions={{
              gestureEnabled: true,
            }}
            customScreenThreeNavigationOptions={{
              gestureEnabled: false,
            }}
          />
        </SplitScreen>
      </SplitView.Primary>
      <SplitView.Supplementary>
        <SplitScreen screenKey="supplementary" activityMode="attached">
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
        </SplitScreen>
      </SplitView.Supplementary>
      <SplitView.Secondary>
        <SplitScreen screenKey="secondary" activityMode="attached">
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
        </SplitScreen>
      </SplitView.Secondary>
    </SplitView>
  );
};
