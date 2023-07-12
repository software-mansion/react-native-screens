"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBackPressSubscription = useBackPressSubscription;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * This hook is an abstraction for keeping back press subscription
 * logic in one place.
 */
function useBackPressSubscription(_ref) {
  let {
    onBackPress,
    isDisabled
  } = _ref;
  const [isActive, setIsActive] = _react.default.useState(false);
  const subscription = _react.default.useRef();
  const clearSubscription = _react.default.useCallback(function () {
    var _subscription$current;
    let shouldSetActive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    (_subscription$current = subscription.current) === null || _subscription$current === void 0 ? void 0 : _subscription$current.remove();
    subscription.current = undefined;
    if (shouldSetActive) setIsActive(false);
  }, []);
  const createSubscription = _react.default.useCallback(() => {
    if (!isDisabled) {
      var _subscription$current2;
      (_subscription$current2 = subscription.current) === null || _subscription$current2 === void 0 ? void 0 : _subscription$current2.remove();
      subscription.current = _reactNative.BackHandler.addEventListener('hardwareBackPress', onBackPress);
      setIsActive(true);
    }
  }, [isDisabled, onBackPress]);
  const handleAttached = _react.default.useCallback(() => {
    if (isActive) {
      createSubscription();
    }
  }, [createSubscription, isActive]);
  const handleDetached = _react.default.useCallback(() => {
    clearSubscription(false);
  }, [clearSubscription]);
  _react.default.useEffect(() => {
    if (isDisabled) {
      clearSubscription();
    }
  }, [isDisabled, clearSubscription]);
  return {
    handleAttached,
    handleDetached,
    createSubscription,
    clearSubscription
  };
}
//# sourceMappingURL=useBackPressSubscription.js.map