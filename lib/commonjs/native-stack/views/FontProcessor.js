"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processFonts = processFonts;
var _ReactNativeStyleAttributes = _interopRequireDefault(require("react-native/Libraries/Components/View/ReactNativeStyleAttributes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-ignore: No declaration available
// eslint-disable-next-line import/no-named-as-default, import/default, import/no-named-as-default-member, import/namespace

function processFonts(fontFamilies) {
  var _ReactNativeStyleAttr;
  // @ts-ignore: React Native types are incorrect here and don't consider fontFamily a style value
  const fontFamilyProcessor = (_ReactNativeStyleAttr = _ReactNativeStyleAttributes.default.fontFamily) === null || _ReactNativeStyleAttr === void 0 ? void 0 : _ReactNativeStyleAttr.process;
  if (typeof fontFamilyProcessor === 'function') {
    return fontFamilies.map(fontFamilyProcessor);
  }
  return fontFamilies;
}
//# sourceMappingURL=FontProcessor.js.map