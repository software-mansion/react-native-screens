import React from 'react';
import { Platform } from 'react-native';
import {
  Screen,
  ScreenProps,
  TransitionProgressEventType,
} from 'react-native-screens';

// @ts-ignore file to be used only if `react-native-reanimated` available in the project
import Animated, { useEvent, useSharedValue } from 'react-native-reanimated';
import ReanimatedTransitionProgressContext from './ReanimatedTransitionProgressContext';

const AnimatedScreen = Animated.createAnimatedComponent(
  (Screen as unknown) as React.ComponentClass
);

const ReanimatedNativeStackScreen = React.forwardRef<
  typeof AnimatedScreen,
  ScreenProps
>((props, ref) => {
  const { children, ...rest } = props;

  const progress = useSharedValue(0);
  const closing = useSharedValue(0);
  const goingForward = useSharedValue(0);

  return (
    <AnimatedScreen
      // @ts-ignore some problems with ref and onTransitionProgressReanimated being "fake" prop for parsing of `useEvent` return value
      ref={ref}
      onTransitionProgressReanimated={useEvent(
        (event: TransitionProgressEventType) => {
          'worklet';
          progress.value = event.progress;
          closing.value = event.closing;
          goingForward.value = event.goingForward;
        },
        [
          // This should not be necessary, but is not properly managed by `react-native-reanimated`
          // @ts-ignore wrong type
          Platform.OS === 'android'
            ? 'onTransitionProgress'
            : 'topTransitionProgress',
        ]
      )}
      {...rest}>
      <ReanimatedTransitionProgressContext.Provider
        value={{
          progress: progress,
          closing: closing,
          goingForward: goingForward,
        }}>
        {children}
      </ReanimatedTransitionProgressContext.Provider>
    </AnimatedScreen>
  );
});

ReanimatedNativeStackScreen.displayName = 'ReanimatedNativeStackScreen';

export default ReanimatedNativeStackScreen;
