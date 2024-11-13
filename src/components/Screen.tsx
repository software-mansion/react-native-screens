'use client';

import React from 'react';
import { Animated, View, Platform } from 'react-native';

import TransitionProgressContext from '../TransitionProgressContext';
import DelayedFreeze from './helpers/DelayedFreeze';
import { ScreenProps } from '../types';

import {
  freezeEnabled,
  isNativePlatformSupported,
  screensEnabled,
} from '../core';

// Native components
import ScreenNativeComponent, {
  NativeProps as ScreenNativeComponentProps,
} from '../fabric/ScreenNativeComponent';
import ModalScreenNativeComponent, {
  NativeProps as ModalScreenNativeComponentProps,
} from '../fabric/ModalScreenNativeComponent';
import { usePrevious } from './helpers/usePrevious';

type NativeProps = ScreenNativeComponentProps | ModalScreenNativeComponentProps;
const AnimatedNativeScreen = Animated.createAnimatedComponent(
  ScreenNativeComponent,
);
const AnimatedNativeModalScreen = Animated.createAnimatedComponent(
  ModalScreenNativeComponent,
);

// Incomplete type, all accessible properties available at:
// react-native/Libraries/Components/View/ReactNativeViewViewConfig.js
interface ViewConfig extends View {
  viewConfig: {
    validAttributes: {
      style: {
        display: boolean;
      };
    };
  };
  _viewConfig: {
    validAttributes: {
      style: {
        display: boolean;
      };
    };
  };
}

// This value must be kept in sync with native side.
const SHEET_FIT_TO_CONTENTS = [-1];
const SHEET_COMPAT_LARGE = [1.0];
const SHEET_COMPAT_MEDIUM = [0.5];
const SHEET_COMPAT_ALL = [0.5, 1.0];

const SHEET_DIMMED_ALWAYS = -1;
// const SHEET_DIMMED_NEVER = 9999;

function assertDetentsArrayIsSorted(array: number[]) {
  for (let i = 1; i < array.length; i++) {
    if (array[i - 1] > array[i]) {
      throw new Error(
        '[RNScreens] The detent array is not sorted in ascending order!',
      );
    }
  }
}

// These exist to transform old 'legacy' values used by the formsheet API to the new API shape.
// We can get rid of it, once we get rid of support for legacy values: 'large', 'medium', 'all'.
function resolveSheetAllowedDetents(
  allowedDetentsCompat: ScreenProps['sheetAllowedDetents'],
): number[] {
  if (Array.isArray(allowedDetentsCompat)) {
    if (Platform.OS === 'android' && allowedDetentsCompat.length > 3) {
      if (__DEV__) {
        console.warn(
          '[RNScreens] Sheets API on Android do accept only up to 3 values. Any surplus value are ignored.',
        );
      }
      allowedDetentsCompat = allowedDetentsCompat.slice(0, 3);
    }
    if (__DEV__) {
      assertDetentsArrayIsSorted(allowedDetentsCompat);
    }
    return allowedDetentsCompat;
  } else if (allowedDetentsCompat === 'fitToContents') {
    return SHEET_FIT_TO_CONTENTS;
  } else if (allowedDetentsCompat === 'large') {
    return SHEET_COMPAT_LARGE;
  } else if (allowedDetentsCompat === 'medium') {
    return SHEET_COMPAT_MEDIUM;
  } else if (allowedDetentsCompat === 'all') {
    return SHEET_COMPAT_ALL;
  } else {
    // Safe default, only large detent is allowed.
    return [1.0];
  }
}

function resolveSheetLargestUndimmedDetent(
  lud: ScreenProps['sheetLargestUndimmedDetentIndex'],
  lastDetentIndex: number,
): number {
  if (typeof lud === 'number') {
    if (!isIndexInClosedRange(lud, SHEET_DIMMED_ALWAYS, lastDetentIndex)) {
      if (__DEV__) {
        throw new Error(
          "[RNScreens] Provided value of 'sheetLargestUndimmedDetentIndex' prop is out of bounds of 'sheetAllowedDetents' array.",
        );
      }
      // Return default in production
      return SHEET_DIMMED_ALWAYS;
    }
    return lud;
  } else if (lud === 'last') {
    return lastDetentIndex;
  } else if (lud === 'none' || lud === 'all') {
    return SHEET_DIMMED_ALWAYS;
  } else if (lud === 'large') {
    return 1;
  } else if (lud === 'medium') {
    return 0;
  } else {
    // Safe default, every detent is dimmed
    return SHEET_DIMMED_ALWAYS;
  }
}

