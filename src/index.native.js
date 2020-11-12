import React from 'react';
import {
  Animated,
  Image,
  requireNativeComponent,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';

let ENABLE_SCREENS = false;

function enableScreens(shouldEnableScreens = true) {
  ENABLE_SCREENS = shouldEnableScreens;
  if (ENABLE_SCREENS && !UIManager.getViewManagerConfig('RNSScreen')) {
    console.error(
      `Screen native module hasn't been linked. Please check the react-native-screens README for more details`
    );
  }
}

// const that tells if the library should use new implementation, will be undefined for older versions
const shouldUseActivityState = true;

function screensEnabled() {
  return ENABLE_SCREENS;
}

// We initialize these lazily so that importing the module doesn't throw error when not linked
// This is necessary coz libraries such as React Navigation import the library where it may not be enabled
let NativeScreenValue;
let NativeScreenContainerValue;
let NativeScreenStack;
let NativeScreenStackHeaderConfig;
let NativeScreenStackHeaderSubview;
let AnimatedNativeScreen;

const ScreensNativeModules = {
  get NativeScreen() {
    NativeScreenValue =
      NativeScreenValue || requireNativeComponent('RNSScreen', null);
    return NativeScreenValue;
  },

  get NativeScreenContainer() {
    NativeScreenContainerValue =
      NativeScreenContainerValue ||
      requireNativeComponent('RNSScreenContainer', null);
    return NativeScreenContainerValue;
  },

  get NativeScreenStack() {
    NativeScreenStack =
      NativeScreenStack || requireNativeComponent('RNSScreenStack', null);
    return NativeScreenStack;
  },

  get NativeScreenStackHeaderConfig() {
    NativeScreenStackHeaderConfig =
      NativeScreenStackHeaderConfig ||
      requireNativeComponent('RNSScreenStackHeaderConfig', null);
    return NativeScreenStackHeaderConfig;
  },

  get NativeScreenStackHeaderSubview() {
    NativeScreenStackHeaderSubview =
      NativeScreenStackHeaderSubview ||
      requireNativeComponent('RNSScreenStackHeaderSubview', null);
    return NativeScreenStackHeaderSubview;
  },
};

class Screen extends React.Component {
  setNativeProps(props) {
    this._ref.setNativeProps(props);
  }

  setRef = (ref) => {
    this._ref = ref;
    this.props.onComponentRef && this.props.onComponentRef(ref);
  };

  render() {
    const { enabled = true } = this.props;

    if (!ENABLE_SCREENS || !enabled) {
      // Filter out active prop in this case because it is unused and
      // can cause problems depending on react-native version:
      // https://github.com/react-navigation/react-navigation/issues/4886

      /* eslint-disable no-unused-vars */
      const { active, enabled, onComponentRef, ...rest } = this.props;

      return <Animated.View {...rest} ref={this.setRef} />;
    } else {
      AnimatedNativeScreen =
        AnimatedNativeScreen ||
        Animated.createAnimatedComponent(ScreensNativeModules.NativeScreen);

      let { enabled, active, activityState, ...rest } = this.props;
      if (active !== undefined && activityState === undefined) {
        console.warn(
          'It appears that you are using old version of react-navigation library. Please update @react-navigation/bottom-tabs, @react-navigation/stack and @react-navigation/drawer to version 5.10.0 or above to take full advantage of new functionality added to react-native-screens'
        );
        activityState = active !== 0 ? 2 : 0; // in the new version, we need one of the screens to have value of 2 after the transition
      }
      return (
        <AnimatedNativeScreen
          {...rest}
          activityState={activityState}
          ref={this.setRef}
        />
      );
    }
  }
}

class ScreenContainer extends React.Component {
  render() {
    const { enabled = true, ...rest } = this.props;

    if (!ENABLE_SCREENS || !enabled) {
      return <View {...rest} />;
    } else {
      return <ScreensNativeModules.NativeScreenContainer {...this.props} />;
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

const ScreenStackHeaderBackButtonImage = (props) => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    type="back"
    style={styles.headerSubview}>
    <Image resizeMode="center" fadeDuration={0} {...props} />
  </ScreensNativeModules.NativeScreenStackHeaderSubview>
);

const ScreenStackHeaderRightView = (props) => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    {...props}
    type="right"
    style={styles.headerSubview}
  />
);

const ScreenStackHeaderLeftView = (props) => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    {...props}
    type="left"
    style={styles.headerSubview}
  />
);

const ScreenStackHeaderCenterView = (props) => (
  <ScreensNativeModules.NativeScreenStackHeaderSubview
    {...props}
    type="center"
    style={styles.headerSubview}
  />
);

module.exports = {
  ScreenContainer,
  Screen,
  get NativeScreen() {
    return ScreensNativeModules.NativeScreen;
  },

  get NativeScreenContainer() {
    return ScreensNativeModules.NativeScreenContainer;
  },

  get ScreenStack() {
    return ScreensNativeModules.NativeScreenStack;
  },
  get ScreenStackHeaderConfig() {
    return ScreensNativeModules.NativeScreenStackHeaderConfig;
  },
  get ScreenStackHeaderSubview() {
    return ScreensNativeModules.NativeScreenStackHeaderSubview;
  },
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderRightView,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderCenterView,

  enableScreens,
  screensEnabled,
  shouldUseActivityState,
};
