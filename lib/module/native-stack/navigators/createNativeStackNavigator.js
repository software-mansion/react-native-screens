function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import { createNavigatorFactory, StackActions, StackRouter, useNavigationBuilder } from '@react-navigation/native';
import * as React from 'react';
import NativeStackView from '../views/NativeStackView';
function NativeStackNavigator(_ref) {
  let {
    initialRouteName,
    children,
    screenOptions,
    ...rest
  } = _ref;
  const {
    state,
    descriptors,
    navigation
  } = useNavigationBuilder(StackRouter, {
    initialRouteName,
    children,
    screenOptions
  });

  // Starting from React Navigation v6, `native-stack` should be imported from
  // `@react-navigation/native-stack` rather than `react-native-screens/native-stack`
  React.useEffect(() => {
    // @ts-ignore navigation.dangerouslyGetParent was removed in v6
    if ((navigation === null || navigation === void 0 ? void 0 : navigation.dangerouslyGetParent) === undefined) {
      console.warn('Looks like you are importing `native-stack` from `react-native-screens/native-stack`. Since version 6 of `react-navigation`, it should be imported from `@react-navigation/native-stack`.');
    }
  }, [navigation]);
  React.useEffect(() => {
    var _addListener, _ref2;
    return (// eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation === null || navigation === void 0 ? void 0 : (_addListener = (_ref2 = navigation).addListener) === null || _addListener === void 0 ? void 0 : _addListener.call(_ref2, 'tabPress', e => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (state.index > 0 && isFocused && !e.defaultPrevented) {
            // When user taps on already focused tab and we're inside the tab,
            // reset the stack to replicate native behaviour
            navigation.dispatch({
              ...StackActions.popToTop(),
              target: state.key
            });
          }
        });
      })
    );
  }, [navigation, state.index, state.key]);
  return /*#__PURE__*/React.createElement(NativeStackView, _extends({}, rest, {
    state: state,
    navigation: navigation,
    descriptors: descriptors
  }));
}
export default createNavigatorFactory(NativeStackNavigator);
//# sourceMappingURL=createNativeStackNavigator.js.map