"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _processColor = _interopRequireDefault(require("react-native/Libraries/StyleSheet/processColor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// web implementation is taken from `index.tsx`
const isPlatformSupported = _reactNative.Platform.OS === 'ios' || _reactNative.Platform.OS === 'android';
let ENABLE_SCREENS = isPlatformSupported;

function enableScreens(shouldEnableScreens = true) {
  ENABLE_SCREENS = isPlatformSupported && shouldEnableScreens;

  if (ENABLE_SCREENS && !_reactNative.UIManager.getViewManagerConfig('RNSScreen')) {
    console.error(`Screen native module hasn't been linked. Please check the react-native-screens README for more details`);
  }
} // const that tells if the library should use new implementation, will be undefined for older versions


const shouldUseActivityState = true;

function screensEnabled() {
  return ENABLE_SCREENS;
} // We initialize these lazily so that importing the module doesn't throw error when not linked
// This is necessary coz libraries such as React Navigation import the library where it may not be enabled


let NativeScreenValue;
let NativeScreenContainerValue;
let NativeScreenStack;
let NativeScreenStackHeaderConfig;
let NativeScreenStackHeaderSubview;
let AnimatedNativeScreen;
let NativeSearchBar;
const ScreensNativeModules = {
  get NativeScreen() {
    NativeScreenValue = NativeScreenValue || (0, _reactNative.requireNativeComponent)('RNSScreen');
    return NativeScreenValue;
  },

  get NativeScreenContainer() {
    NativeScreenContainerValue = NativeScreenContainerValue || (0, _reactNative.requireNativeComponent)('RNSScreenContainer');
    return NativeScreenContainerValue;
  },

  get NativeScreenStack() {
    NativeScreenStack = NativeScreenStack || (0, _reactNative.requireNativeComponent)('RNSScreenStack');
    return NativeScreenStack;
  },

  get NativeScreenStackHeaderConfig() {
    NativeScreenStackHeaderConfig = NativeScreenStackHeaderConfig || (0, _reactNative.requireNativeComponent)('RNSScreenStackHeaderConfig');
    return NativeScreenStackHeaderConfig;
  },

  get NativeScreenStackHeaderSubview() {
    NativeScreenStackHeaderSubview = NativeScreenStackHeaderSubview || (0, _reactNative.requireNativeComponent)('RNSScreenStackHeaderSubview');
    return NativeScreenStackHeaderSubview;
  },

  get NativeSearchBar() {
    NativeSearchBar = NativeSearchBar || (0, _reactNative.requireNativeComponent)('RNSSearchBar');
    return NativeSearchBar;
  }

};

class Screen extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "ref", null);

    _defineProperty(this, "setRef", ref => {
      var _this$props$onCompone, _this$props;

      this.ref = ref;
      (_this$props$onCompone = (_this$props = this.props).onComponentRef) === null || _this$props$onCompone === void 0 ? void 0 : _this$props$onCompone.call(_this$props, ref);
    });
  }

  setNativeProps(props) {
    var _this$ref;

    (_this$ref = this.ref) === null || _this$ref === void 0 ? void 0 : _this$ref.setNativeProps(props);
  }

  render() {
    const {
      enabled = ENABLE_SCREENS
    } = this.props;

    if (enabled && isPlatformSupported) {
      AnimatedNativeScreen = AnimatedNativeScreen || _reactNative.Animated.createAnimatedComponent(ScreensNativeModules.NativeScreen);
      let {
        // Filter out active prop in this case because it is unused and
        // can cause problems depending on react-native version:
        // https://github.com/react-navigation/react-navigation/issues/4886
        // same for enabled prop
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        enabled,
        active,
        activityState,
        statusBarColor,
        ...rest
      } = this.props;

      if (active !== undefined && activityState === undefined) {
        console.warn('It appears that you are using old version of react-navigation library. Please update @react-navigation/bottom-tabs, @react-navigation/stack and @react-navigation/drawer to version 5.10.0 or above to take full advantage of new functionality added to react-native-screens');
        activityState = active !== 0 ? 2 : 0; // in the new version, we need one of the screens to have value of 2 after the transition
      }

      const processedColor = (0, _processColor.default)(statusBarColor);
      return /*#__PURE__*/_react.default.createElement(AnimatedNativeScreen, _extends({}, rest, {
        statusBarColor: processedColor,
        activityState: activityState,
        ref: this.setRef
      }));
    } else {
      // same reason as above
      let {
        active,
        activityState,
        style,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        enabled,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onComponentRef,
        ...rest
      } = this.props;

      if (active !== undefined && activityState === undefined) {
        activityState = active !== 0 ? 2 : 0;
      }

      return /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, _extends({
        style: [style, {
          display: activityState !== 0 ? 'flex' : 'none'
        }],
        ref: this.setRef
      }, rest));
    }
  }

}