function resolveSheetInitialDetentIndex(
  index: ScreenProps['sheetInitialDetentIndex'],
  lastDetentIndex: number,
): number {
  if (index === 'last') {
    index = lastDetentIndex;
  } else if (index == null) {
    // Intentional check for undefined & null ^
    index = 0;
  }
  if (!isIndexInClosedRange(index, 0, lastDetentIndex)) {
    if (__DEV__) {
      throw new Error(
        "[RNScreens] Provided value of 'sheetInitialDetentIndex' prop is out of bounds of 'sheetAllowedDetents' array.",
      );
    }
    // Return default in production
    return 0;
  }
  return index;
}

function isIndexInClosedRange(
  value: number,
  lowerBound: number,
  upperBound: number,
): boolean {
  return Number.isInteger(value) && value >= lowerBound && value <= upperBound;
}

export const InnerScreen = React.forwardRef<View, ScreenProps>(
  function InnerScreen(props, ref) {
    const innerRef = React.useRef<ViewConfig | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current!, []);
    const prevActivityState = usePrevious(props.activityState);

    const setRef = (ref: ViewConfig) => {
      innerRef.current = ref;
      props.onComponentRef?.(ref);
    };

    const closing = React.useRef(new Animated.Value(0)).current;
    const progress = React.useRef(new Animated.Value(0)).current;
    const goingForward = React.useRef(new Animated.Value(0)).current;

    const {
      enabled = screensEnabled(),
      freezeOnBlur = freezeEnabled(),
      ...rest
    } = props;

    // To maintain default behavior of formSheet stack presentation style and to have reasonable
    // defaults for new medium-detent iOS API we need to set defaults here
    const {
      // formSheet presentation related props
      sheetAllowedDetents = [1.0],
      sheetLargestUndimmedDetentIndex = SHEET_DIMMED_ALWAYS,
      sheetGrabberVisible = false,
      sheetCornerRadius = -1.0,
      sheetExpandsWhenScrolledToEdge = true,
      sheetElevation = 24,
      sheetInitialDetentIndex = 0,
      // Other
      stackPresentation,
      // Events for override
      onAppear,
      onDisappear,
      onWillAppear,
      onWillDisappear,
    } = rest;

    if (enabled && isNativePlatformSupported) {
      const resolvedSheetAllowedDetents =
        resolveSheetAllowedDetents(sheetAllowedDetents);
      const resolvedSheetLargestUndimmedDetent =
        resolveSheetLargestUndimmedDetent(
          sheetLargestUndimmedDetentIndex,
          resolvedSheetAllowedDetents.length - 1,
        );
      const resolvedSheetInitialDetentIndex = resolveSheetInitialDetentIndex(
        sheetInitialDetentIndex,
        resolvedSheetAllowedDetents.length - 1,
      );
      // Due to how Yoga resolves layout, we need to have different components for modal nad non-modal screens
      const AnimatedScreen =
        Platform.OS === 'android' ||
        stackPresentation === undefined ||
        stackPresentation === 'push' ||
        stackPresentation === 'containedModal' ||
        stackPresentation === 'containedTransparentModal'
          ? AnimatedNativeScreen
          : AnimatedNativeModalScreen;

      let {
        // Filter out active prop in this case because it is unused and
        // can cause problems depending on react-native version:
        // https://github.com/react-navigation/react-navigation/issues/4886
        active,
        activityState,
        children,
        isNativeStack,
        gestureResponseDistance,
        onGestureCancel,
        style,
        ...props
      } = rest;

      if (active !== undefined && activityState === undefined) {
        console.warn(
          'It appears that you are using old version of react-navigation library. Please update @react-navigation/bottom-tabs, @react-navigation/stack and @react-navigation/drawer to version 5.10.0 or above to take full advantage of new functionality added to react-native-screens',
        );
        activityState = active !== 0 ? 2 : 0; // in the new version, we need one of the screens to have value of 2 after the transition
      }

      if (
        isNativeStack &&
        prevActivityState !== undefined &&
        activityState !== undefined
      ) {
        if (prevActivityState > activityState) {
          throw new Error(
            '[RNScreens] activityState cannot be decreased in NativeStack',
          );
        }
      }

      const handleRef = (ref: ViewConfig) => {
        if (ref?.viewConfig?.validAttributes?.style) {
          ref.viewConfig.validAttributes.style = {
            ...ref.viewConfig.validAttributes.style,
            display: false,
          };
          setRef(ref);
        } else if (ref?._viewConfig?.validAttributes?.style) {
          ref._viewConfig.validAttributes.style = {
            ...ref._viewConfig.validAttributes.style,
            display: false,
          };
          setRef(ref);
        }
      };

      return (
        <DelayedFreeze freeze={freezeOnBlur && activityState === 0}>
          <AnimatedScreen
            {...props}
            /**
             * This messy override is to conform NativeProps used by codegen and
             * our Public API. To see reasoning go to this PR:
             * https://github.com/software-mansion/react-native-screens/pull/2423#discussion_r1810616995
             */
            onAppear={onAppear as NativeProps['onAppear']}
            onDisappear={onDisappear as NativeProps['onDisappear']}
            onWillAppear={onWillAppear as NativeProps['onWillAppear']}
            onWillDisappear={onWillDisappear as NativeProps['onWillDisappear']}
            onGestureCancel={
              (onGestureCancel as NativeProps['onGestureCancel']) ??
              (() => {
                // for internal use
              })
            }
            //
            // Hierarchy of screens is handled on the native side and setting zIndex value causes this issue:
            // https://github.com/software-mansion/react-native-screens/issues/2345
            // With below change of zIndex, we force RN diffing mechanism to NOT include detaching and attaching mutation in one transaction.
            // Detailed information can be found here https://github.com/software-mansion/react-native-screens/pull/2351
            style={[style, { zIndex: undefined }]}
            activityState={activityState}
            sheetAllowedDetents={resolvedSheetAllowedDetents}
            sheetLargestUndimmedDetent={resolvedSheetLargestUndimmedDetent}
            sheetElevation={sheetElevation}
            sheetGrabberVisible={sheetGrabberVisible}
            sheetCornerRadius={sheetCornerRadius}
            sheetExpandsWhenScrolledToEdge={sheetExpandsWhenScrolledToEdge}
            sheetInitialDetent={resolvedSheetInitialDetentIndex}
            gestureResponseDistance={{
              start: gestureResponseDistance?.start ?? -1,
              end: gestureResponseDistance?.end ?? -1,
              top: gestureResponseDistance?.top ?? -1,
              bottom: gestureResponseDistance?.bottom ?? -1,
            }}
            // This prevents showing blank screen when navigating between multiple screens with freezing
            // https://github.com/software-mansion/react-native-screens/pull/1208
            ref={handleRef}
            onTransitionProgress={
              !isNativeStack
                ? undefined
                : Animated.event(
                    [
                      {
                        nativeEvent: {
                          progress,
                          closing,
                          goingForward,
                        },
                      },
                    ],
                    { useNativeDriver: true },
                  )
            }>
            {!isNativeStack ? ( // see comment of this prop in types.tsx for information why it is needed
              children
            ) : (
              <TransitionProgressContext.Provider
                value={{
                  progress,
                  closing,
                  goingForward,
                }}>
                {children}
              </TransitionProgressContext.Provider>
            )}
          </AnimatedScreen>
        </DelayedFreeze>
      );
    } else {
      // same reason as above
      let {
        active,
        activityState,
        style,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onComponentRef,
        ...props
      } = rest;

      if (active !== undefined && activityState === undefined) {
        activityState = active !== 0 ? 2 : 0;
      }
      return (
        <Animated.View
          style={[style, { display: activityState !== 0 ? 'flex' : 'none' }]}
          ref={setRef}
          {...props}
        />
      );
    }
  },
);

// context to be used when the user wants to use enhanced implementation
// e.g. to use `useReanimatedTransitionProgress` (see `reanimated` folder in repo)
export const ScreenContext = React.createContext(InnerScreen);

const Screen = React.forwardRef<View, ScreenProps>((props, ref) => {
  const ScreenWrapper = React.useContext(ScreenContext) || InnerScreen;

  return <ScreenWrapper {...props} ref={ref} />;
});

Screen.displayName = 'Screen';

export default Screen;
