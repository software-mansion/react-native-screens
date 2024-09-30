'use client';

import React from 'react';
import { Animated, View, Platform } from 'react-native';

import TransitionProgressContext from '../TransitionProgressContext';
import DelayedFreeze from './helpers/DelayedFreeze';
import { ScreenProps } from 'react-native-screens';

import {
  freezeEnabled,
  isNativePlatformSupported,
  screensEnabled,
} from '../core';

// Native components
import ScreenNativeComponent from '../fabric/ScreenNativeComponent';
import ModalScreenNativeComponent from '../fabric/ModalScreenNativeComponent';

export const NativeScreen: React.ComponentType<ScreenProps> =
  ScreenNativeComponent as React.ComponentType<ScreenProps>;
const AnimatedNativeScreen = Animated.createAnimatedComponent(NativeScreen);
const AnimatedNativeModalScreen = Animated.createAnimatedComponent(
  ModalScreenNativeComponent as React.ComponentType<ScreenProps>,
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

// These exist to transform old 'legacy' values used by the formsheet API to the new API shape.
// We can get rid of it, once we get rid of support for legacy values: 'large', 'medium', 'all'.
function resolveSheetAllowedDetents(
  allowedDetentsCompat: ScreenProps['sheetAllowedDetents'],
): number[] {
  if (Array.isArray(allowedDetentsCompat)) {
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
  lud: ScreenProps['sheetLargestUndimmedDetent'],
): number {
  if (typeof lud === 'number') {
    return lud;
  } else if (lud === 'large') {
    return 1;
  } else if (lud === 'medium') {
    return 0;
  } else if (lud === 'all') {
    return -1;
  } else {
    // Safe default, every detent is dimmed
    return -1;
  }
}

export const InnerScreen = React.forwardRef<View, ScreenProps>(
  function InnerScreen(props, ref) {
    const innerRef = React.useRef<ViewConfig | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current!, []);

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
      sheetLargestUndimmedDetent = -1,
      sheetGrabberVisible = false,
      sheetCornerRadius = -1.0,
      sheetExpandsWhenScrolledToEdge = true,
      sheetElevation = 24,
      sheetInitialDetent = 0,

      // Other
      stackPresentation,
    } = rest;

    if (enabled && isNativePlatformSupported) {
      const resolvedSheetAllowedDetents =
        resolveSheetAllowedDetents(sheetAllowedDetents);
      const resolvedSheetLargestUndimmedDetent =
        resolveSheetLargestUndimmedDetent(sheetLargestUndimmedDetent);
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
            sheetInitialDetent={sheetInitialDetent}
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
            }
            onGestureCancel={
              onGestureCancel ??
              (() => {
                // for internal use
              })
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

const Screen: React.FC<ScreenProps> = props => {
  const ScreenWrapper = React.useContext(ScreenContext) || InnerScreen;

  return <ScreenWrapper {...props} />;
};

export default Screen;
