import React, { PropsWithChildren } from 'react';
import { Platform, findNodeHandle, View } from 'react-native';
import {
  Screen,
  ScreenProps,
  ScreenContext,
  TransitionProgressEventType,
} from 'react-native-screens';

// @ts-ignore file to be used only if `react-native-reanimated` available in the project
import Animated, { makeMutable } from 'react-native-reanimated';
// @ts-ignore file to be used only if `react-native-reanimated` available in the project, also types are not exported
import WorkletEventHandler from 'react-native-reanimated/src/reanimated2/WorkletEventHandler';
import ReanimatedTransitionProgressContext from './ReanimatedTransitionProgressContext';

const AnimatedScreen = Animated.createAnimatedComponent(
  (Screen as unknown) as React.ComponentClass
);

class ReanimatedScreen extends React.Component<ScreenProps> {
  private ref: React.ElementRef<typeof View> | null = null;
  private tag: number | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private eventHandler: WorkletEventHandler | null = null;
  private progress = makeMutable(0);
  private closing = makeMutable(0);
  private goingForward = makeMutable(0);

  setNativeProps(props: ScreenProps): void {
    this.ref?.setNativeProps(props);
  }

  setRef = (ref: React.ElementRef<typeof View> | null): void => {
    this.tag = findNodeHandle(ref);
    this.ref = ref;
    this.props.onComponentRef?.(ref);
    if (this.eventHandler == null && this.tag != null) {
      const progressRef = this.progress;
      const closingRef = this.closing;
      const goingForwardRef = this.goingForward;
      this.eventHandler = new WorkletEventHandler(
        (event: TransitionProgressEventType) => {
          'worklet';
          progressRef.value = event.progress;
          closingRef.value = event.closing;
          goingForwardRef.value = event.goingForward;
        },
        [
          // @ts-ignore wrong type
          Platform.OS === 'android'
            ? 'onTransitionProgress'
            : 'topTransitionProgress',
        ]
      );
      this.eventHandler.registerForEvents(this.tag);
    }
  };

  componentWillUnmount() {
    if (this.eventHandler) {
      this.eventHandler.unregisterFromEvents();
      this.eventHandler = null;
    }
  }

  render() {
    const { children, copyTransitionProgress = false, ...rest } = this.props;

    return (
      <AnimatedScreen
        {...rest}
        // @ts-ignore some problems with types
        ref={this.setRef}>
        {copyTransitionProgress ? ( // if we are in an iOS modal with `headerShown: true`, there is a nested stack with no transition
          children
        ) : (
          <ReanimatedTransitionProgressContext.Provider
            value={{
              progress: this.progress,
              closing: this.closing,
              goingForward: this.goingForward,
            }}>
            {children}
          </ReanimatedTransitionProgressContext.Provider>
        )}
      </AnimatedScreen>
    );
  }
}

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
