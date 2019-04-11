import React from 'react';
import { Animated, View } from 'react-native';

let _shouldUseScreens = true;

export function useScreens(shouldUseScreens = true) {
  if (shouldUseScreens) {
    console.warn('react-native-screens is not fully support on this platform yet.');
  }
  _shouldUseScreens = shouldUseScreens;
}

export function screensEnabled() {
  return _shouldUseScreens;
}

export class Screen extends React.Component {
  render() {
    const { style, active, ...rest } = this.props;
    let viewStyle = [style];
    let activeValue = active;
    // Convert animated value to boolean.
    if (active && active.__getValue) {
      activeValue = !!active.__getValue();
    }

    if (activeValue !== undefined && !activeValue) {
      viewStyle.push({ display: 'none' });
    }

    return (
      <Animated.View {...rest} style={viewStyle} />
    );
  }
}

export const ScreenContainer = View;

export const NativeScreen = View;

export const NativeScreenContainer = View;
