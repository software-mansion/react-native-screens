"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NativeStackView;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _AppContainer = _interopRequireDefault(require("react-native/Libraries/ReactNative/AppContainer"));
var _warnOnce = _interopRequireDefault(require("warn-once"));
var _reactNativeScreens = require("react-native-screens");
var _native = require("@react-navigation/native");
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
var _HeaderConfig = _interopRequireDefault(require("./HeaderConfig"));
var _SafeAreaProviderCompat = _interopRequireDefault(require("../utils/SafeAreaProviderCompat"));
var _getDefaultHeaderHeight = _interopRequireDefault(require("../utils/getDefaultHeaderHeight"));
var _HeaderHeightContext = _interopRequireDefault(require("../utils/HeaderHeightContext"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-ignore Getting private component
// eslint-disable-next-line import/no-named-as-default, import/default, import/no-named-as-default-member, import/namespace
const isAndroid = _reactNative.Platform.OS === 'android';
let Container = _reactNative.View;
if (__DEV__) {
  const DebugContainer = props => {
    const {
      stackPresentation,
      ...rest
    } = props;
    if (_reactNative.Platform.OS === 'ios' && stackPresentation !== 'push') {
      return /*#__PURE__*/React.createElement(_AppContainer.default, null, /*#__PURE__*/React.createElement(_reactNative.View, rest));
    }
    return /*#__PURE__*/React.createElement(_reactNative.View, rest);
  };
  // @ts-ignore Wrong props
  Container = DebugContainer;
}
const MaybeNestedStack = _ref => {
  let {
    options,
    route,
    stackPresentation,
    children
  } = _ref;
  const {
    colors
  } = (0, _native.useTheme)();
  const {
    headerShown = true,
    contentStyle
  } = options;
  const Screen = React.useContext(_reactNativeScreens.ScreenContext);
  const isHeaderInModal = isAndroid ? false : stackPresentation !== 'push' && headerShown === true;
  const headerShownPreviousRef = React.useRef(headerShown);
  React.useEffect(() => {
    (0, _warnOnce.default)(!isAndroid && stackPresentation !== 'push' && headerShownPreviousRef.current !== headerShown, `Dynamically changing 'headerShown' in modals will result in remounting the screen and losing all local state. See options for the screen '${route.name}'.`);
    headerShownPreviousRef.current = headerShown;
  }, [headerShown, stackPresentation, route.name]);
  const content = /*#__PURE__*/React.createElement(Container, {
    style: [styles.container, stackPresentation !== 'transparentModal' && stackPresentation !== 'containedTransparentModal' && {
      backgroundColor: colors.background
    }, contentStyle]
    // @ts-ignore Wrong props passed to View
    ,
    stackPresentation: stackPresentation
  }, children);
  const dimensions = (0, _reactNativeSafeAreaContext.useSafeAreaFrame)();
  const topInset = (0, _reactNativeSafeAreaContext.useSafeAreaInsets)().top;
  let statusBarHeight = topInset;
  const hasDynamicIsland = _reactNative.Platform.OS === 'ios' && topInset === 59;
  if (hasDynamicIsland) {
    // On models with Dynamic Island the status bar height is smaller than the safe area top inset.
    statusBarHeight = 54;
  }
  const headerHeight = (0, _getDefaultHeaderHeight.default)(dimensions, statusBarHeight, stackPresentation);
  if (isHeaderInModal) {
    return /*#__PURE__*/React.createElement(_reactNativeScreens.ScreenStack, {
      style: styles.container
    }, /*#__PURE__*/React.createElement(Screen, {
      enabled: true,
      isNativeStack: true,
      style: _reactNative.StyleSheet.absoluteFill
    }, /*#__PURE__*/React.createElement(_HeaderHeightContext.default.Provider, {
      value: headerHeight
    }, /*#__PURE__*/React.createElement(_HeaderConfig.default, _extends({}, options, {
      route: route
    })), content)));
  }
  return content;
};
const RouteView = _ref2 => {
  let {
    descriptors,
    route,
    index,
    navigation,
    stateKey
  } = _ref2;
  const {
    options,
    render: renderScene
  } = descriptors[route.key];
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
    freezeOnBlur
  } = options;
  let {
    customAnimationOnSwipe,
    fullScreenSwipeEnabled,
    gestureResponseDistance,
    stackAnimation,
    stackPresentation = 'push'
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
  const isHeaderInPush = isAndroid ? headerShown : stackPresentation === 'push' && headerShown !== false;
  const dimensions = (0, _reactNativeSafeAreaContext.useSafeAreaFrame)();
  const topInset = (0, _reactNativeSafeAreaContext.useSafeAreaInsets)().top;
  let statusBarHeight = topInset;
  const hasDynamicIsland = _reactNative.Platform.OS === 'ios' && topInset === 59;
  if (hasDynamicIsland) {
    // On models with Dynamic Island the status bar height is smaller than the safe area top inset.
    statusBarHeight = 54;
  }
  const headerHeight = (0, _getDefaultHeaderHeight.default)(dimensions, statusBarHeight, stackPresentation);
  const parentHeaderHeight = React.useContext(_HeaderHeightContext.default);
  const Screen = React.useContext(_reactNativeScreens.ScreenContext);
  const {
    dark
  } = (0, _native.useTheme)();
  return /*#__PURE__*/React.createElement(Screen, {
    key: route.key,
    enabled: true,
    isNativeStack: true,
    style: _reactNative.StyleSheet.absoluteFill,
    sheetAllowedDetents: sheetAllowedDetents,
    sheetLargestUndimmedDetent: sheetLargestUndimmedDetent,
    sheetGrabberVisible: sheetGrabberVisible,
    sheetCornerRadius: sheetCornerRadius,
    sheetExpandsWhenScrolledToEdge: sheetExpandsWhenScrolledToEdge,
    customAnimationOnSwipe: customAnimationOnSwipe,
    freezeOnBlur: freezeOnBlur,
    fullScreenSwipeEnabled: fullScreenSwipeEnabled,
    hideKeyboardOnSwipe: hideKeyboardOnSwipe,
    homeIndicatorHidden: homeIndicatorHidden,
    gestureEnabled: isAndroid ? false : gestureEnabled,
    gestureResponseDistance: gestureResponseDistance,
    nativeBackButtonDismissalEnabled: nativeBackButtonDismissalEnabled,
    navigationBarColor: navigationBarColor,
    navigationBarHidden: navigationBarHidden,
    replaceAnimation: replaceAnimation,
    screenOrientation: screenOrientation,
    stackAnimation: stackAnimation,
    stackPresentation: stackPresentation,
    statusBarAnimation: statusBarAnimation,
    statusBarColor: statusBarColor,
    statusBarHidden: statusBarHidden,
    statusBarStyle: statusBarStyle !== null && statusBarStyle !== void 0 ? statusBarStyle : dark ? 'light' : 'dark',
    statusBarTranslucent: statusBarTranslucent,
    swipeDirection: swipeDirection,
    transitionDuration: transitionDuration,
    onHeaderBackButtonClicked: () => {
      navigation.dispatch({
        ..._native.StackActions.pop(),
        source: route.key,
        target: stateKey
      });
    },
    onWillAppear: () => {
      navigation.emit({
        type: 'transitionStart',
        data: {
          closing: false
        },
        target: route.key
      });
    },
    onWillDisappear: () => {
      navigation.emit({
        type: 'transitionStart',
        data: {
          closing: true
        },
        target: route.key
      });
    },
    onAppear: () => {
      navigation.emit({
        type: 'appear',
        target: route.key
      });
      navigation.emit({
        type: 'transitionEnd',
        data: {
          closing: false
        },
        target: route.key
      });
    },
    onDisappear: () => {
      navigation.emit({
        type: 'transitionEnd',
        data: {
          closing: true
        },
        target: route.key
      });
    },
    onDismissed: e => {
      navigation.emit({
        type: 'dismiss',
        target: route.key
      });
      const dismissCount = e.nativeEvent.dismissCount > 0 ? e.nativeEvent.dismissCount : 1;
      navigation.dispatch({
        ..._native.StackActions.pop(dismissCount),
        source: route.key,
        target: stateKey
      });
    },
    onGestureCancel: () => {
      navigation.emit({
        type: 'gestureCancel',
        target: route.key
      });
    }
  }, /*#__PURE__*/React.createElement(_HeaderHeightContext.default.Provider, {
    value: isHeaderInPush !== false ? headerHeight : parentHeaderHeight !== null && parentHeaderHeight !== void 0 ? parentHeaderHeight : 0
  }, /*#__PURE__*/React.createElement(_HeaderConfig.default, _extends({}, options, {
    route: route,
    headerShown: isHeaderInPush
  })), /*#__PURE__*/React.createElement(MaybeNestedStack, {
    options: options,
    route: route,
    stackPresentation: stackPresentation
  }, renderScene())));
};
function NativeStackViewInner(_ref3) {
  let {
    state,
    navigation,
    descriptors
  } = _ref3;
  const {
    key,
    routes
  } = state;
  return /*#__PURE__*/React.createElement(_reactNativeScreens.ScreenStack, {
    style: styles.container
  }, routes.map((route, index) => /*#__PURE__*/React.createElement(RouteView, {
    key: route.key,
    descriptors: descriptors,
    route: route,
    index: index,
    navigation: navigation,
    stateKey: key
  })));
}
function NativeStackView(props) {
  return /*#__PURE__*/React.createElement(_SafeAreaProviderCompat.default, null, /*#__PURE__*/React.createElement(NativeStackViewInner, props));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=NativeStackView.js.map