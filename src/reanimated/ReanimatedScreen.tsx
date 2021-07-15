import React, { PropsWithChildren } from 'react';
import { Platform, View } from 'react-native';
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

class ReanimatedScreenWrapper extends React.Component<ScreenProps> {
  private ref: React.ElementRef<typeof View> | null = null;

  setNativeProps(props: ScreenProps): void {
    this.ref?.setNativeProps(props);
  }

  setRef = (ref: React.ElementRef<typeof View> | null): void => {
    this.ref = ref;
    this.props.onComponentRef?.(ref);
  };

  render() {
    return (
      <ReanimatedScreen
        {...this.props}
        // @ts-ignore some problems with ref
        ref={this.setRef}
      />
    );
  }
}

const ReanimatedScreen = React.forwardRef<typeof AnimatedScreen, ScreenProps>(
  (props, ref) => {
    const { children, ...rest } = props;

    const progress = useSharedValue(0);
    const closing = useSharedValue(0);
    const goingForward = useSharedValue(0);

    return (
      <AnimatedScreen
        // @ts-ignore some problems with ref and onTransitionProgressReanimated being "fake" prop for parsing of `useEvent` return value
        ref={ref}
        // ReanimatedScreen.tsx should only be used by Screens of native-stack, but it always better to check
        onTransitionProgressReanimated={
          !props.isNativeStack
            ? undefined
            : useEvent(
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
              )
        }
        {...rest}>
        {!props.isNativeStack ? ( // see comment of this prop in types.tsx for information why it is needed
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
    <ScreenContext.Provider value={ReanimatedScreenWrapper as any}>
      {props.children}
    </ScreenContext.Provider>
  );
}
