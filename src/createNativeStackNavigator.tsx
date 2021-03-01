import React from 'react';
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  Platform,
  StyleSheet,
  Animated,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderConfig,
  ScreenStackHeaderConfigProps,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
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
} from 'react-navigation';
import { NativeStackNavigationOptions as NativeStackNavigationOptionsV5 } from './native-stack/types';
import { HeaderBackButton } from 'react-navigation-stack';
import {
  StackNavigationHelpers,
  StackNavigationProp,
  Layout,
} from 'react-navigation-stack/src/vendor/types';

const REMOVE_ACTION = 'NativeStackNavigator/REMOVE';

function renderComponentOrThunk(componentOrThunk: unknown, props: unknown) {
  if (typeof componentOrThunk === 'function') {
    return componentOrThunk(props);
  }
  return componentOrThunk;
}

type NativeStackRemoveNavigationAction = {
  type: typeof REMOVE_ACTION;
  immediate: boolean;
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

type Props = {
  navigation: StackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
  navigationConfig: NativeStackNavigationConfig;
  screenProps: unknown;
};
class StackView extends React.Component<Props> {
  private removeScene = (route: NavigationRoute<NavigationParams>) => {
    this.props.navigation.dispatch({
      // @ts-ignore special navigation action for native stack
      type: REMOVE_ACTION,
      immediate: true,
      key: route.key,
    });
  };

  private onAppear = (
    route: NavigationRoute<NavigationParams>,
    descriptor: NativeStackDescriptor
  ) => {
    descriptor.options?.onAppear?.();
    this.props.navigation.dispatch(
      StackActions.completeTransition({
        toChildKey: route.key,
        key: this.props.navigation.state.key,
      })
    );
  };

  private onFinishTransitioning:
    | ((e: NativeSyntheticEvent<NativeTouchEvent>) => void)
    | undefined = () => {
    const { routes } = this.props.navigation.state;
    const lastRoute = routes?.length && routes[routes.length - 1];

    if (lastRoute) {
      this.props.navigation.dispatch(
        StackActions.completeTransition({
          toChildKey: lastRoute.key,
          key: this.props.navigation.state.key,
        })
      );
    }
  };

  private renderHeaderConfig = (
    index: number,
    route: NavigationRoute<NavigationParams>,
    descriptor: NativeStackDescriptor
  ) => {
    const { navigationConfig } = this.props;
    const { options } = descriptor;
    const { headerMode } = navigationConfig;

    const {
      backButtonInCustomView,
      direction,
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
      screenOrientation,
      statusBarAnimation,
      statusBarHidden,
      statusBarStyle,
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
      screenOrientation,
      statusBarAnimation,
      statusBarHidden,
      statusBarStyle,
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
  };

  private renderScene = (
    index: number,
    route: NavigationRoute<NavigationParams>,
    descriptor: NativeStackDescriptor
  ) => {
    const { navigation, getComponent, options } = descriptor;
    const { mode, transparentCard } = this.props.navigationConfig;
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

    const { screenProps } = this.props;
    return (
      <Screen
        key={`screen_${route.key}`}
        style={[StyleSheet.absoluteFill, options.cardStyle]}
        stackAnimation={stackAnimation}
        stackPresentation={stackPresentation}
        replaceAnimation={
          options.replaceAnimation === undefined
            ? 'pop'
            : options.replaceAnimation
        }
        pointerEvents={
          index === this.props.navigation.state.routes.length - 1
            ? 'auto'
            : 'none'
        }
        gestureEnabled={
          Platform.OS === 'android'
            ? false
            : options.gestureEnabled === undefined
            ? true
            : options.gestureEnabled
        }
        onAppear={() => this.onAppear(route, descriptor)}
        onWillAppear={() => options?.onWillAppear?.()}
        onWillDisappear={() => options?.onWillDisappear?.()}
        onDisappear={() => options?.onDisappear?.()}
        onDismissed={() => this.removeScene(route)}>
        {this.renderHeaderConfig(index, route, descriptor)}
        <SceneView
          screenProps={screenProps}
          navigation={navigation}
          component={SceneComponent}
        />
      </Screen>
    );
  };

  render() {
    const { navigation, descriptors } = this.props;

    return (
      <ScreenStack
        style={styles.scenes}
        onFinishTransitioning={this.onFinishTransitioning}>
        {navigation.state.routes.map((route, i) =>
          this.renderScene(i, route, descriptors[route.key])
        )}
      </ScreenStack>
    );
  }
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
      const { key, immediate } = action;
      let backRouteIndex = state.index;
      if (key) {
        const backRoute = state.routes.find(
          (route: NavigationRoute<NavigationParams>) => route.key === key
        );
        backRouteIndex = state.routes.indexOf(backRoute);
      }

      if (backRouteIndex > 0) {
        const newRoutes = [...state.routes];
        newRoutes.splice(backRouteIndex, 1);
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
