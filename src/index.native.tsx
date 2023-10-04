/* eslint-disable @typescript-eslint/no-var-requires */
import React, { PropsWithChildren, ReactNode } from 'react';
import {
  Animated,
  Image,
  ImageProps,
  Platform,
  StyleProp,
  StyleSheet,
  UIManager,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Freeze } from 'react-freeze';
import { version } from 'react-native/package.json';

import TransitionProgressContext from './TransitionProgressContext';
import useTransitionProgress from './useTransitionProgress';
import {
  StackPresentationTypes,
  StackAnimationTypes,
  BlurEffectTypes,
  ScreenReplaceTypes,
  ScreenOrientationTypes,
  HeaderSubviewTypes,
  ScreenProps,
  ScreenContainerProps,
  ScreenStackProps,
  ScreenStackHeaderConfigProps,
  SearchBarProps,
  SearchBarCommands,
} from './types';
import {
  isSearchBarAvailableForCurrentPlatform,
  isNewBackTitleImplementation,
  executeNativeBackPress,
} from './utils';

// web implementation is taken from `index.tsx`
const isPlatformSupported =
  Platform.OS === 'ios' ||
  Platform.OS === 'android' ||
  Platform.OS === 'windows';

let ENABLE_SCREENS = isPlatformSupported;

function enableScreens(shouldEnableScreens = true): void {
  ENABLE_SCREENS = isPlatformSupported && shouldEnableScreens;
  if (ENABLE_SCREENS && !UIManager.getViewManagerConfig('RNSScreen')) {
    console.error(
      `Screen native module hasn't been linked. Please check the react-native-screens README for more details`
    );
  }
}

let ENABLE_FREEZE = false;

function enableFreeze(shouldEnableReactFreeze = true): void {
  const minor = parseInt(version.split('.')[1]); // eg. takes 66 from '0.66.0'

  // react-freeze requires react-native >=0.64, react-native from main is 0.0.0
  if (!(minor === 0 || minor >= 64) && shouldEnableReactFreeze) {
    console.warn(
      'react-freeze library requires at least react-native 0.64. Please upgrade your react-native version in order to use this feature.'
    );
  }

  ENABLE_FREEZE = shouldEnableReactFreeze;
}

// const that tells if the library should use new implementation, will be undefined for older versions
const shouldUseActivityState = true;

function screensEnabled(): boolean {
  return ENABLE_SCREENS;
}

type SearchBarCommandsType = {
  blur: (
    viewRef: React.ElementRef<typeof ScreensNativeModules.NativeSearchBar>
  ) => void;
  focus: (
    viewRef: React.ElementRef<typeof ScreensNativeModules.NativeSearchBar>
  ) => void;
  clearText: (
    viewRef: React.ElementRef<typeof ScreensNativeModules.NativeSearchBar>
  ) => void;
  toggleCancelButton: (
    viewRef: React.ElementRef<typeof ScreensNativeModules.NativeSearchBar>,
    flag: boolean
  ) => void;
  setText: (
    viewRef: React.ElementRef<typeof ScreensNativeModules.NativeSearchBar>,
    text: string
  ) => void;
};

// We initialize these lazily so that importing the module doesn't throw error when not linked
// This is necessary coz libraries such as React Navigation import the library where it may not be enabled
let NativeScreenValue: React.ComponentType<ScreenProps>;
let NativeScreenContainerValue: React.ComponentType<ScreenContainerProps>;
let NativeScreenNavigationContainerValue: React.ComponentType<ScreenContainerProps>;
let NativeScreenStack: React.ComponentType<ScreenStackProps>;
let NativeScreenStackHeaderConfig: React.ComponentType<ScreenStackHeaderConfigProps>;
let NativeScreenStackHeaderSubview: React.ComponentType<
  React.PropsWithChildren<ViewProps & { type?: HeaderSubviewTypes }>
>;
let AnimatedNativeScreen: React.ComponentType<ScreenProps>;

let NativeSearchBar: React.ComponentType<SearchBarProps> &
  typeof NativeSearchBarCommands;
let NativeSearchBarCommands: SearchBarCommandsType;

let NativeFullWindowOverlay: React.ComponentType<
  PropsWithChildren<{
    style: StyleProp<ViewStyle>;
  }>
