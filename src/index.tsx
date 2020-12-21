import React from 'react';
import { Animated, View, ViewProps } from 'react-native';

let ENABLE_SCREENS = true;

export function enableScreens(shouldEnableScreens = true): void {
  ENABLE_SCREENS = shouldEnableScreens;
}

export function screensEnabled(): boolean {
  return ENABLE_SCREENS;
}

interface WebScreenProps extends ViewProps {
  active?: 0 | 1 | Animated.AnimatedInterpolation;
  activityState?: 0 | 1 | 2 | Animated.AnimatedInterpolation;
  children?: React.ReactNode;
  /**
   * @description All children screens should have the same value of their "enabled" prop as their container.
   */
  enabled?: boolean;
}

export class NativeScreen extends React.Component<WebScreenProps> {
  render() {
    let { active, activityState, style, enabled = true, ...rest } = this.props;
    if (active !== undefined && activityState === undefined) {
      activityState = active !== 0 ? 2 : 0; // change taken from index.native.js
    }
    return (
      <View
        style={[
          style,
          ENABLE_SCREENS && enabled && activityState !== 2
            ? { display: 'none' }
            : null,
        ]}
        {...rest}
      />
    );
  }
}

export const Screen = Animated.createAnimatedComponent(NativeScreen);

export const ScreenContainer = View;

export const NativeScreenContainer = View;

export const ScreenStack = View;

export const ScreenStackHeaderBackButtonImage = View;

export const ScreenStackHeaderLeftView = View;

export const ScreenStackHeaderRightView = View;

export const ScreenStackHeaderCenterView = View;

export const ScreenStackHeaderConfig = View;

export const shouldUseActivityState = true;
