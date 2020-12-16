// @ts-nocheck it is not ready yet
import React from 'react';
import { NativeSyntheticEvent, NativeTouchEvent, Platform, StyleSheet } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderConfig,
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
  NavigationDescriptor
} from 'react-navigation';
import {NativeStackNavigationOptions} from './native-stack/types';
import { HeaderBackButton } from 'react-navigation-stack';
import { StackNavigationHelpers, StackNavigationConfig, StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';

function renderComponentOrThunk(componentOrThunk: unknown, props: unknown) {
  if (typeof componentOrThunk === 'function') {
    return componentOrThunk(props);
  }
  return componentOrThunk;
}

const REMOVE_ACTION = 'NativeStackNavigator/REMOVE';

type NativeStackDescriptor = NavigationDescriptor<NavigationParams, NativeStackNavigationOptions>;

type NativeStackDescriptorMap = {
  [key: string]: NativeStackDescriptor;
};


type Props = {
  navigation: StackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
  navigationConfig: StackNavigationConfig;
  screenProps: unknown;
};
class StackView extends React.Component<Props> {
  private removeScene = (route: NavigationRoute<NavigationParams>) => {
    this.props.navigation.dispatch({
      type: REMOVE_ACTION,
      immediate: true,
      key: route.key,
    });
  };

  private onAppear = (route: NavigationRoute<NavigationParams>, descriptor: NativeStackDescriptor) => {
    descriptor.options?.onAppear?.();
    this.props.navigation.dispatch(
      StackActions.completeTransition({
        toChildKey: route.key,
        key: this.props.navigation.state.key,
      })
    );
  };

  private onFinishTransitioning: ((e: NativeSyntheticEvent<NativeTouchEvent>) => void) | undefined = () => {
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

  private renderHeaderConfig = (index: number, route: NavigationRoute<NavigationParams>, descriptor: NativeStackDescriptor) => {
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
      headerLargeStyle,
      headerLargeTitleStyle,
      headerStyle,
      headerTintColor,
      headerTitleStyle,
      headerTopInsetEnabled = true,
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

    const headerOptions = {
      backButtonInCustomView,
      backTitle: headerBackTitleVisible === false ? '' : headerBackTitle,
      backTitleFontFamily: headerBackTitleStyle?.fontFamily,
      backTitleFontSize: headerBackTitleStyle?.fontSize,
      color: headerTintColor,
      direction,
      topInsetEnabled: headerTopInsetEnabled,
      hideBackButton: headerHideBackButton,
      hideShadow,
      largeTitle,
      largeTitleBackgroundColor:
        (headerLargeStyle && headerLargeStyle.backgroundColor) ||
        (headerLargeTitleStyle && headerLargeTitleStyle.backgroundColor),
      largeTitleColor: headerLargeTitleStyle && headerLargeTitleStyle.color,
      largeTitleFontFamily:
        headerLargeTitleStyle && headerLargeTitleStyle.fontFamily,
      largeTitleFontSize:
        headerLargeTitleStyle && headerLargeTitleStyle.fontSize,
      largeTitleFontWeight:
        headerLargeTitleStyle && headerLargeTitleStyle.fontWeight,
      largeTitleHideShadow,
      screenOrientation,
      statusBarAnimation,
      statusBarHidden,
      statusBarStyle,
      title,
      titleColor: headerTitleStyle?.color || headerTintColor,
      titleFontFamily: headerTitleStyle?.fontFamily,
      titleFontSize: headerTitleStyle?.fontSize,
      titleFontWeight: headerTitleStyle?.fontWeight,
      translucent: translucent === undefined ? false : translucent,
    };

    const hasHeader = headerMode !== 'none' && options.header !== null;
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
            title={options.backButtonTitle}
            truncatedTitle={options.truncatedBackButtonTitle}
            backTitleVisible={this.props.backTitleVisible}
            titleStyle={options.headerBackTitleStyle}
            layoutPreset={this.props.layoutPreset}
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

  private renderScene = (index: number, route: NavigationRoute<NavigationParams>, descriptor: NativeStackDescriptor) => {
    const { navigation, getComponent, options } = descriptor;
    const { mode, transparentCard } = this.props.navigationConfig;
    const SceneComponent = getComponent();

    let stackPresentation: StackPresentationTypes = 'push';
    if (mode === 'modal' || mode === 'containedModal') {
      stackPresentation = mode;
      if (transparentCard || options.cardTransparent) {
        stackPresentation =
          mode === 'containedModal'
            ? 'containedTransparentModal'
            : 'transparentModal';
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
    StackNavigationConfig,
    NavigationStackRouterConfig,
    NativeStackNavigationOptions,
    StackNavigationProp
  > = {}
) {
  const router = StackRouter(routeConfigMap, stackConfig);

  // belowe we override getStateForAction method in order to add handling for
  // a custom native stack navigation action. The action REMOVE that we want to
  // add works in a similar way to POP, but it does not remove all the routes
  // that sit on top of the removed route. For example if we have three routes
  // [a,b,c] and call POP on b, then both b and c will go away. In case we
  // call REMOVE on b, only b will be removed from the stack and the resulting
  // state will be [a, c]
  const superGetStateForAction = router.getStateForAction;
  router.getStateForAction = (action, state) => {
    if (action.type === REMOVE_ACTION) {
      const { key, immediate } = action;
      let backRouteIndex = state.index;
      if (key) {
        const backRoute = state.routes.find((route: NavigationRoute<NavigationParams>) => route.key === key);
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
    return superGetStateForAction(action, state);
  };
  // Create a navigator with StackView as the view
  return createNavigator(
    StackView,
    router,
    stackConfig
  );
}

export default createStackNavigator;
