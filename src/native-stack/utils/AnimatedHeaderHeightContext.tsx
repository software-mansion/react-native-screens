import * as React from 'react';
import type { Animated } from 'react-native';

const AnimatedHeaderHeightContext = React.createContext<
  Animated.Value | undefined
>(undefined);

export default AnimatedHeaderHeightContext;
