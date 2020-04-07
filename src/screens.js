import React from 'react';
import {
  Animated,
  requireNativeComponent,
  View,
  UIManager,
  Image,
  StyleSheet,
} from 'react-native';
import { version } from 'react-native/Libraries/Core/ReactNativeVersion';

let ENABLE_SCREENS = false;

// UIManager[`${moduleName}`] is deprecated in RN 0.58 and `getViewManagerConfig` is added.
// We can remove this when we drop support for RN < 0.58.
const getViewManagerConfigCompat = name =>
  typeof UIManager.getViewManagerConfig !== 'undefined'
    ? UIManager.getViewManagerConfig(name)
    : UIManager[name];

function enableScreens(shouldEnableScreens = true) {
  ENABLE_SCREENS = shouldEnableScreens;
  if (ENABLE_SCREENS && !getViewManagerConfigCompat('RNCMScreen')) {
    console.error(
      `Screen native module hasn't been linked. Please check the react-native-screens README for more details`
    );
  }
}

// we should remove this at some point
function useScreens(shouldUseScreens = true) {
  console.warn('Method `useScreens` is deprecated, please use `enableScreens`');
  enableScreens(shouldUseScreens);
}

function screensEnabled() {
  return ENABLE_SCREENS;
}

// We initialize these lazily so that importing the module doesn't throw error when not linked
// This is necessary coz libraries such as React Navigation import the library where it may not be enabled
let NativeScreenValue;
let NativeScreenStack;
// let NativeScreenStackHeaderConfig;
// let NativeScreenStackHeaderSubview;
let AnimatedNativeScreen;

const ScreensNativeModules = {
  get NativeScreen() {
    NativeScreenValue =
      NativeScreenValue || requireNativeComponent('RNCMScreen', null);
    return NativeScreenValue;
  },

  get NativeScreenStack() {
    NativeScreenStack =
      NativeScreenStack || requireNativeComponent('RNCMScreenStack', null);
    return NativeScreenStack;
  },

  // get NativeScreenStackHeaderConfig() {
  //   NativeScreenStackHeaderConfig =
  //     NativeScreenStackHeaderConfig ||
  //     requireNativeComponent('RNCMScreenStackHeaderConfig', null);
  //   return NativeScreenStackHeaderConfig;
  // },
  //
  // get NativeScreenStackHeaderSubview() {
  //   NativeScreenStackHeaderSubview =
  //     NativeScreenStackHeaderSubview ||
  //     requireNativeComponent('RNCMScreenStackHeaderSubview', null);
  //   return NativeScreenStackHeaderSubview;
  // },
};

class Screen extends React.Component {
  setNativeProps(props) {
    this._ref.setNativeProps(props);
  }
  setRef = ref => {
    this._ref = ref;
    this.props.onComponentRef && this.props.onComponentRef(ref);
  };
  render() {
    if (!ENABLE_SCREENS) {
      // Filter out active prop in this case because it is unused and
      // can cause problems depending on react-native version:
      // https://github.com/react-navigation/react-navigation/issues/4886

      /* eslint-disable no-unused-vars */
      const { onComponentRef, ...props } = this.props;

      return <Animated.View {...props} ref={this.setRef} />;
    } else {
      AnimatedNativeScreen =
        AnimatedNativeScreen ||
        Animated.createAnimatedComponent(ScreensNativeModules.NativeScreen);

      // When using RN from master version is 0.0.0
      if (version.minor >= 57 || version.minor === 0) {
        return <AnimatedNativeScreen {...this.props} ref={this.setRef} />;
      } else {
        // On RN version below 0.57 we need to wrap screen's children with an
        // additional View because of a bug fixed in react-native/pull/20658 which
        // was preventing a view from having both styles and some other props being
        // "animated" (using Animated native driver)
        const { style, children, ...rest } = this.props;
        return (
          <AnimatedNativeScreen
            {...rest}
            ref={this.setRef}
            style={StyleSheet.absoluteFill}>
            <Animated.View style={style}>{children}</Animated.View>
          </AnimatedNativeScreen>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  headerSubview: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ScreenStackHeaderBackButtonImage = props => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    type="back"
    style={styles.headerSubview}>
    <Image resizeMode="center" fadeDuration={0} {...props} />
  </ScreensNativeModules.NativeScreenStackHeaderSubview>
);

const ScreenStackHeaderRightView = props => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    {...props}
    type="right"
    style={styles.headerSubview}
  />
);

const ScreenStackHeaderLeftView = props => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    {...props}
    type="left"
    style={styles.headerSubview}
  />
);

const ScreenStackHeaderCenterView = props => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    {...props}
    type="center"
    style={styles.headerSubview}
  />
);

module.exports = {
  Screen,
  get NativeScreen() {
    return ScreensNativeModules.NativeScreen;
  },

  get ScreenStack() {
    return ScreensNativeModules.NativeScreenStack;
  },
  // get ScreenStackHeaderConfig() {
  //   return ScreensNativeModules.NativeScreenStackHeaderConfig;
  // },
  // get ScreenStackHeaderSubview() {
  //   return ScreensNativeModules.NativeScreenStackHeaderSubview;
  // },
  // ScreenStackHeaderBackButtonImage,
  // ScreenStackHeaderRightView,
  // ScreenStackHeaderLeftView,
  // ScreenStackHeaderCenterView,

  enableScreens,
  useScreens,
  screensEnabled,
};
