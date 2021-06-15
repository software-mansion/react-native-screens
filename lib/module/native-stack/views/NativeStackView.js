function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { StackActions, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native'; // @ts-ignore Getting private component

import AppContainer from 'react-native/Libraries/ReactNative/AppContainer';
import warnOnce from 'warn-once';
import { Screen as ScreenComponent, ScreenStack } from 'react-native-screens';
import HeaderConfig from './HeaderConfig';
const Screen = ScreenComponent;
const isAndroid = Platform.OS === 'android';
let Container = View;

if (__DEV__) {
  const DebugContainer = props => {
    const {
      stackPresentation,
      ...rest
    } = props;

    if (Platform.OS === 'ios' && stackPresentation !== 'push') {
      return /*#__PURE__*/React.createElement(AppContainer, null, /*#__PURE__*/React.createElement(View, rest));
    }

    return /*#__PURE__*/React.createElement(View, rest);
  }; // @ts-ignore Wrong props


  Container = DebugContainer;
}

const MaybeNestedStack = ({
  options,
  route,
  stackPresentation,
  children
}) => {
  const {
    colors
  } = useTheme();
  const {
    headerShown = true,
    contentStyle
  } = options;
  const isHeaderInModal = isAndroid ? false : stackPresentation !== 'push' && headerShown === true;
  const headerShownPreviousRef = React.useRef(headerShown);
  React.useEffect(() => {
    warnOnce(!isAndroid && stackPresentation !== 'push' && headerShownPreviousRef.current !== headerShown, `Dynamically changing 'headerShown' in modals will result in remounting the screen and losing all local state. See options for the screen '${route.name}'.`);
    headerShownPreviousRef.current = headerShown;
  }, [headerShown, stackPresentation, route.name]);
  const content = /*#__PURE__*/React.createElement(Container, {
    style: [styles.container, stackPresentation !== 'transparentModal' && stackPresentation !== 'containedTransparentModal' && {
      backgroundColor: colors.background
    }, contentStyle] // @ts-ignore Wrong props passed to View
    ,
    stackPresentation: stackPresentation
  }, children);

  if (isHeaderInModal) {
    return /*#__PURE__*/React.createElement(ScreenStack, {
      style: styles.container
    }, /*#__PURE__*/React.createElement(Screen, {
      enabled: true,
      style: StyleSheet.absoluteFill
    }, /*#__PURE__*/React.createElement(HeaderConfig, _extends({}, options, {
      route: route
    })), content));
  }

  return content;
};

export default function NativeStackView({
  state,
  navigation,
  descriptors
}) {
  const {
    key,
    routes
  } = state;
  return /*#__PURE__*/React.createElement(ScreenStack, {
    style: styles.container
  }, routes.map((route, index) => {
    const {
      options,
      render: renderScene
    } = descriptors[route.key];
    const {
      gestureEnabled,
      headerShown,
      replaceAnimation = 'pop',
      screenOrientation,
      stackAnimation,
      statusBarAnimation,
      statusBarColor,
      statusBarHidden,
      statusBarStyle,
      statusBarTranslucent
    } = options;
    let {
      stackPresentation = 'push'
    } = options;

    if (index === 0) {
      // first screen should always be treated as `push`, it resolves problems with no header animation
      // for navigator with first screen as `modal` and the next as `push`
      stackPresentation = 'push';
    }

    const isHeaderInPush = isAndroid ? headerShown : stackPresentation === 'push' && headerShown !== false;
    return /*#__PURE__*/React.createElement(Screen, {
      key: route.key,
      enabled: true,
      style: StyleSheet.absoluteFill,
      gestureEnabled: isAndroid ? false : gestureEnabled,
      replaceAnimation: replaceAnimation,
      screenOrientation: screenOrientation,
      stackAnimation: stackAnimation,
      stackPresentation: stackPresentation,
      statusBarAnimation: statusBarAnimation,
      statusBarColor: statusBarColor,
      statusBarHidden: statusBarHidden,
      statusBarStyle: statusBarStyle,
      statusBarTranslucent: statusBarTranslucent,
      onWillAppear: () => {
        navigation.emit({
          type: 'transitionStart',
          data: {
            closing: false
          },
          target: route.key
        });
      },
      onWillDisappear: () => {
        navigation.emit({
          type: 'transitionStart',
          data: {
            closing: true
          },
          target: route.key
        });
      },
      onAppear: () => {
        navigation.emit({
          type: 'appear',
          target: route.key
        });
        navigation.emit({
          type: 'transitionEnd',
          data: {
            closing: false
          },
          target: route.key
        });
      },
      onDisappear: () => {
        navigation.emit({
          type: 'transitionEnd',
          data: {
            closing: true
          },
          target: route.key
        });
      },
      onDismissed: e => {
        navigation.emit({
          type: 'dismiss',
          target: route.key
        });
        const dismissCount = e.nativeEvent.dismissCount > 0 ? e.nativeEvent.dismissCount : 1;
        navigation.dispatch({ ...StackActions.pop(dismissCount),
          source: route.key,
          target: key
        });
      }
    }, /*#__PURE__*/React.createElement(HeaderConfig, _extends({}, options, {
      route: route,
      headerShown: isHeaderInPush
    })), /*#__PURE__*/React.createElement(MaybeNestedStack, {
      options: options,
      route: route,
      stackPresentation: stackPresentation
    }, renderScene()));
  }));
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=NativeStackView.js.map