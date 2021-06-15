"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNativeScreens = require("react-native-screens");

var _reactNavigation = require("react-navigation");

var _reactNavigationStack = require("react-navigation-stack");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const REMOVE_ACTION = 'NativeStackNavigator/REMOVE';
const isAndroid = _reactNative.Platform.OS === 'android';
let didWarn = isAndroid;

function renderComponentOrThunk(componentOrThunk, props) {
  if (typeof componentOrThunk === 'function') {
    return componentOrThunk(props);
  }

  return componentOrThunk;
}

class StackView extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "removeScene", (route, dismissCount) => {
      this.props.navigation.dispatch({
        // @ts-ignore special navigation action for native stack
        type: REMOVE_ACTION,
        immediate: true,
        key: route.key,
        dismissCount
      });
    });

    _defineProperty(this, "onAppear", (route, descriptor) => {
      var _descriptor$options, _descriptor$options$o;

      (_descriptor$options = descriptor.options) === null || _descriptor$options === void 0 ? void 0 : (_descriptor$options$o = _descriptor$options.onAppear) === null || _descriptor$options$o === void 0 ? void 0 : _descriptor$options$o.call(_descriptor$options);
      this.props.navigation.dispatch(_reactNavigation.StackActions.completeTransition({
        toChildKey: route.key,
        key: this.props.navigation.state.key
      }));
    });

    _defineProperty(this, "onFinishTransitioning", () => {
      const {
        routes
      } = this.props.navigation.state;
      const lastRoute = (routes === null || routes === void 0 ? void 0 : routes.length) && routes[routes.length - 1];

      if (lastRoute) {
        this.props.navigation.dispatch(_reactNavigation.StackActions.completeTransition({
          toChildKey: lastRoute.key,
          key: this.props.navigation.state.key
        }));
      }
    });

    _defineProperty(this, "renderHeaderConfig", (index, route, descriptor) => {
      const {
        navigationConfig
      } = this.props;
      const {
        options
      } = descriptor;
      const {
        headerMode
      } = navigationConfig;
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
        translucent
      } = options;
      const scene = {
        index,
        key: route.key,
        route,
        descriptor
      };
      const headerOptions = {
        backButtonInCustomView,
        backTitle: headerBackTitleVisible === false ? '' : headerBackTitle,
        backTitleFontFamily: headerBackTitleStyle === null || headerBackTitleStyle === void 0 ? void 0 : headerBackTitleStyle.fontFamily,
        backTitleFontSize: headerBackTitleStyle === null || headerBackTitleStyle === void 0 ? void 0 : headerBackTitleStyle.fontSize,
        color: headerTintColor,
        direction,
        disableBackButtonMenu,
        topInsetEnabled: headerTopInsetEnabled,
        hideBackButton: headerHideBackButton,
        hideShadow: headerHideShadow || hideShadow,
        largeTitle: headerLargeTitle || largeTitle,
        largeTitleBackgroundColor: (headerLargeStyle === null || headerLargeStyle === void 0 ? void 0 : headerLargeStyle.backgroundColor) || ( // @ts-ignore old implementation, will not be present in TS API, but can be used here
        headerLargeTitleStyle === null || headerLargeTitleStyle === void 0 ? void 0 : headerLargeTitleStyle.backgroundColor),
        largeTitleColor: headerLargeTitleStyle === null || headerLargeTitleStyle === void 0 ? void 0 : headerLargeTitleStyle.color,
        largeTitleFontFamily: headerLargeTitleStyle === null || headerLargeTitleStyle === void 0 ? void 0 : headerLargeTitleStyle.fontFamily,
        largeTitleFontSize: headerLargeTitleStyle === null || headerLargeTitleStyle === void 0 ? void 0 : headerLargeTitleStyle.fontSize,
        largeTitleFontWeight: headerLargeTitleStyle === null || headerLargeTitleStyle === void 0 ? void 0 : headerLargeTitleStyle.fontWeight,
        largeTitleHideShadow: largeTitleHideShadow || headerLargeTitleHideShadow,
        title,
        titleColor: (headerTitleStyle === null || headerTitleStyle === void 0 ? void 0 : headerTitleStyle.color) || headerTintColor,
        titleFontFamily: headerTitleStyle === null || headerTitleStyle === void 0 ? void 0 : headerTitleStyle.fontFamily,
        titleFontSize: headerTitleStyle === null || headerTitleStyle === void 0 ? void 0 : headerTitleStyle.fontSize,
        titleFontWeight: headerTitleStyle === null || headerTitleStyle === void 0 ? void 0 : headerTitleStyle.fontWeight,
        translucent: headerTranslucent || translucent || false
      };
      const hasHeader = headerShown !== false && headerMode !== 'none' && options.header !== null;

      if (!hasHeader) {
        return /*#__PURE__*/_react.default.createElement(_reactNativeScreens.ScreenStackHeaderConfig, _extends({}, headerOptions, {
          hidden: true
        }));
      }

      if (headerStyle !== undefined) {
        headerOptions.backgroundColor = headerStyle.backgroundColor;
        headerOptions.blurEffect = headerStyle.blurEffect;
      }

      const children = [];

      if (options.backButtonImage) {
        children.push( /*#__PURE__*/_react.default.createElement(_reactNativeScreens.ScreenStackHeaderBackButtonImage, {
          key: "backImage",
          source: options.backButtonImage
        }));
      }

      if (_reactNative.Platform.OS === 'ios' && options.searchBar) {
        children.push( /*#__PURE__*/_react.default.createElement(_reactNativeScreens.ScreenStackHeaderSearchBarView, null, /*#__PURE__*/_react.default.createElement(_reactNativeScreens.SearchBar, options.searchBar)));
      }

      if (options.headerLeft !== undefined) {
        children.push( /*#__PURE__*/_react.default.createElement(_reactNativeScreens.ScreenStackHeaderLeftView, {
          key: "left"
        }, renderComponentOrThunk(options.headerLeft, {
          scene
        })));
      } else if (options.headerBackImage !== undefined) {
        const goBack = () => {
          // Go back on next tick because button ripple effect needs to happen on Android
          requestAnimationFrame(() => {
            descriptor.navigation.goBack(descriptor.key);
          });
        };

        children.push( /*#__PURE__*/_react.default.createElement(_reactNativeScreens.ScreenStackHeaderLeftView, {
          key: "left"
        }, /*#__PURE__*/_react.default.createElement(_reactNavigationStack.HeaderBackButton, {
          onPress: goBack,
          pressColorAndroid: options.headerPressColorAndroid,
          tintColor: options.headerTintColor,
          backImage: options.headerBackImage,
          label: options.backButtonTitle,
          truncatedLabel: options.truncatedBackButtonTitle,
          labelVisible: options.backTitleVisible,
          labelStyle: options.headerBackTitleStyle,
          titleLayout: options.layoutPreset // @ts-ignore old props kept for very old version of `react-navigation-stack`
          ,
          title: options.backButtonTitle,
          truncatedTitle: options.truncatedBackButtonTitle,
          backTitleVisible: options.backTitleVisible,
          titleStyle: options.headerBackTitleStyle,
          layoutPreset: options.layoutPreset,
          scene: scene
        })));
      }

      if (options.headerTitle) {
        if (title === undefined && typeof options.headerTitle === 'string') {
          headerOptions.title = options.headerTitle;
        } else {
          children.push( /*#__PURE__*/_react.default.createElement(_reactNativeScreens.ScreenStackHeaderCenterView, {
            key: "center"
          }, renderComponentOrThunk(options.headerTitle, {
            scene
          })));
        }
      }

      if (options.headerRight) {
        children.push( /*#__PURE__*/_react.default.createElement(_reactNativeScreens.ScreenStackHeaderRightView, {
          key: "right"
        }, renderComponentOrThunk(options.headerRight, {
          scene
        })));
      }

      if (children.length > 0) {
        headerOptions.children = children;
      }

      return /*#__PURE__*/_react.default.createElement(_reactNativeScreens.ScreenStackHeaderConfig, headerOptions);
    });

    _defineProperty(this, "maybeRenderNestedStack", (isHeaderInModal, screenProps, route, navigation, SceneComponent, index, descriptor) => {
      if (isHeaderInModal) {
        return /*#__PURE__*/_react.default.createElement(_reactNativeScreens.ScreenStack, {
          style: styles.scenes
        }, /*#__PURE__*/_react.default.createElement(_reactNativeScreens.Screen, {
          style: _reactNative.StyleSheet.absoluteFill
        }, this.renderHeaderConfig(index, route, descriptor), /*#__PURE__*/_react.default.createElement(_reactNavigation.SceneView, {
          screenProps: screenProps,
          navigation: navigation,
          component: SceneComponent
        })));
      }

      return /*#__PURE__*/_react.default.createElement(_reactNavigation.SceneView, {
        screenProps: screenProps,
        navigation: navigation,
        component: SceneComponent
      });
    });

    _defineProperty(this, "renderScene", (index, route, descriptor) => {
      var _this$props$navigatio;

      const {
        navigation,
        getComponent,
        options
      } = descriptor;
      const {
        mode,
        transparentCard
      } = this.props.navigationConfig;
      const SceneComponent = getComponent();
      let stackPresentation = 'push';

      if (options.stackPresentation) {
        stackPresentation = options.stackPresentation;
      } else {
        // this shouldn't be used because we have a prop for that
        if (mode === 'modal' || mode === 'containedModal') {
          stackPresentation = mode;

          if (transparentCard || options.cardTransparent) {
            stackPresentation = mode === 'containedModal' ? 'containedTransparentModal' : 'transparentModal';
          }
        }
      }

      let stackAnimation = options.stackAnimation;

      if (options.animationEnabled === false) {
        stackAnimation = 'none';
      }

      const hasHeader = options.headerShown !== false && ((_this$props$navigatio = this.props.navigationConfig) === null || _this$props$navigatio === void 0 ? void 0 : _this$props$navigatio.headerMode) !== 'none' && options.header !== null;

      if (!didWarn && stackPresentation !== 'push' && options.headerShown !== undefined) {
        didWarn = true;
        console.warn('Be aware that changing the visibility of header in modal on iOS will result in resetting the state of the screen.');
      }

      const isHeaderInModal = isAndroid ? false : stackPresentation !== 'push' && hasHeader && options.headerShown === true;
      const isHeaderInPush = isAndroid ? hasHeader : stackPresentation === 'push' && hasHeader;
      const {
        screenProps
      } = this.props;
      return /*#__PURE__*/_react.default.createElement(_reactNativeScreens.Screen, {
        key: `screen_${route.key}`,
        enabled: true,
        style: [_reactNative.StyleSheet.absoluteFill, options.cardStyle],
        stackAnimation: stackAnimation,
        stackPresentation: stackPresentation,
        replaceAnimation: options.replaceAnimation === undefined ? 'pop' : options.replaceAnimation,
        pointerEvents: index === this.props.navigation.state.routes.length - 1 ? 'auto' : 'none',
        gestureEnabled: _reactNative.Platform.OS === 'android' ? false : options.gestureEnabled === undefined ? true : options.gestureEnabled,
        screenOrientation: options.screenOrientation,
        statusBarAnimation: options.statusBarAnimation,
        statusBarColor: options.statusBarColor,
        statusBarHidden: options.statusBarHidden,
        statusBarStyle: options.statusBarStyle,
        statusBarTranslucent: options.statusBarTranslucent,
        onAppear: () => this.onAppear(route, descriptor),
        onWillAppear: () => {
          var _options$onWillAppear;

          return options === null || options === void 0 ? void 0 : (_options$onWillAppear = options.onWillAppear) === null || _options$onWillAppear === void 0 ? void 0 : _options$onWillAppear.call(options);
        },
        onWillDisappear: () => {
          var _options$onWillDisapp;

          return options === null || options === void 0 ? void 0 : (_options$onWillDisapp = options.onWillDisappear) === null || _options$onWillDisapp === void 0 ? void 0 : _options$onWillDisapp.call(options);
        },
        onDisappear: () => {
          var _options$onDisappear;

          return options === null || options === void 0 ? void 0 : (_options$onDisappear = options.onDisappear) === null || _options$onDisappear === void 0 ? void 0 : _options$onDisappear.call(options);
        },
        onDismissed: e => this.removeScene(route, e.nativeEvent.dismissCount)
      }, isHeaderInPush && this.renderHeaderConfig(index, route, descriptor), this.maybeRenderNestedStack(isHeaderInModal, screenProps, route, navigation, SceneComponent, index, descriptor));
    });
  }

  render() {
    const {
      navigation,
      descriptors
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_reactNativeScreens.ScreenStack, {
      style: styles.scenes,
      onFinishTransitioning: this.onFinishTransitioning
    }, navigation.state.routes.map((route, i) => this.renderScene(i, route, descriptors[route.key])));
  }

}

