import * as React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
// @ts-ignore Getting private component
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
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
  NativeStackNavigationOptions,
} from '../types';
import HeaderConfig from './HeaderConfig';
import SafeAreaProviderCompat from '../utils/SafeAreaProviderCompat';
import getDefaultHeaderHeight from '../utils/getDefaultHeaderHeight';
import HeaderHeightContext from '../utils/HeaderHeightContext';

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
  children,
}: {
  options: NativeStackNavigationOptions;
  route: Route<string>;
  stackPresentation: StackPresentationTypes;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();
  const { headerShown = true, contentStyle } = options;

  const Screen = React.useContext(ScreenContext);

  const isHeaderInModal = isAndroid
    ? false
    : stackPresentation !== 'push' && headerShown === true;

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
      stackPresentation={stackPresentation}>
      {children}
    </Container>
  );

  const topInset = useSafeAreaInsets().top;
  const dimensions = useSafeAreaFrame();
  const headerHeight = getDefaultHeaderHeight(
    dimensions,
    topInset,
    stackPresentation
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
    customAnimationOnSwipe,
    fullScreenSwipeEnabled,
    gestureEnabled,
    headerShown,
    nativeBackButtonDismissalEnabled = false,
    replaceAnimation = 'pop',
    screenOrientation,
    stackAnimation,
    statusBarAnimation,
    statusBarColor,
    statusBarHidden,
    statusBarStyle,
    statusBarTranslucent,
  } = options;

  let { stackPresentation = 'push' } = options;

  if (index === 0) {
    // first screen should always be treated as `push`, it resolves problems with no header animation
    // for navigator with first screen as `modal` and the next as `push`
    stackPresentation = 'push';
  }

  const isHeaderInPush = isAndroid
    ? headerShown
    : stackPresentation === 'push' && headerShown !== false;

  const dimensions = useSafeAreaFrame();
  const topInset = useSafeAreaInsets().top;
  const headerHeight = getDefaultHeaderHeight(
    dimensions,
    topInset,
    stackPresentation
  );
  const parentHeaderHeight = React.useContext(HeaderHeightContext);
  const Screen = React.useContext(ScreenContext);

  return (
    <Screen
      key={route.key}
      enabled
      isNativeStack
      style={StyleSheet.absoluteFill}
      customAnimationOnSwipe={customAnimationOnSwipe}
      fullScreenSwipeEnabled={fullScreenSwipeEnabled}
      gestureEnabled={isAndroid ? false : gestureEnabled}
      nativeBackButtonDismissalEnabled={nativeBackButtonDismissalEnabled}
      replaceAnimation={replaceAnimation}
      screenOrientation={screenOrientation}
      stackAnimation={stackAnimation}
      stackPresentation={stackPresentation}
      statusBarAnimation={statusBarAnimation}
      statusBarColor={statusBarColor}
      statusBarHidden={statusBarHidden}
      statusBarStyle={statusBarStyle}
      statusBarTranslucent={statusBarTranslucent}
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
      }}>
      <HeaderHeightContext.Provider
        value={
          isHeaderInPush !== false ? headerHeight : parentHeaderHeight ?? 0
        }>
        <HeaderConfig {...options} route={route} headerShown={isHeaderInPush} />
        <MaybeNestedStack
          options={options}
          route={route}
          stackPresentation={stackPresentation}>
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
