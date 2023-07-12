"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNativeScreens = require("react-native-screens");
var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-ignore file to be used only if `react-native-reanimated` available in the project
const AnimatedScreen = _reactNativeReanimated.default.createAnimatedComponent(_reactNativeScreens.InnerScreen);
const ReanimatedScreen = /*#__PURE__*/_react.default.forwardRef((props, ref) => {
  return /*#__PURE__*/_react.default.createElement(AnimatedScreen
  // @ts-ignore some problems with ref and onTransitionProgressReanimated being "fake" prop for parsing of `useEvent` return value
  , _extends({
    ref: ref
  }, props));
});
ReanimatedScreen.displayName = 'ReanimatedScreen';
var _default = ReanimatedScreen;
exports.default = _default;
//# sourceMappingURL=ReanimatedScreen.js.map