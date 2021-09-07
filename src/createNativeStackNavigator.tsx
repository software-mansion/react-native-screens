import React from 'react';
import {
  Platform,
  StyleSheet,
  Animated,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  ScreenContext,
  ScreenStack,
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderConfig,
  ScreenStackHeaderConfigProps,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackHeaderSearchBarView,
  SearchBar,
  StackPresentationTypes,
} from 'react-native-screens';
import {
  createNavigator,
  SceneView,
  StackActions,
  StackRouter,
  NavigationRouteConfigMap,
  CreateNavigatorConfig,
  NavigationStackRouterConfig,
  NavigationParams,
  NavigationRoute,
  NavigationDescriptor,
  NavigationState,
  NavigationNavigator,
  NavigationAction,
  NavigationProp,
  NavigationScreenProp,
} from 'react-navigation';
import { NativeStackNavigationOptions as NativeStackNavigationOptionsV5 } from './native-stack/types';
import { HeaderBackButton } from 'react-navigation-stack';
import {
  StackNavigationHelpers,
  StackNavigationProp,
  Layout,
} from 'react-navigation-stack/src/vendor/types';

const REMOVE_ACTION = 'NativeStackNavigator/REMOVE';

const isAndroid = Platform.OS === 'android';

let didWarn = isAndroid;

function renderComponentOrThunk(componentOrThunk: unknown, props: unknown) {
  if (typeof componentOrThunk === 'function') {
    return componentOrThunk(props);
  }
  return componentOrThunk;
}

type NativeStackRemoveNavigationAction = {
  type: typeof REMOVE_ACTION;
  immediate: boolean;
  dismissCount: number;
  key?: string;
};

export type NativeStackNavigationProp = StackNavigationProp;

export type NativeStackNavigationOptions = StackNavigatorOptions &
  NativeStackNavigationOptionsV5 &
  BackButtonProps & {
    onWillAppear?: () => void;
    onAppear?: () => void;
    onWillDisappear?: () => void;
    onDisappear?: () => void;
    // these props differ from the ones used in v5 `native-stack`, and we would like to keep the API consistent between versions
    /** Use `headerHideShadow` to be consistent with v5 `native-stack` */
    hideShadow?: boolean;
    /** Use `headerLargeTitle` to be consistent with v5 `native-stack` */
    largeTitle?: boolean;
    /** Use `headerLargeTitleHideShadow` to be consistent with v5 `native-stack` */
    largeTitleHideShadow?: boolean;
    /** Use `headerTranslucent` to be consistent with v5 `native-stack` */
    translucent?: boolean;
  };

// these are adopted from `stack` navigator
type StackNavigatorOptions = {
  /** This is an option from `stackNavigator` and it hides the header when set to `null`. Use `headerShown` instead to be consistent with v5 `native-stack`. */
  header?: React.ComponentType<Record<string, unknown>> | null;
  /** This is an option from `stackNavigator` and it controls the stack presentation along with `mode` prop. Use `stackPresentation` instead to be consistent with v5 `native-stack` */
  cardTransparent?: boolean;
  /** This is an option from `stackNavigator` and it sets stack animation to none when `false` passed. Use `stackAnimation: 'none'` instead to be consistent with v5 `native-stack` */
  animationEnabled?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
};

// these are the props used for rendering back button taken from `react-navigation-stack`
type BackButtonProps = {
  headerBackImage?: (props: { tintColor: string }) => React.ReactNode;
  headerPressColorAndroid?: string;
  headerTintColor?: string;
  backButtonTitle?: string;
  truncatedBackButtonTitle?: string;
  backTitleVisible?: boolean;
  headerBackTitleStyle?: Animated.WithAnimatedValue<StyleProp<TextStyle>>;
  layoutPreset?: Layout;
};

type NativeStackDescriptor = NavigationDescriptor<
  NavigationParams,
  NativeStackNavigationOptions
>;

type NativeStackDescriptorMap = {
  [key: string]: NativeStackDescriptor;
};

// these are the props used for rendering back button taken from `react-navigation-stack`
type NativeStackNavigationConfig = {
  /** This is an option from `stackNavigator` and controls the stack presentation along with `cardTransparent` prop. Use `stackPresentation` instead to be consistent with v5 `native-stack` */
  mode?: 'modal' | 'containedModal';
  /** This is an option from `stackNavigator` and makes the header hide when set to `none`. Use `headerShown` instead to be consistent with v5 `native-stack` */
  headerMode?: 'none';
  /** This is an option from `stackNavigator` and controls the stack presentation along with `mode` prop. Use `stackPresentation` instead to be consistent with v5 `native-stack` */
  transparentCard?: boolean;
};

