import React from 'react';
import {
  Animated,
  requireNativeComponent,
  View,
  UIManager,
  StyleSheet,
} from 'react-native';

let USE_SCREENS = false;

// UIManager[`${moduleName}`] is deprecated in RN 0.58 and `getViewManagerConfig` is added.
// We can remove this when we drop support for RN < 0.58.
const getViewManagerConfigCompat = name =>
  typeof UIManager.getViewManagerConfig !== 'undefined'
    ? UIManager.getViewManagerConfig(name)
    : UIManager[name];

export function useScreens(shouldUseScreens = true) {
  USE_SCREENS = shouldUseScreens;
  if (USE_SCREENS && !getViewManagerConfigCompat('RNSScreen')) {
    console.error(
      `Screen native module hasn't been linked. Please check the react-native-screens README for more details`
    );
  }
}

export function screensEnabled() {
  return USE_SCREENS;
}

export const NativeScreen = requireNativeComponent('RNSScreen', null);

const AnimatedNativeScreen = Animated.createAnimatedComponent(NativeScreen);

export const NativeScreenContainer = requireNativeComponent(
  'RNSScreenContainer',
  null
);

export class Screen extends React.Component {
  setNativeProps(props) {
    this._ref.setNativeProps(props);
  }
  setRef = ref => {
    this._ref = ref;
    this.props.onComponentRef && this.props.onComponentRef(ref);
  };
  render() {
    if (!USE_SCREENS) {
      // Filter out active prop in this case because it is unused and
      // can cause problems depending on react-native version:
      // https://github.com/react-navigation/react-navigation/issues/4886

      /* eslint-disable no-unused-vars */
      const { active, onComponentRef, ...props } = this.props;

      return <Animated.View {...props} ref={this.setRef} />;
    } else {
      return <AnimatedNativeScreen {...this.props} />;
    }
  }
}

export class ScreenContainer extends React.Component {
  render() {
    if (!USE_SCREENS) {
      return <View {...this.props} />;
    } else {
      return <NativeScreenContainer {...this.props} />;
    }
  }
}
