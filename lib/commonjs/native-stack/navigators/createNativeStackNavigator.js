"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _native = require("@react-navigation/native");

var React = _interopRequireWildcard(require("react"));

var _NativeStackView = _interopRequireDefault(require("../views/NativeStackView"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function NativeStackNavigator({
  initialRouteName,
  children,
  screenOptions,
  ...rest
}) {
  const {
    state,
    descriptors,
    navigation
  } = (0, _native.useNavigationBuilder)(_native.StackRouter, {
    initialRouteName,
    children,
    screenOptions
  });
  React.useEffect(() => {
    var _navigation$addListen;

    return navigation === null || navigation === void 0 ? void 0 : (_navigation$addListen = navigation.addListener) === null || _navigation$addListen === void 0 ? void 0 : _navigation$addListen.call(navigation, 'tabPress', e => {
      const isFocused = navigation.isFocused(); // Run the operation in the next frame so we're sure all listeners have been run
      // This is necessary to know if preventDefault() has been called

      requestAnimationFrame(() => {
        if (state.index > 0 && isFocused && !e.defaultPrevented) {
          // When user taps on already focused tab and we're inside the tab,
          // reset the stack to replicate native behaviour
          navigation.dispatch({ ..._native.StackActions.popToTop(),
            target: state.key
          });
        }
      });
    });
  }, [navigation, state.index, state.key]);
  return /*#__PURE__*/React.createElement(_NativeStackView.default, _extends({}, rest, {
    state: state,
    navigation: navigation,
    descriptors: descriptors
  }));
}

var _default = (0, _native.createNavigatorFactory)(NativeStackNavigator);

exports.default = _default;
//# sourceMappingURL=createNativeStackNavigator.js.map