>;

const ScreensNativeModules = {
  get NativeScreen() {
    NativeScreenValue =
      NativeScreenValue || require('./fabric/ScreenNativeComponent').default;
    return NativeScreenValue;
  },

  get NativeScreenContainer() {
    NativeScreenContainerValue =
      NativeScreenContainerValue ||
      require('./fabric/ScreenContainerNativeComponent').default;
    return NativeScreenContainerValue;
  },

  get NativeScreenNavigationContainer() {
    NativeScreenNavigationContainerValue =
      NativeScreenNavigationContainerValue ||
      (Platform.OS === 'ios'
        ? require('./fabric/ScreenNavigationContainerNativeComponent').default
        : this.NativeScreenContainer);
    return NativeScreenNavigationContainerValue;
  },

  get NativeScreenStack() {
    NativeScreenStack =
      NativeScreenStack ||
      require('./fabric/ScreenStackNativeComponent').default;
    return NativeScreenStack;
  },

  get NativeScreenStackHeaderConfig() {
    NativeScreenStackHeaderConfig =
      NativeScreenStackHeaderConfig ||
      require('./fabric/ScreenStackHeaderConfigNativeComponent').default;
    return NativeScreenStackHeaderConfig;
  },

  get NativeScreenStackHeaderSubview() {
    NativeScreenStackHeaderSubview =
      NativeScreenStackHeaderSubview ||
      require('./fabric/ScreenStackHeaderSubviewNativeComponent').default;
    return NativeScreenStackHeaderSubview;
  },

  get NativeSearchBar() {
    NativeSearchBar =
      NativeSearchBar || require('./fabric/SearchBarNativeComponent').default;
    return NativeSearchBar;
  },

  get NativeSearchBarCommands() {
    NativeSearchBarCommands =
      NativeSearchBarCommands ||
      require('./fabric/SearchBarNativeComponent').Commands;
    return NativeSearchBarCommands;
  },

  get NativeFullWindowOverlay() {
    NativeFullWindowOverlay =
      NativeFullWindowOverlay ||
      require('./fabric/FullWindowOverlayNativeComponent').default;
    return NativeFullWindowOverlay;
  },
};

interface FreezeWrapperProps {
  freeze: boolean;
  children: React.ReactNode;
}

// This component allows one more render before freezing the screen.
// Allows activityState to reach the native side and useIsFocused to work correctly.
function DelayedFreeze({ freeze, children }: FreezeWrapperProps) {
  // flag used for determining whether freeze should be enabled
  const [freezeState, setFreezeState] = React.useState(false);

  if (freeze !== freezeState) {
    // setImmediate is executed at the end of the JS execution block.
    // Used here for changing the state right after the render.
    setImmediate(() => {
      setFreezeState(freeze);
    });
  }

  return <Freeze freeze={freeze ? freezeState : false}>{children}</Freeze>;
}

function ScreenStack(props: ScreenStackProps) {
  const { children, ...rest } = props;
  const size = React.Children.count(children);
  // freezes all screens except the top one
  const childrenWithFreeze = React.Children.map(children, (child, index) => {
    // @ts-expect-error it's either SceneView in v6 or RouteView in v5
    const { props, key } = child;
    const descriptor = props?.descriptor ?? props?.descriptors?.[key];
    const freezeEnabled = descriptor?.options?.freezeOnBlur ?? ENABLE_FREEZE;

    return (
      <DelayedFreeze freeze={freezeEnabled && size - index > 1}>
        {child}
      </DelayedFreeze>
    );
  });

  return (
    <ScreensNativeModules.NativeScreenStack {...rest}>
      {childrenWithFreeze}
    </ScreensNativeModules.NativeScreenStack>
  );
}

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
}

class InnerScreen extends React.Component<ScreenProps> {
  private ref: React.ElementRef<typeof View> | null = null;
  private closing = new Animated.Value(0);
  private progress = new Animated.Value(0);
  private goingForward = new Animated.Value(0);

  setNativeProps(props: ScreenProps): void {
    this.ref?.setNativeProps(props);
  }

