import { ScreenProps } from 'react-native-screens';
import { Animated, View } from 'react-native';
import React from 'react';

import { screensEnabled } from '../core';

export const InnerScreen = View;

const NativeScreen = (props: ScreenProps) => {
  let {
    active,
    activityState,
    style,
    enabled = screensEnabled(),
    ...rest
  } = props;

  if (enabled) {
    if (active !== undefined && activityState === undefined) {
      activityState = active !== 0 ? 2 : 0; // change taken from index.native.tsx
    }
    return (
      <View
        // @ts-expect-error: hidden exists on web, but not in React Native
        hidden={activityState === 0}
        style={[style, { display: activityState !== 0 ? 'flex' : 'none' }]}
        {...rest}
      />
    );
  }

  return <View {...rest} />;
};

const Screen = Animated.createAnimatedComponent(NativeScreen);

export const ScreenContext = React.createContext(Screen);

export default Screen;
