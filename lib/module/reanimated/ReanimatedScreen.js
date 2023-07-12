function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import { InnerScreen } from 'react-native-screens';

// @ts-ignore file to be used only if `react-native-reanimated` available in the project
import Animated from 'react-native-reanimated';
const AnimatedScreen = Animated.createAnimatedComponent(InnerScreen);
const ReanimatedScreen = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(AnimatedScreen
  // @ts-ignore some problems with ref and onTransitionProgressReanimated being "fake" prop for parsing of `useEvent` return value
  , _extends({
    ref: ref
  }, props));
});
ReanimatedScreen.displayName = 'ReanimatedScreen';
export default ReanimatedScreen;
//# sourceMappingURL=ReanimatedScreen.js.map