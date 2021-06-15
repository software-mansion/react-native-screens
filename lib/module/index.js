function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { Animated, View, Image } from 'react-native';
export * from './types';
let ENABLE_SCREENS = true;
export function enableScreens(shouldEnableScreens = true) {
  ENABLE_SCREENS = shouldEnableScreens;
}
export function screensEnabled() {
  return ENABLE_SCREENS;
}
export class NativeScreen extends React.Component {
  render() {
    let {
      active,
      activityState,
      style,
      enabled = ENABLE_SCREENS,
      ...rest
    } = this.props;

    if (enabled) {
      if (active !== undefined && activityState === undefined) {
        activityState = active !== 0 ? 2 : 0; // change taken from index.native.tsx
      }

      return /*#__PURE__*/React.createElement(View // @ts-expect-error: hidden exists on web, but not in React Native
      , _extends({
        hidden: activityState === 0,
        style: [style, {
          display: activityState !== 0 ? 'flex' : 'none'
        }]
      }, rest));
    }

    return /*#__PURE__*/React.createElement(View, rest);
  }

}
export const Screen = Animated.createAnimatedComponent(NativeScreen);
export const ScreenContainer = View;
export const NativeScreenContainer = View;
export const ScreenStack = View;
export const ScreenStackHeaderBackButtonImage = props => /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Image, _extends({
  resizeMode: "center",
  fadeDuration: 0
}, props)));
export const ScreenStackHeaderRightView = props => /*#__PURE__*/React.createElement(View, props);
export const ScreenStackHeaderLeftView = props => /*#__PURE__*/React.createElement(View, props);
export const ScreenStackHeaderCenterView = props => /*#__PURE__*/React.createElement(View, props);
export const ScreenStackHeaderSearchBarView = props => /*#__PURE__*/React.createElement(View, props);
export const ScreenStackHeaderConfig = View; // @ts-expect-error: search bar props have no common props with View

export const SearchBar = View;
export const ScreenStackHeaderSubview = View;
export const shouldUseActivityState = true;
//# sourceMappingURL=index.js.map