function removeScene(
  route: NavigationRoute<NavigationParams>,
  dismissCount: number,
  navigation: StackNavigationHelpers
) {
  navigation.dispatch({
    // @ts-ignore special navigation action for native stack
    type: REMOVE_ACTION,
    immediate: true,
    key: route.key,
    dismissCount,
  });
}

function onAppear(
  route: NavigationRoute<NavigationParams>,
  descriptor: NativeStackDescriptor,
  navigation: StackNavigationHelpers
) {
  descriptor.options?.onAppear?.();
  navigation.dispatch(
    StackActions.completeTransition({
      toChildKey: route.key,
      key: navigation.state.key,
    })
  );
}

function onFinishTransitioning(navigation: StackNavigationHelpers) {
  const { routes } = navigation.state;
  const lastRoute = routes?.length && routes[routes.length - 1];

  if (lastRoute) {
    navigation.dispatch(
      StackActions.completeTransition({
        toChildKey: lastRoute.key,
        key: navigation.state.key,
      })
    );
  }
}

function renderHeaderConfig(
  index: number,
  route: NavigationRoute<NavigationParams>,
  descriptor: NativeStackDescriptor,
  navigationConfig: NativeStackNavigationConfig
) {
  const { options } = descriptor;
  const { headerMode } = navigationConfig;

  const {
    backButtonInCustomView,
    direction,
    disableBackButtonMenu,
    headerBackTitle,
    headerBackTitleStyle,
    headerBackTitleVisible,
    headerHideBackButton,
    headerHideShadow,
    headerLargeStyle,
    headerLargeTitle,
    headerLargeTitleHideShadow,
    headerLargeTitleStyle,
    headerShown,
    headerStyle,
    headerTintColor,
    headerTitleStyle,
    headerTopInsetEnabled = true,
    headerTranslucent,
    hideShadow,
    largeTitle,
    largeTitleHideShadow,
    title,
    translucent,
  } = options;

  const scene = {
    index,
    key: route.key,
    route,
    descriptor,
  };

  const headerOptions: ScreenStackHeaderConfigProps = {
    backButtonInCustomView,
    backTitle: headerBackTitleVisible === false ? '' : headerBackTitle,
    backTitleFontFamily: headerBackTitleStyle?.fontFamily,
    backTitleFontSize: headerBackTitleStyle?.fontSize,
    color: headerTintColor,
    direction,
    disableBackButtonMenu,
    topInsetEnabled: headerTopInsetEnabled,
    hideBackButton: headerHideBackButton,
    hideShadow: headerHideShadow || hideShadow,
    largeTitle: headerLargeTitle || largeTitle,
    largeTitleBackgroundColor:
      headerLargeStyle?.backgroundColor ||
      // @ts-ignore old implementation, will not be present in TS API, but can be used here
      headerLargeTitleStyle?.backgroundColor,
    largeTitleColor: headerLargeTitleStyle?.color,
    largeTitleFontFamily: headerLargeTitleStyle?.fontFamily,
    largeTitleFontSize: headerLargeTitleStyle?.fontSize,
    largeTitleFontWeight: headerLargeTitleStyle?.fontWeight,
    largeTitleHideShadow: largeTitleHideShadow || headerLargeTitleHideShadow,
    title,
    titleColor: headerTitleStyle?.color || headerTintColor,
    titleFontFamily: headerTitleStyle?.fontFamily,
    titleFontSize: headerTitleStyle?.fontSize,
    titleFontWeight: headerTitleStyle?.fontWeight,
    translucent: headerTranslucent || translucent || false,
  };

  const hasHeader =
    headerShown !== false && headerMode !== 'none' && options.header !== null;
  if (!hasHeader) {
    return <ScreenStackHeaderConfig {...headerOptions} hidden />;
  }

  if (headerStyle !== undefined) {
    headerOptions.backgroundColor = headerStyle.backgroundColor;
    headerOptions.blurEffect = headerStyle.blurEffect;
  }

  const children = [];

  if (options.backButtonImage) {
    children.push(
      <ScreenStackHeaderBackButtonImage
        key="backImage"
        source={options.backButtonImage}
      />
    );
  }

  if (Platform.OS === 'ios' && options.searchBar) {
    children.push(
      <ScreenStackHeaderSearchBarView>
        <SearchBar {...options.searchBar} />
      </ScreenStackHeaderSearchBarView>
    );
  }

  if (options.headerLeft !== undefined) {
    children.push(
      <ScreenStackHeaderLeftView key="left">
        {renderComponentOrThunk(options.headerLeft, { scene })}
      </ScreenStackHeaderLeftView>
    );
  } else if (options.headerBackImage !== undefined) {
    const goBack = () => {
      // Go back on next tick because button ripple effect needs to happen on Android
      requestAnimationFrame(() => {
        descriptor.navigation.goBack(descriptor.key);
      });
    };

    children.push(
      <ScreenStackHeaderLeftView key="left">
        <HeaderBackButton
          onPress={goBack}
          pressColorAndroid={options.headerPressColorAndroid}
          tintColor={options.headerTintColor}
          backImage={options.headerBackImage}
          label={options.backButtonTitle}
          truncatedLabel={options.truncatedBackButtonTitle}
          labelVisible={options.backTitleVisible}
          labelStyle={options.headerBackTitleStyle}
          titleLayout={options.layoutPreset}
          // @ts-ignore old props kept for very old version of `react-navigation-stack`
          title={options.backButtonTitle}
          truncatedTitle={options.truncatedBackButtonTitle}
          backTitleVisible={options.backTitleVisible}
          titleStyle={options.headerBackTitleStyle}
          layoutPreset={options.layoutPreset}
          scene={scene}
        />
      </ScreenStackHeaderLeftView>
    );
  }

  if (options.headerTitle) {
    if (title === undefined && typeof options.headerTitle === 'string') {
      headerOptions.title = options.headerTitle;
    } else {
      children.push(
        <ScreenStackHeaderCenterView key="center">
          {renderComponentOrThunk(options.headerTitle, { scene })}
        </ScreenStackHeaderCenterView>
      );
    }
  }

  if (options.headerRight) {
    children.push(
      <ScreenStackHeaderRightView key="right">
        {renderComponentOrThunk(options.headerRight, { scene })}
      </ScreenStackHeaderRightView>
    );
  }

  if (children.length > 0) {
    headerOptions.children = children;
  }

  return <ScreenStackHeaderConfig {...headerOptions} />;
}