  setRef = (ref: React.ElementRef<typeof View> | null): void => {
    this.ref = ref;
    this.props.onComponentRef?.(ref);
  };

  render() {
    const {
      enabled = ENABLE_SCREENS,
      freezeOnBlur = ENABLE_FREEZE,
      ...rest
    } = this.props;

    // To maintain default behaviour of formSheet stack presentation style & and to have resonable
    // defaults for new medium-detent iOS API we need to set defaults here
    const {
      sheetAllowedDetents = 'large',
      sheetLargestUndimmedDetent = 'all',
      sheetGrabberVisible = false,
      sheetCornerRadius = -1.0,
      sheetExpandsWhenScrolledToEdge = true,
    } = rest;

    if (enabled && isPlatformSupported) {
      AnimatedNativeScreen =
        AnimatedNativeScreen ||
        Animated.createAnimatedComponent(ScreensNativeModules.NativeScreen);

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
        ...props
      } = rest;

      if (active !== undefined && activityState === undefined) {
        console.warn(
          'It appears that you are using old version of react-navigation library. Please update @react-navigation/bottom-tabs, @react-navigation/stack and @react-navigation/drawer to version 5.10.0 or above to take full advantage of new functionality added to react-native-screens'
        );
        activityState = active !== 0 ? 2 : 0; // in the new version, we need one of the screens to have value of 2 after the transition
      }

      const handleRef = (ref: ViewConfig) => {
        if (ref?.viewConfig?.validAttributes?.style) {
          ref.viewConfig.validAttributes.style = {
            ...ref.viewConfig.validAttributes.style,
            display: false,
          };
          this.setRef(ref);
        }
      };

      return (
        <DelayedFreeze freeze={freezeOnBlur && activityState === 0}>
          <AnimatedNativeScreen
            {...props}
            activityState={activityState}
            sheetAllowedDetents={sheetAllowedDetents}
            sheetLargestUndimmedDetent={sheetLargestUndimmedDetent}
            sheetGrabberVisible={sheetGrabberVisible}
            sheetCornerRadius={sheetCornerRadius}
            sheetExpandsWhenScrolledToEdge={sheetExpandsWhenScrolledToEdge}
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
                          progress: this.progress,
                          closing: this.closing,
                          goingForward: this.goingForward,
                        },
                      },
                    ],
                    { useNativeDriver: true }
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
                  progress: this.progress,
                  closing: this.closing,
                  goingForward: this.goingForward,
                }}>
                {children}
              </TransitionProgressContext.Provider>
            )}
          </AnimatedNativeScreen>
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
          ref={this.setRef}
          {...props}
        />
      );
    }
  }
}

function ScreenContainer(props: ScreenContainerProps) {
  const { enabled = ENABLE_SCREENS, hasTwoStates, ...rest } = props;

  if (enabled && isPlatformSupported) {
    if (hasTwoStates) {
      return <ScreensNativeModules.NativeScreenNavigationContainer {...rest} />;
    }
    return <ScreensNativeModules.NativeScreenContainer {...rest} />;
  }
  return <View {...rest} />;
}

function FullWindowOverlay(props: { children: ReactNode }) {
  if (Platform.OS !== 'ios') {
    console.warn('Importing FullWindowOverlay is only valid on iOS devices.');
    return <View {...props} />;
  }
  return (
    <ScreensNativeModules.NativeFullWindowOverlay
      style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {props.children}
    </ScreensNativeModules.NativeFullWindowOverlay>
  );
}

