import React from 'react';
import { Platform } from 'react-native';
import { InnerScreen } from '../components/Screen';
import {
  HeaderHeightChangeEventType,
  ScreenProps,
  TransitionProgressEventType,
  SheetTranslationEventType,
} from '../types';

// @ts-ignore file to be used only if `react-native-reanimated` available in the project
import Animated, {
  useEvent,
  useSharedValue,
  withSpring,
  WithSpringConfig,
  withTiming,
} from 'react-native-reanimated';
import ReanimatedTransitionProgressContext from './ReanimatedTransitionProgressContext';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import getDefaultHeaderHeight from '../native-stack/utils/getDefaultHeaderHeight';
import getStatusBarHeight from '../native-stack/utils/getStatusBarHeight';
import ReanimatedHeaderHeightContext from './ReanimatedHeaderHeightContext';
import ReanimatedSheetTranslationContext from './ReanimatedSheetTranslationContext';

const SPRING_CONFIG: WithSpringConfig = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};

const AnimatedScreen = Animated.createAnimatedComponent(
  InnerScreen as unknown as React.ComponentClass,
);

// We use prop added to global by reanimated since it seems safer than the one from RN. See:
// https://github.com/software-mansion/react-native-reanimated/blob/3fe8b35b05e82b2f2aefda1fb97799cf81e4b7bb/src/reanimated2/UpdateProps.ts#L46
// @ts-expect-error nativeFabricUIManager is not yet included in the RN types
const ENABLE_FABRIC = !!global?.RN$Bridgeless;

const ReanimatedNativeStackScreen = React.forwardRef<
  typeof AnimatedScreen,
  ScreenProps
>((props, ref) => {
  const { children, ...rest } = props;
  const { stackPresentation = 'push', hasLargeHeader } = rest;

  const dimensions = useSafeAreaFrame();
  const topInset = useSafeAreaInsets().top;
  const isStatusBarTranslucent = rest.statusBarTranslucent ?? false;
  const statusBarHeight = getStatusBarHeight(
    topInset,
    dimensions,
    isStatusBarTranslucent,
  );

  // Default header height, normally used in `useHeaderHeight` hook.
  // Here, it is used for returning a default value for shared value.
  const defaultHeaderHeight = getDefaultHeaderHeight(
    dimensions,
    statusBarHeight,
    stackPresentation,
    hasLargeHeader,
  );

  const cachedHeaderHeight = React.useRef(defaultHeaderHeight);
  const headerHeight = useSharedValue(defaultHeaderHeight);

  const progress = useSharedValue(0);
  const closing = useSharedValue(0);
  const goingForward = useSharedValue(0);

  const translationY = useSharedValue(dimensions.height);

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
            : // for some reason there is a difference in required event name between architectures
            ENABLE_FABRIC
            ? 'onTransitionProgress'
            : 'topTransitionProgress',
        ],
      )}
      onSheetTranslationReanimated={useEvent(
        (event: SheetTranslationEventType) => {
          'worklet';
          if (event.transitioning) {
            translationY.value =
              Platform.OS === 'android'
                ? withTiming(event.y, { duration: 300 })
                : withSpring(event.y, SPRING_CONFIG);
          } else {
            translationY.value = event.y;
          }
        },
        [
          // @ts-ignore wrong type
          Platform.OS === 'android'
            ? 'onSheetTranslation'
            : ENABLE_FABRIC
            ? 'onSheetTranslation'
            : 'topSheetTranslation',
        ],
      )}
      onHeaderHeightChangeReanimated={useEvent(
        (event: HeaderHeightChangeEventType) => {
          'worklet';
          if (event.headerHeight !== cachedHeaderHeight.current) {
            headerHeight.value = event.headerHeight;
            cachedHeaderHeight.current = event.headerHeight;
          }
        },
        [
          // @ts-ignore wrong type
          Platform.OS === 'android'
            ? 'onHeaderHeightChange'
            : ENABLE_FABRIC
            ? 'onHeaderHeightChange'
            : 'topHeaderHeightChange',
        ],
      )}
      {...rest}>
      <ReanimatedSheetTranslationContext.Provider value={translationY}>
        <ReanimatedHeaderHeightContext.Provider value={headerHeight}>
          <ReanimatedTransitionProgressContext.Provider
            value={{
              progress,
              closing,
              goingForward,
            }}>
            {children}
          </ReanimatedTransitionProgressContext.Provider>
        </ReanimatedHeaderHeightContext.Provider>
      </ReanimatedSheetTranslationContext.Provider>
    </AnimatedScreen>
  );
});

ReanimatedNativeStackScreen.displayName = 'ReanimatedNativeStackScreen';

export default ReanimatedNativeStackScreen;
