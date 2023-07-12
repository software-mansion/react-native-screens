var _global;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import { Platform } from 'react-native';
import { InnerScreen } from 'react-native-screens';

// @ts-ignore file to be used only if `react-native-reanimated` available in the project
import Animated, { useEvent, useSharedValue } from 'react-native-reanimated';
import ReanimatedTransitionProgressContext from './ReanimatedTransitionProgressContext';
const AnimatedScreen = Animated.createAnimatedComponent(InnerScreen);

// We use prop added to global by reanimated since it seems safer than the one from RN. See:
// https://github.com/software-mansion/react-native-reanimated/blob/3fe8b35b05e82b2f2aefda1fb97799cf81e4b7bb/src/reanimated2/UpdateProps.ts#L46
// @ts-expect-error nativeFabricUIManager is not yet included in the RN types
const ENABLE_FABRIC = !!((_global = global) !== null && _global !== void 0 && _global._IS_FABRIC);
const ReanimatedNativeStackScreen = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    children,
    ...rest
  } = props;
  const progress = useSharedValue(0);
  const closing = useSharedValue(0);
  const goingForward = useSharedValue(0);
  return /*#__PURE__*/React.createElement(AnimatedScreen
  // @ts-ignore some problems with ref and onTransitionProgressReanimated being "fake" prop for parsing of `useEvent` return value
  , _extends({
    ref: ref,
    onTransitionProgressReanimated: useEvent(event => {
      'worklet';

      progress.value = event.progress;
      closing.value = event.closing;
      goingForward.value = event.goingForward;
    }, [
    // This should not be necessary, but is not properly managed by `react-native-reanimated`
    // @ts-ignore wrong type
    Platform.OS === 'android' ? 'onTransitionProgress' :
    // for some reason there is a difference in required event name between architectures
    ENABLE_FABRIC ? 'onTransitionProgress' : 'topTransitionProgress'])
  }, rest), /*#__PURE__*/React.createElement(ReanimatedTransitionProgressContext.Provider, {
    value: {
      progress: progress,
      closing: closing,
      goingForward: goingForward
    }
  }, children));
});
ReanimatedNativeStackScreen.displayName = 'ReanimatedNativeStackScreen';
export default ReanimatedNativeStackScreen;
//# sourceMappingURL=ReanimatedNativeStackScreen.js.map