const styles = _reactNative.StyleSheet.create({
  scenes: {
    flex: 1
  }
});

function createStackNavigator(routeConfigMap, stackConfig = {}) {
  const router = (0, _reactNavigation.StackRouter)(routeConfigMap, stackConfig); // below we override getStateForAction method in order to add handling for
  // a custom native stack navigation action. The action REMOVE that we want to
  // add works in a similar way to POP, but it does not remove all the routes
  // that sit on top of the removed route. For example if we have three routes
  // [a,b,c] and call POP on b, then both b and c will go away. In case we
  // call REMOVE on b, only b will be removed from the stack and the resulting
  // state will be [a, c]

  const superGetStateForAction = router.getStateForAction;

  router.getStateForAction = (action, state) => {
    if (action.type === REMOVE_ACTION) {
      const {
        key,
        immediate,
        dismissCount
      } = action;
      let backRouteIndex = state.index;

      if (key) {
        const backRoute = state.routes.find(route => route.key === key);
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

        return { ...state,
          routes: newRoutes,
          index: newRoutes.length - 1,
          isTransitioning: immediate !== true
        };
      }
    }

    return superGetStateForAction(action, state);
  }; // Create a navigator with StackView as the view


  return (0, _reactNavigation.createNavigator)(StackView, router, stackConfig);
}

var _default = createStackNavigator;
exports.default = _default;
//# sourceMappingURL=createNativeStackNavigator.js.map