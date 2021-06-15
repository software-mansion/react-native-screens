"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NativeStackView;

var _native = require("@react-navigation/native");

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _AppContainer = _interopRequireDefault(require("react-native/Libraries/ReactNative/AppContainer"));

var _warnOnce = _interopRequireDefault(require("warn-once"));

var _reactNativeScreens = require("react-native-screens");

var _HeaderConfig = _interopRequireDefault(require("./HeaderConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Screen = _reactNativeScreens.Screen;
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
  }; // @ts-ignore Wrong props


  Container = DebugContainer;
}

const MaybeNestedStack = ({
  options,
  route,
  stackPresentation,
  children
}) => {
  const {
    colors
  } = (0, _native.useTheme)();
  const {
    headerShown = true,
    contentStyle
  } = options;
  const isHeaderInModal = isAndroid ? false : stackPresentation !== 'push' && headerShown === true;
  const headerShownPreviousRef = React.useRef(headerShown);
  React.useEffect(() => {
    (0, _warnOnce.default)(!isAndroid && stackPresentation !== 'push' && headerShownPreviousRef.current !== headerShown, `Dynamically changing 'headerShown' in modals will result in remounting the screen and losing all local state. See options for the screen '${route.name}'.`);
    headerShownPreviousRef.current = headerShown;
  }, [headerShown, stackPresentation, route.name]);
  const content = /*#__PURE__*/React.createElement(Container, {
    style: [styles.container, stackPresentation !== 'transparentModal' && stackPresentation !== 'containedTransparentModal' && {
      backgroundColor: colors.background
    }, contentStyle] // @ts-ignore Wrong props passed to View
    ,
    stackPresentation: stackPresentation
  }, children);

  if (isHeaderInModal) {
    return /*#__PURE__*/React.createElement(_reactNativeScreens.ScreenStack, {
      style: styles.container
    }, /*#__PURE__*/React.createElement(Screen, {
      enabled: true,
      style: _reactNative.StyleSheet.absoluteFill
    }, /*#__PURE__*/React.createElement(_HeaderConfig.default, _extends({}, options, {
      route: route
    })), content));
  }

  return content;
};

function NativeStackView({
  state,
  navigation,
  descriptors
}) {
  const {
    key,
    routes
  } = state;
  return /*#__PURE__*/React.createElement(_reactNativeScreens.ScreenStack, {
    style: styles.container
  }, routes.map((route, index) => {
    const {
      options,
      render: renderScene
    } = descriptors[route.key];
    const {
      gestureEnabled,
      headerShown,
      replaceAnimation = 'pop',
      screenOrientation,
      stackAnimation,
      statusBarAnimation,
      statusBarColor,
      statusBarHidden,
      statusBarStyle,
      statusBarTranslucent
    } = options;
    let {
      stackPresentation = 'push'
    } = options;

    if (index === 0) {
      // first screen should always be treated as `push`, it resolves problems with no header animation
      // for navigator with first screen as `modal` and the next as `push`
      stackPresentation = 'push';
    }

    const isHeaderInPush = isAndroid ? headerShown : stackPresentation === 'push' && headerShown !== false;
    return /*#__PURE__*/React.createElement(Screen, {
      key: route.key,
      enabled: true,
      style: _reactNative.StyleSheet.absoluteFill,
      gestureEnabled: isAndroid ? false : gestureEnabled,
      replaceAnimation: replaceAnimation,
      screenOrientation: screenOrientation,
      stackAnimation: stackAnimation,
      stackPresentation: stackPresentation,
      statusBarAnimation: statusBarAnimation,
      statusBarColor: statusBarColor,
      statusBarHidden: statusBarHidden,
      statusBarStyle: statusBarStyle,
      statusBarTranslucent: statusBarTranslucent,
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
        navigation.dispatch({ ..._native.StackActions.pop(dismissCount),
          source: route.key,
          target: key
        });
      }
    }, /*#__PURE__*/React.createElement(_HeaderConfig.default, _extends({}, options, {
      route: route,
      headerShown: isHeaderInPush
    })), /*#__PURE__*/React.createElement(MaybeNestedStack, {
      options: options,
      route: route,
      stackPresentation: stackPresentation
    }, renderScene()));
  }));
}

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=NativeStackView.js.map