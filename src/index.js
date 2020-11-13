import React from 'react';
import { Animated, View } from 'react-native';

let ENABLE_SCREENS = true;

export function enableScreens(shouldEnableScreens = true) {
  ENABLE_SCREENS = shouldEnableScreens;
}

export function screensEnabled() {
  return ENABLE_SCREENS;
}

export class NativeScreen extends React.Component {
  render() {
    let { active, activityState, style, enabled = true, ...rest } = this.props;
    if (active !== undefined && activityState === undefined) {
      console.warn(
        'It appears that you are using old version of react-navigation library. Please update @react-navigation/bottom-tabs, @react-navigation/stack and @react-navigation/drawer to version 5.10.0 or above to take full advantage of new functionality added to react-native-screens'
      );
      activityState = active !== 0 ? 2 : 0; // in the new version, we need one of the screens to have value of 2 after the transition
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

export const shouldUseActivityState = true;