const MaybeNestedStack = ({
  isHeaderInModal,
  screenProps,
  route,
  navigation,
  SceneComponent,
  index,
  descriptor,
  navigationConfig,
}: {
  isHeaderInModal: boolean;
  screenProps: unknown;
  route: NavigationRoute<NavigationParams>;
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
  SceneComponent: React.ComponentType<Record<string, unknown>>;
  index: number;
  descriptor: NativeStackDescriptor;
  navigationConfig: NativeStackNavigationConfig;
}) => {
  const Screen = React.useContext(ScreenContext);

  if (isHeaderInModal) {
    return (
      <ScreenStack style={styles.scenes}>
        <Screen style={StyleSheet.absoluteFill} enabled isNativeStack>
          {renderHeaderConfig(index, route, descriptor, navigationConfig)}
          <SceneView
            screenProps={screenProps}
            navigation={navigation}
            component={SceneComponent}
          />
        </Screen>
      </ScreenStack>
    );
  }
  return (
    <SceneView
      screenProps={screenProps}
      navigation={navigation}
      component={SceneComponent}
    />
  );
};

type StackViewProps = {
  navigation: StackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
  navigationConfig: NativeStackNavigationConfig;
  screenProps: unknown;
};

function StackView({
  navigation,
  descriptors,
  navigationConfig,
  screenProps,
}: StackViewProps) {
  const { routes } = navigation.state;
  const Screen = React.useContext(ScreenContext);
  return (
    <ScreenStack
      style={styles.scenes}
      onFinishTransitioning={() => onFinishTransitioning(navigation)}>
      {routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        const { getComponent, options } = descriptor;
        const routeNavigationProp = descriptor.navigation;
        const { mode, transparentCard } = navigationConfig;
        const SceneComponent = getComponent();

        let stackPresentation: StackPresentationTypes = 'push';

        if (options.stackPresentation) {
          stackPresentation = options.stackPresentation;
        } else {
          // this shouldn't be used because we have a prop for that
          if (mode === 'modal' || mode === 'containedModal') {
            stackPresentation = mode;
            if (transparentCard || options.cardTransparent) {
              stackPresentation =
                mode === 'containedModal'
                  ? 'containedTransparentModal'
                  : 'transparentModal';
            }
          }
        }
        let stackAnimation = options.stackAnimation;
        if (options.animationEnabled === false) {
          stackAnimation = 'none';
        }

        const hasHeader =
          options.headerShown !== false &&
          navigationConfig?.headerMode !== 'none' &&
          options.header !== null;

        if (
          !didWarn &&
          stackPresentation !== 'push' &&
          options.headerShown !== undefined
        ) {
          didWarn = true;
          console.warn(
            'Be aware that changing the visibility of header in modal on iOS will result in resetting the state of the screen.'
          );
        }

        const isHeaderInModal = isAndroid
          ? false
          : stackPresentation !== 'push' &&
            hasHeader &&
            options.headerShown === true;
        const isHeaderInPush = isAndroid
          ? hasHeader
          : stackPresentation === 'push' && hasHeader;

        return (
          <Screen
            key={`screen_${route.key}`}
            enabled
            isNativeStack
            style={[StyleSheet.absoluteFill, options.cardStyle]}
            stackAnimation={stackAnimation}
            customAnimationOnSwipe={options.customAnimationOnSwipe}
            stackPresentation={stackPresentation}
            replaceAnimation={
              options.replaceAnimation === undefined
                ? 'pop'
                : options.replaceAnimation
            }
            pointerEvents={
              index === navigation.state.routes.length - 1 ? 'auto' : 'none'
            }
            gestureEnabled={
              Platform.OS === 'android'
                ? false
                : options.gestureEnabled === undefined
                ? true
                : options.gestureEnabled
            }
            nativeBackButtonDismissalEnabled={
              options.nativeBackButtonDismissalEnabled
            }
            fullScreenSwipeEnabled={options.fullScreenSwipeEnabled}
            screenOrientation={options.screenOrientation}
            statusBarAnimation={options.statusBarAnimation}
            statusBarColor={options.statusBarColor}
            statusBarHidden={options.statusBarHidden}
            statusBarStyle={options.statusBarStyle}
            statusBarTranslucent={options.statusBarTranslucent}
            onAppear={() => onAppear(route, descriptor, routeNavigationProp)}
            onWillAppear={() => options?.onWillAppear?.()}
            onWillDisappear={() => options?.onWillDisappear?.()}
            onDisappear={() => options?.onDisappear?.()}
            onHeaderBackButtonClicked={() =>
              removeScene(route, 1, routeNavigationProp)
            }
            onDismissed={(e) =>
              removeScene(
                route,
                e.nativeEvent.dismissCount,
                routeNavigationProp
              )
            }>
            {isHeaderInPush &&
              renderHeaderConfig(index, route, descriptor, navigationConfig)}
            <MaybeNestedStack
              isHeaderInModal={isHeaderInModal}
              screenProps={screenProps}
              route={route}
              navigation={routeNavigationProp}
              SceneComponent={SceneComponent}
              index={index}
              descriptor={descriptor}
              navigationConfig={navigationConfig}
            />
          </Screen>
        );
      })}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  scenes: { flex: 1 },
});

