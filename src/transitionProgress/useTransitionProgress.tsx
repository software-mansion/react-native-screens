import React from 'react';
import { Platform } from 'react-native';
import ScreenContext from './TransitionProgressContext';

// @ts-ignore file to be used only if `react-native-reanimated` available in the project
import Animated, { useEvent } from 'react-native-reanimated';

// @ts-ignore types missing
const isRea2Available = Animated.isConfigured?.();

export function useTransitionProgress(handler: () => void) {
  const Screen = React.useContext(ScreenContext);

  const AnimatedScreen = Animated.createAnimatedComponent(Screen);

  const transitionProgress = React.useEffect(() => {
    useEvent(handler, [
      Platform.OS === 'android'
        ? 'onTransitionProgress'
        : 'topTransitionProgress',
    ]);
  }, [AnimatedScreen, useEvent]);

  return transitionProgress;
}
