"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ReanimatedScreenProvider;
var _react = _interopRequireDefault(require("react"));
var _reactNativeScreens = require("react-native-screens");
var _ReanimatedNativeStackScreen = _interopRequireDefault(require("./ReanimatedNativeStackScreen"));
var _ReanimatedScreen = _interopRequireDefault(require("./ReanimatedScreen"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ReanimatedScreenWrapper extends _react.default.Component {
  constructor() {
    super(...arguments);
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
    const ReanimatedScreen = this.props.isNativeStack ? _ReanimatedNativeStackScreen.default : _ReanimatedScreen.default;
    return /*#__PURE__*/_react.default.createElement(ReanimatedScreen, _extends({}, this.props, {
      // @ts-ignore some problems with ref
      ref: this.setRef
    }));
  }
}
function ReanimatedScreenProvider(props) {
  return (
    /*#__PURE__*/
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _react.default.createElement(_reactNativeScreens.ScreenContext.Provider, {
      value: ReanimatedScreenWrapper
    }, props.children)
  );
}
//# sourceMappingURL=ReanimatedScreenProvider.js.map