class ScreenContainer extends _react.default.Component {
  render() {
    const {
      enabled = ENABLE_SCREENS,
      ...rest
    } = this.props;

    if (enabled && isPlatformSupported) {
      return /*#__PURE__*/_react.default.createElement(ScreensNativeModules.NativeScreenContainer, rest);
    }

    return /*#__PURE__*/_react.default.createElement(_reactNative.View, rest);
  }

}

const styles = _reactNative.StyleSheet.create({
  headerSubview: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const ScreenStackHeaderBackButtonImage = props => /*#__PURE__*/_react.default.createElement(ScreensNativeModules.NativeScreenStackHeaderSubview, {
  type: "back",
  style: styles.headerSubview
}, /*#__PURE__*/_react.default.createElement(_reactNative.Image, _extends({
  resizeMode: "center",
  fadeDuration: 0
}, props)));

const ScreenStackHeaderRightView = props => /*#__PURE__*/_react.default.createElement(ScreensNativeModules.NativeScreenStackHeaderSubview, _extends({}, props, {
  type: "right",
  style: styles.headerSubview
}));

const ScreenStackHeaderLeftView = props => /*#__PURE__*/_react.default.createElement(ScreensNativeModules.NativeScreenStackHeaderSubview, _extends({}, props, {
  type: "left",
  style: styles.headerSubview
}));

const ScreenStackHeaderCenterView = props => /*#__PURE__*/_react.default.createElement(ScreensNativeModules.NativeScreenStackHeaderSubview, _extends({}, props, {
  type: "center",
  style: styles.headerSubview
}));

const ScreenStackHeaderSearchBarView = props => /*#__PURE__*/_react.default.createElement(ScreensNativeModules.NativeScreenStackHeaderSubview, _extends({}, props, {
  type: "searchBar",
  style: styles.headerSubview
}));

module.exports = {
  // these are classes so they are not evaluated until used
  // so no need to use getters for them
  Screen,
  ScreenContainer,

  get NativeScreen() {
    return ScreensNativeModules.NativeScreen;
  },

  get NativeScreenContainer() {
    return ScreensNativeModules.NativeScreenContainer;
  },

  get ScreenStack() {
    return ScreensNativeModules.NativeScreenStack;
  },

  get ScreenStackHeaderConfig() {
    return ScreensNativeModules.NativeScreenStackHeaderConfig;
  },

  get ScreenStackHeaderSubview() {
    return ScreensNativeModules.NativeScreenStackHeaderSubview;
  },

  get SearchBar() {
    if (_reactNative.Platform.OS !== 'ios') {
      console.warn('Importing SearchBar is only valid on iOS devices.');
      return _reactNative.View;
    }

    return ScreensNativeModules.NativeSearchBar;
  },

  // these are functions and will not be evaluated until used
  // so no need to use getters for them
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderRightView,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderSearchBarView,
  enableScreens,
  screensEnabled,
  shouldUseActivityState
};
//# sourceMappingURL=index.native.js.map