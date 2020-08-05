import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
} from 'react-native-screens';
import {
  createNavigator,
  SceneView,
  StackActions,
  StackRouter,
} from 'react-navigation';
import { HeaderBackButton } from 'react-navigation-stack';

function renderComponentOrThunk(componentOrThunk, props) {
  if (typeof componentOrThunk === 'function') {
    return componentOrThunk(props);
  }
  return componentOrThunk;
}

const REMOVE_ACTION = 'NativeStackNavigator/REMOVE';

class StackView extends React.Component {
  _removeScene = (route) => {
    this.props.navigation.dispatch({
      type: REMOVE_ACTION,
      immediate: true,
      key: route.key,
    });
  };

  _onAppear = (route, descriptor) => {
    descriptor.options &&
      descriptor.options.onAppear &&
      descriptor.options.onAppear();
    this.props.navigation.dispatch(
      StackActions.completeTransition({
        toChildKey: route.key,
        key: this.props.navigation.state.key,
      })
    );
  };

  _onFinishTransitioning = () => {
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

  _renderHeaderConfig = (index, route, descriptor) => {
    const { navigationConfig } = this.props;
    const { options } = descriptor;
    const { headerMode } = navigationConfig;

    const {
      title,
      headerStyle,
      headerTitleStyle,
      headerBackTitleStyle,
      headerBackTitle,
      headerBackTitleVisible,
      headerTintColor,
      largeTitle,
      headerLargeTitleStyle,
      translucent,
      hideShadow,
      headerTopInsetEnabled = true,
    } = options;

    const scene = {
      index,
      key: route.key,
      route,
      descriptor,
    };

    const headerOptions = {
      translucent: translucent === undefined ? false : translucent,
      title,
      titleFontFamily: headerTitleStyle && headerTitleStyle.fontFamily,
      titleColor:
        (headerTitleStyle && headerTitleStyle.color) || headerTintColor,
      titleFontSize: headerTitleStyle && headerTitleStyle.fontSize,
      backTitle: headerBackTitleVisible === false ? '' : headerBackTitle,
      backTitleFontFamily:
        headerBackTitleStyle && headerBackTitleStyle.fontFamily,
      backTitleFontSize: headerBackTitleStyle && headerBackTitleStyle.fontSize,
      color: headerTintColor,
      largeTitle,
      largeTitleFontFamily:
        headerLargeTitleStyle && headerLargeTitleStyle.fontFamily,
      largeTitleFontSize:
        headerLargeTitleStyle && headerLargeTitleStyle.fontSize,
      largeTitleColor: headerLargeTitleStyle && headerLargeTitleStyle.color,
      hideShadow,
      headerTopInsetEnabled,
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

  _renderScene = (index, route, descriptor) => {
    const { navigation, getComponent, options } = descriptor;
    const { mode, transparentCard } = this.props.navigationConfig;
    const SceneComponent = getComponent();

    let stackPresentation = 'push';
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
        onAppear={() => this._onAppear(route, descriptor)}
        onDismissed={() => this._removeScene(route)}>
        {this._renderHeaderConfig(index, route, descriptor)}
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
        onFinishTransitioning={this._onFinishTransitioning}>
        {navigation.state.routes.map((route, i) =>
          this._renderScene(i, route, descriptors[route.key])
        )}
      </ScreenStack>
    );
  }
}

const styles = StyleSheet.create({
  scenes: { flex: 1 },
});

function createStackNavigator(routeConfigMap, stackConfig = {}) {
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
        const backRoute = state.routes.find((route) => route.key === key);
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
  return createNavigator(StackView, router, stackConfig);
}

export default createStackNavigator;