const styles = StyleSheet.create({
  headerSubview: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ScreenStackHeaderBackButtonImage = (props: ImageProps): JSX.Element => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    type="back"
    style={styles.headerSubview}>
    <Image resizeMode="center" fadeDuration={0} {...props} />
  </ScreensNativeModules.NativeScreenStackHeaderSubview>
);

class SearchBar extends React.Component<SearchBarProps> {
  nativeSearchBarRef: React.RefObject<SearchBarCommands>;

  constructor(props: SearchBarProps) {
    super(props);
    this.nativeSearchBarRef = React.createRef();
  }

  _callMethodWithRef(method: (ref: SearchBarCommands) => void) {
    const ref = this.nativeSearchBarRef.current;
    if (ref) {
      method(ref);
    } else {
      console.warn(
        'Reference to native search bar component has not been updated yet'
      );
    }
  }

  blur() {
    this._callMethodWithRef(ref =>
      ScreensNativeModules.NativeSearchBarCommands.blur(ref)
    );
  }

  focus() {
    this._callMethodWithRef(ref =>
      ScreensNativeModules.NativeSearchBarCommands.focus(ref)
    );
  }

  toggleCancelButton(flag: boolean) {
    this._callMethodWithRef(ref =>
      ScreensNativeModules.NativeSearchBarCommands.toggleCancelButton(ref, flag)
    );
  }

  clearText() {
    this._callMethodWithRef(ref =>
      ScreensNativeModules.NativeSearchBarCommands.clearText(ref)
    );
  }

  setText(text: string) {
    this._callMethodWithRef(ref =>
      ScreensNativeModules.NativeSearchBarCommands.setText(ref, text)
    );
  }

  render() {
    if (!isSearchBarAvailableForCurrentPlatform) {
      console.warn(
        'Importing SearchBar is only valid on iOS and Android devices.'
      );
      return View as any as ReactNode;
    }

    return (
      <ScreensNativeModules.NativeSearchBar
        {...this.props}
        ref={this.nativeSearchBarRef}
      />
    );
  }
}

const ScreenStackHeaderRightView = (
  props: React.PropsWithChildren<ViewProps>
): JSX.Element => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    {...props}
    type="right"
    style={styles.headerSubview}
  />
);

const ScreenStackHeaderLeftView = (
  props: React.PropsWithChildren<ViewProps>
): JSX.Element => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    {...props}
    type="left"
    style={styles.headerSubview}
  />
);

const ScreenStackHeaderCenterView = (
  props: React.PropsWithChildren<ViewProps>
): JSX.Element => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    {...props}
    type="center"
    style={styles.headerSubview}
  />
);

const ScreenStackHeaderSearchBarView = (
  props: React.PropsWithChildren<SearchBarProps>
): JSX.Element => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    {...props}
    type="searchBar"
    style={styles.headerSubview}
  />
);

export type {
  StackPresentationTypes,
  StackAnimationTypes,
  BlurEffectTypes,
  ScreenReplaceTypes,
  ScreenOrientationTypes,
  HeaderSubviewTypes,
  ScreenProps,
  ScreenContainerProps,
  ScreenStackProps,
  ScreenStackHeaderConfigProps,
  SearchBarProps,
};

// context to be used when the user wants to use enhanced implementation
// e.g. to use `useReanimatedTransitionProgress` (see `reanimated` folder in repo)
const ScreenContext = React.createContext(InnerScreen);

class Screen extends React.Component<ScreenProps> {
  static contextType = ScreenContext;

  render() {
    const ScreenWrapper = (this.context || InnerScreen) as React.ElementType;
    return <ScreenWrapper {...this.props} />;
  }
}

module.exports = {
  // these are classes so they are not evaluated until used
  // so no need to use getters for them
  Screen,
  ScreenContainer,
  ScreenContext,
  ScreenStack,
  InnerScreen,
  SearchBar,
  FullWindowOverlay,

  get NativeScreen() {
    return ScreensNativeModules.NativeScreen;
  },

  get NativeScreenContainer() {
    return ScreensNativeModules.NativeScreenContainer;
  },

  get NativeScreenNavigationContainer() {
    return ScreensNativeModules.NativeScreenNavigationContainer;
  },

  get ScreenStackHeaderConfig() {
    return ScreensNativeModules.NativeScreenStackHeaderConfig;
  },
  get ScreenStackHeaderSubview() {
    return ScreensNativeModules.NativeScreenStackHeaderSubview;
  },
  get SearchBarCommands() {
    return ScreensNativeModules.NativeSearchBarCommands;
  },
  // these are functions and will not be evaluated until used
  // so no need to use getters for them
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderRightView,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderSearchBarView,

  enableScreens,
  enableFreeze,
  screensEnabled,
  shouldUseActivityState,
  useTransitionProgress,

  isSearchBarAvailableForCurrentPlatform,
  isNewBackTitleImplementation,
  executeNativeBackPress,
};