function createStackNavigator(
  routeConfigMap: NavigationRouteConfigMap<
    NativeStackNavigationOptions,
    StackNavigationProp
  >,
  stackConfig: CreateNavigatorConfig<
    NativeStackNavigationConfig,
    NavigationStackRouterConfig,
    NativeStackNavigationOptions,
    StackNavigationProp
  > = {}
): NavigationNavigator<
  Record<string, unknown>,
  NavigationProp<NavigationState>
> {
  const router = StackRouter(routeConfigMap, stackConfig);

  // below we override getStateForAction method in order to add handling for
  // a custom native stack navigation action. The action REMOVE that we want to
  // add works in a similar way to POP, but it does not remove all the routes
  // that sit on top of the removed route. For example if we have three routes
  // [a,b,c] and call POP on b, then both b and c will go away. In case we
  // call REMOVE on b, only b will be removed from the stack and the resulting
  // state will be [a, c]
  const superGetStateForAction = router.getStateForAction;
  router.getStateForAction = (
    action: NavigationAction | NativeStackRemoveNavigationAction,
    state
  ) => {
    if (action.type === REMOVE_ACTION) {
      const { key, immediate, dismissCount } = action;
      let backRouteIndex = state.index;
      if (key) {
        const backRoute = state.routes.find(
          (route: NavigationRoute<NavigationParams>) => route.key === key
        );
        backRouteIndex = state.routes.indexOf(backRoute);
      }

      if (backRouteIndex > 0) {
        const newRoutes = [...state.routes];
        if (dismissCount > 1) {
          // when dismissing with iOS 14 native header back button, we can pop more than 1 screen at a time
          // and the `backRouteIndex` is the index of the previous screen. Since we are starting already
          // on the previous screen, we add 1 to start.
          newRoutes.splice(backRouteIndex - dismissCount + 1, dismissCount);
        } else {
          newRoutes.splice(backRouteIndex, 1);
        }

        return {
          ...state,
          routes: newRoutes,
          index: newRoutes.length - 1,
          isTransitioning: immediate !== true,
        };
      }
    }
    return superGetStateForAction(action as NavigationAction, state);
  };
  // Create a navigator with StackView as the view
  return createNavigator(StackView, router, stackConfig);
}

export default createStackNavigator;
