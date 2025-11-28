import React from 'react';
import { Platform } from 'react-native';
import { InnerScreen } from '../components/Screen';
import {
  HeaderHeightChangeEventType,
  ScreenProps,
  StackPresentationTypes,
  TransitionProgressEventType,
} from '../types';

// @ts-ignore file to be used only if `react-native-reanimated` available in the project
import Animated, { useEvent, useSharedValue } from 'react-native-reanimated';
import ReanimatedTransitionProgressContext from './ReanimatedTransitionProgressContext';
import {
  Rect,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ReanimatedHeaderHeightContext from './ReanimatedHeaderHeightContext';

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
    </AnimatedScreen>
  );
});

const formSheetModalHeight = 56;

function getDefaultHeaderHeight(
  layout: { width: number; height: number },
  statusBarHeight: number,
  stackPresentation: StackPresentationTypes,
  isLargeHeader = false,
): number {
  // default header heights
  let headerHeight = Platform.OS === 'android' ? 56 : 64;

  if (Platform.OS === 'ios') {
    const isLandscape = layout.width > layout.height;
    const isFormSheetModal =
      stackPresentation === 'modal' ||
      stackPresentation === 'formSheet' ||
      stackPresentation === 'pageSheet';
    if (isFormSheetModal && !isLandscape) {
      // `modal`, `formSheet` and `pageSheet` presentations do not take whole screen, so should not take the inset.
      statusBarHeight = 0;
    }

    if (Platform.isPad || Platform.isTV) {
      headerHeight = isFormSheetModal ? formSheetModalHeight : 50;
    } else {
      if (isLandscape) {
        headerHeight = 32;
      } else {
        if (isFormSheetModal) {
          headerHeight = formSheetModalHeight;
        } else {
          headerHeight = isLargeHeader ? 96 : 44;
        }
      }
    }
  }

  return headerHeight + statusBarHeight;
}

function getStatusBarHeight(
  topInset: number,
  dimensions: Rect,
  isStatusBarTranslucent: boolean,
) {
  if (Platform.OS === 'ios') {
    // It looks like some iOS devices don't have strictly set status bar height to 44.
    // Thus, if the top inset is higher than 50, then the device should have a dynamic island.
    // On models with Dynamic Island the status bar height is smaller than the safe area top inset by 5 pixels.
    // See https://developer.apple.com/forums/thread/662466 for more details about status bar height.
    const hasDynamicIsland = topInset > 50;
    return hasDynamicIsland ? topInset - 5 : topInset;
  } else if (Platform.OS === 'android') {
    // On Android we should also rely on frame's y-axis position, as topInset is 0 on visible status bar.
    return isStatusBarTranslucent ? topInset : dimensions.y;
  }

  return topInset;
}

ReanimatedNativeStackScreen.displayName = 'ReanimatedNativeStackScreen';

export default ReanimatedNativeStackScreen;
