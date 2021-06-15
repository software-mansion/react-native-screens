// @ts-ignore: No declaration available
import ReactNativeStyleAttributes from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
export function processFonts(fontFamilies) {
  var _ReactNativeStyleAttr;

  // @ts-ignore: React Native types are incorrect here and don't consider fontFamily a style value
  const fontFamilyProcessor = (_ReactNativeStyleAttr = ReactNativeStyleAttributes.fontFamily) === null || _ReactNativeStyleAttr === void 0 ? void 0 : _ReactNativeStyleAttr.process;

  if (typeof fontFamilyProcessor === 'function') {
    return fontFamilies.map(fontFamilyProcessor);
  }

  return fontFamilies;
}
//# sourceMappingURL=FontProcessor.js.map