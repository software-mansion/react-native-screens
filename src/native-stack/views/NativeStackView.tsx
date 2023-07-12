import * as React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
// @ts-ignore Getting private component
// eslint-disable-next-line import/no-named-as-default, import/default, import/no-named-as-default-member, import/namespace
import AppContainer from 'react-native/Libraries/ReactNative/AppContainer';
import warnOnce from 'warn-once';
import {
  ScreenStack,
  StackPresentationTypes,
  ScreenContext,
} from 'react-native-screens';
import {
  ParamListBase,
  StackActions,
  StackNavigationState,
  useTheme,
  Route,
  NavigationState,
  PartialState,
} from '@react-navigation/native';

import {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
  NativeStackNavigationOptions,
} from '../types';
import HeaderConfig from './HeaderConfig';
import SafeAreaProviderCompat from '../utils/SafeAreaProviderCompat';
import HeaderHeightContext, {
  HeaderHeightContextProps,
} from '../utils/HeaderHeightContext';
import { useState } from 'react';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import getDefaultHeaderHeight from '../utils/getDefaultHeaderHeight';

const isAndroid = Platform.OS === 'android';

let Container = View;

if (__DEV__) {
  const DebugContainer = (
    props: ViewProps & { stackPresentation: StackPresentationTypes }
  ) => {
    const { stackPresentation, ...rest } = props;
    if (Platform.OS === 'ios' && stackPresentation !== 'push') {
      return (
        <AppContainer>
          <View {...rest} />
        </AppContainer>
      );
    }
    return <View {...rest} />;
  };
  // @ts-ignore Wrong props
  Container = DebugContainer;
}

