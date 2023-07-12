"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SafeAreaProviderCompat;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// code taken from
// https://github.com/react-navigation/react-navigation/blob/ec0d113eb25c39ef9defb6c7215640f44e3569ae/packages/elements/src/SafeAreaProviderCompat.tsx

const {
  width = 0,
  height = 0
} = _reactNative.Dimensions.get('window');

// To support SSR on web, we need to have empty insets for initial values
// Otherwise there can be mismatch between SSR and client output
// We also need to specify empty values to support tests environments
const initialMetrics = _reactNative.Platform.OS === 'web' || _reactNativeSafeAreaContext.initialWindowMetrics == null ? {
  frame: {
    x: 0,
    y: 0,
    width,
    height
  },
  insets: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
} : _reactNativeSafeAreaContext.initialWindowMetrics;
function SafeAreaProviderCompat(_ref) {
  let {
    children,
    style
  } = _ref;
  return /*#__PURE__*/React.createElement(_reactNativeSafeAreaContext.SafeAreaInsetsContext.Consumer, null, insets => {
    if (insets) {
      // If we already have insets, don't wrap the stack in another safe area provider
      // This avoids an issue with updates at the cost of potentially incorrect values
      // https://github.com/react-navigation/react-navigation/issues/174
      return /*#__PURE__*/React.createElement(_reactNative.View, {
        style: [styles.container, style]
      }, children);
    }
    return /*#__PURE__*/React.createElement(_reactNativeSafeAreaContext.SafeAreaProvider, {
      initialMetrics: initialMetrics,
      style: style
    }, children);
  });
}
SafeAreaProviderCompat.initialMetrics = initialMetrics;
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=SafeAreaProviderCompat.js.map