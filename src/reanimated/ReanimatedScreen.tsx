import React, { PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import {
  Screen,
  ScreenProps,
  ScreenContext,
  TransitionProgressEventType,
} from 'react-native-screens';

// @ts-ignore file to be used only if `react-native-reanimated` available in the project
import Animated, { useEvent, useSharedValue } from 'react-native-reanimated';
import ReanimatedTransitionProgressContext from './ReanimatedTransitionProgressContext';

const AnimatedScreen = Animated.createAnimatedComponent(
  (Screen as unknown) as React.ComponentClass
);

const ReanimatedScreen = React.forwardRef<typeof AnimatedScreen, ScreenProps>(
  (props, ref) => {
    const { children, copyTransitionProgress, ...rest } = props;

    const progress = useSharedValue(0);
    const closing = useSharedValue(0);
    const goingForward = useSharedValue(0);

    const transitionProgress = useEvent(
      (event: TransitionProgressEventType) => {
        'worklet';
        progress.value = event.progress;
        closing.value = event.closing;
        goingForward.value = event.goingForward;
      },
      [
        // @ts-ignore wrong type
        Platform.OS === 'android'
          ? 'onTransitionProgress'
          : 'topTransitionProgress',
      ]
    );

    return (
      <AnimatedScreen
        // @ts-ignore some problems with ref and eventProp being "fake" prop for parsing of `useEvent` return value
        ref={ref}
        eventProp={transitionProgress}
        {...rest}>
        {copyTransitionProgress ? ( // see comment of this prop in types.tsx for information why it is needed
          children
        ) : (
          <ReanimatedTransitionProgressContext.Provider
            value={{
              progress: progress,
              closing: closing,
              goingForward: goingForward,
            }}>
            {children}
          </ReanimatedTransitionProgressContext.Provider>
        )}
      </AnimatedScreen>
    );
  }
);

// used to silence error "Component definition is missing display name"
ReanimatedScreen.displayName = 'ReanimatedScreen';

export default function ReanimatedScreenProvider(
  props: PropsWithChildren<unknown>
) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ScreenContext.Provider value={ReanimatedScreen as any}>
      {props.children}
    </ScreenContext.Provider>
  );
}