const MaybeNestedStack = ({
  options,
  route,
  stackPresentation,
  headerHeight,
  children,
}: {
  options: NativeStackNavigationOptions;
  route: Route<string>;
  stackPresentation: StackPresentationTypes;
  headerHeight: HeaderHeightContextProps;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();
  const { headerShown = true, contentStyle } = options;

  const Screen = React.useContext(ScreenContext);

  const isHeaderInModal = isAndroid
    ? false
    : stackPresentation !== 'push' && headerShown;

  const headerShownPreviousRef = React.useRef(headerShown);

  React.useEffect(() => {
    warnOnce(
      !isAndroid &&
        stackPresentation !== 'push' &&
        headerShownPreviousRef.current !== headerShown,
      `Dynamically changing 'headerShown' in modals will result in remounting the screen and losing all local state. See options for the screen '${route.name}'.`
    );

    headerShownPreviousRef.current = headerShown;
  }, [headerShown, stackPresentation, route.name]);

  const content = (
    <Container
      style={[
        styles.container,
        stackPresentation !== 'transparentModal' &&
          stackPresentation !== 'containedTransparentModal' && {
            backgroundColor: colors.background,
          },
        contentStyle,
      ]}
      // @ts-ignore Wrong props passed to View
      stackPresentation={stackPresentation}
    >
      {children}
    </Container>
  );

  if (isHeaderInModal) {
    return (
      <ScreenStack style={styles.container}>
        <Screen enabled isNativeStack style={StyleSheet.absoluteFill}>
          <HeaderHeightContext.Provider value={headerHeight}>
            <HeaderConfig {...options} route={route} />
            {content}
          </HeaderHeightContext.Provider>
        </Screen>
      </ScreenStack>
    );
  }
  return content;
};

type NavigationRoute<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList
> = Route<Extract<RouteName, string>, ParamList[RouteName]> & {
  state?: NavigationState | PartialState<NavigationState>;
};

const RouteView = ({
  descriptors,
  route,
  index,
  navigation,
  stateKey,
}: {
  descriptors: NativeStackDescriptorMap;
  route: NavigationRoute<ParamListBase, string>;
  index: number;
  navigation: NativeStackNavigationHelpers;
  stateKey: string;
}) => {
  const { options, render: renderScene } = descriptors[route.key];
  const {
    gestureEnabled,
    headerShown,
    hideKeyboardOnSwipe,
    homeIndicatorHidden,
    sheetAllowedDetents = 'large',
    sheetLargestUndimmedDetent = 'all',
    sheetGrabberVisible = false,
    sheetCornerRadius = -1.0,
    sheetExpandsWhenScrolledToEdge = true,
    nativeBackButtonDismissalEnabled = false,
    navigationBarColor,
    navigationBarHidden,
    replaceAnimation = 'pop',
    screenOrientation,
    statusBarAnimation,
    statusBarColor,
    statusBarHidden,
    statusBarStyle,
    statusBarTranslucent,
    swipeDirection = 'horizontal',
    transitionDuration,
    freezeOnBlur,
  } = options;

  let {
    customAnimationOnSwipe,
    fullScreenSwipeEnabled,
    gestureResponseDistance,
    stackAnimation,
    stackPresentation = 'push',
  } = options;

  if (swipeDirection === 'vertical') {
    // for `vertical` direction to work, we need to set `fullScreenSwipeEnabled` to `true`
    // so the screen can be dismissed from any point on screen.
    // `customAnimationOnSwipe` needs to be set to `true` so the `stackAnimation` set by user can be used,
    // otherwise `simple_push` will be used.
    // Also, the default animation for this direction seems to be `slide_from_bottom`.
    if (fullScreenSwipeEnabled === undefined) {
      fullScreenSwipeEnabled = true;
    }
    if (customAnimationOnSwipe === undefined) {
      customAnimationOnSwipe = true;
    }
    if (stackAnimation === undefined) {
      stackAnimation = 'slide_from_bottom';
    }
  }

  if (index === 0) {
    // first screen should always be treated as `push`, it resolves problems with no header animation
    // for navigator with first screen as `modal` and the next as `push`
    stackPresentation = 'push';
  }

  const dimensions = useSafeAreaFrame();
  const topInset = useSafeAreaInsets().top;
  let statusBarHeight = topInset;
  const hasDynamicIsland = Platform.OS === 'ios' && topInset === 59;
  if (hasDynamicIsland) {
    // On models with Dynamic Island the status bar height is smaller than the safe area top inset.
    statusBarHeight = 54;
  }

  const defaultHeaderHeight = getDefaultHeaderHeight(
    dimensions,
    statusBarHeight,
    stackPresentation
  );

  const [headerHeight, setHeaderHeight] = useState(defaultHeaderHeight);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);

  const isHeaderInPush = isAndroid
    ? headerShown
    : stackPresentation === 'push' && headerShown !== false;

  const heightCombinedValues: HeaderHeightContextProps = {
    height: headerHeight,
    staticHeight:
      isHeaderInPush !== false
        ? defaultHeaderHeight
        : parentHeaderHeight?.staticHeight ?? 0,
  };

  const Screen = React.useContext(ScreenContext);

  const { dark } = useTheme();

  return (
    <Screen
      key={route.key}
      enabled
      isNativeStack
      style={StyleSheet.absoluteFill}
      sheetAllowedDetents={sheetAllowedDetents}
      sheetLargestUndimmedDetent={sheetLargestUndimmedDetent}
      sheetGrabberVisible={sheetGrabberVisible}
      sheetCornerRadius={sheetCornerRadius}
      sheetExpandsWhenScrolledToEdge={sheetExpandsWhenScrolledToEdge}
      customAnimationOnSwipe={customAnimationOnSwipe}
      freezeOnBlur={freezeOnBlur}
      fullScreenSwipeEnabled={fullScreenSwipeEnabled}
      hideKeyboardOnSwipe={hideKeyboardOnSwipe}
      homeIndicatorHidden={homeIndicatorHidden}
      gestureEnabled={isAndroid ? false : gestureEnabled}
      gestureResponseDistance={gestureResponseDistance}
      nativeBackButtonDismissalEnabled={nativeBackButtonDismissalEnabled}
      navigationBarColor={navigationBarColor}
      navigationBarHidden={navigationBarHidden}
      replaceAnimation={replaceAnimation}
      screenOrientation={screenOrientation}
      stackAnimation={stackAnimation}
      stackPresentation={stackPresentation}
      statusBarAnimation={statusBarAnimation}
      statusBarColor={statusBarColor}
      statusBarHidden={statusBarHidden}
      statusBarStyle={statusBarStyle ?? (dark ? 'light' : 'dark')}
      statusBarTranslucent={statusBarTranslucent}
      swipeDirection={swipeDirection}
      transitionDuration={transitionDuration}
      onHeaderBackButtonClicked={() => {
        navigation.dispatch({
          ...StackActions.pop(),
          source: route.key,
          target: stateKey,
        });
      }}
      onWillAppear={() => {
        navigation.emit({
          type: 'transitionStart',
          data: { closing: false },
          target: route.key,
        });
      }}
      onWillDisappear={() => {
        navigation.emit({
          type: 'transitionStart',
          data: { closing: true },
          target: route.key,
        });
      }}
      onAppear={() => {
        navigation.emit({
          type: 'appear',
          target: route.key,
        });
        navigation.emit({
          type: 'transitionEnd',
          data: { closing: false },
          target: route.key,
        });
      }}
      onDisappear={() => {
        navigation.emit({
          type: 'transitionEnd',
          data: { closing: true },
          target: route.key,
        });
      }}
      onHeaderHeightChange={(e) => {
        navigation.emit({
          type: 'headerHeightChange',
          data: { newHeight: e.nativeEvent.newHeight },
          target: route.key,
        });

        setHeaderHeight(e.nativeEvent.newHeight);
      }}
      onDismissed={(e) => {
        navigation.emit({
          type: 'dismiss',
          target: route.key,
        });

        const dismissCount =
          e.nativeEvent.dismissCount > 0 ? e.nativeEvent.dismissCount : 1;

        navigation.dispatch({
          ...StackActions.pop(dismissCount),
          source: route.key,
          target: stateKey,
        });
      }}
      onGestureCancel={() => {
        navigation.emit({
          type: 'gestureCancel',
          target: route.key,
        });
      }}
    >
      <HeaderHeightContext.Provider value={heightCombinedValues}>
        <HeaderConfig {...options} route={route} headerShown={isHeaderInPush} />
        <MaybeNestedStack
          options={options}
          route={route}
          stackPresentation={stackPresentation}
          headerHeight={heightCombinedValues}
        >
          {renderScene()}
        </MaybeNestedStack>
      </HeaderHeightContext.Provider>
    </Screen>
  );
};

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

function NativeStackViewInner({
  state,
  navigation,
  descriptors,
}: Props): JSX.Element {
  const { key, routes } = state;

  return (
    <ScreenStack style={styles.container}>
      {routes.map((route, index) => (
        <RouteView
          key={route.key}
          descriptors={descriptors}
          route={route}
          index={index}
          navigation={navigation}
          stateKey={key}
        />
      ))}
    </ScreenStack>
  );
}

export default function NativeStackView(props: Props) {
  return (
    <SafeAreaProviderCompat>
      <NativeStackViewInner {...props} />
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
