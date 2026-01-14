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
import {
  SHEET_DIMMED_ALWAYS,
  resolveSheetAllowedDetents,
  resolveSheetInitialDetentIndex,
  resolveSheetLargestUndimmedDetent,
} from './helpers/sheet';
import { parseBooleanToOptionalBooleanNativeProp } from '../utils';
import featureFlags from '../flags';

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
        display: boolean | null;
      };
    };
  };
  _viewConfig: {
    validAttributes: {
      style: {
        display: boolean | null;
      };
    };
  };
  __viewConfig: {
    validAttributes: {
      style: {
        display: boolean | null;
      };
    };
  };
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
      shouldFreeze,
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
      sheetShouldOverflowTopInset = false,
      // Other
      screenId,
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

      // Due to how Yoga resolves layout, we need to have different components for modal nad non-modal screens (there is a need for different
      // shadow nodes).
      const shouldUseModalScreenComponent = Platform.select({
        ios: !(
          stackPresentation === undefined ||
          stackPresentation === 'push' ||
          stackPresentation === 'containedModal' ||
          stackPresentation === 'containedTransparentModal'
        ),
        android: false,
        default: false,
      });

      const AnimatedScreen = shouldUseModalScreenComponent
        ? AnimatedNativeModalScreen
        : AnimatedNativeScreen;

      let {
        // Filter out active prop in this case because it is unused and
        // can cause problems depending on react-native version:
        // https://github.com/react-navigation/react-navigation/issues/4886
        active,
        activityState,
        children,
        isNativeStack,
        fullScreenSwipeEnabled,
        gestureResponseDistance,
        scrollEdgeEffects,
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
        // Workaround is necessary to prevent React Native from hiding frozen screens.
        // See this PR: https://github.com/grahammendick/navigation/pull/860
        if (ref?.viewConfig?.validAttributes?.style) {
          ref.viewConfig.validAttributes.style = {
            ...ref.viewConfig.validAttributes.style,
            display: null,
          };
        } else if (ref?._viewConfig?.validAttributes?.style) {
          ref._viewConfig.validAttributes.style = {
            ...ref._viewConfig.validAttributes.style,
            display: null,
          };
        } else if (ref?.__viewConfig?.validAttributes?.style) {
          ref.__viewConfig.validAttributes.style = {
            ...ref.__viewConfig.validAttributes.style,
            display: null,
          };
        }
        setRef(ref);
      };

      const freeze =
        freezeOnBlur &&
        (shouldFreeze !== undefined ? shouldFreeze : activityState === 0);

      return (
        <DelayedFreeze freeze={freeze}>
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
            screenId={screenId}
            sheetAllowedDetents={resolvedSheetAllowedDetents}
            sheetLargestUndimmedDetent={resolvedSheetLargestUndimmedDetent}
            sheetElevation={sheetElevation}
            sheetShouldOverflowTopInset={sheetShouldOverflowTopInset}
            sheetGrabberVisible={sheetGrabberVisible}
            sheetCornerRadius={sheetCornerRadius}
            sheetExpandsWhenScrolledToEdge={sheetExpandsWhenScrolledToEdge}
            sheetInitialDetent={resolvedSheetInitialDetentIndex}
            fullScreenSwipeEnabled={parseBooleanToOptionalBooleanNativeProp(
              fullScreenSwipeEnabled,
            )}
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
            bottomScrollEdgeEffect={scrollEdgeEffects?.bottom}
            leftScrollEdgeEffect={scrollEdgeEffects?.left}
            rightScrollEdgeEffect={scrollEdgeEffects?.right}
            topScrollEdgeEffect={scrollEdgeEffects?.top}
            synchronousShadowStateUpdatesEnabled={
              featureFlags.experiment.synchronousScreenUpdatesEnabled
            }
            androidResetScreenShadowStateOnOrientationChangeEnabled={
              featureFlags.experiment
                .androidResetScreenShadowStateOnOrientationChangeEnabled
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
