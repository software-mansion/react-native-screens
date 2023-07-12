import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Platform } from 'react-native';
import { ScreenStackHeaderBackButtonImage, ScreenStackHeaderCenterView, ScreenStackHeaderConfig, ScreenStackHeaderLeftView, ScreenStackHeaderRightView, ScreenStackHeaderSearchBarView, SearchBar, isSearchBarAvailableForCurrentPlatform, executeNativeBackPress } from 'react-native-screens';
import { useBackPressSubscription } from '../utils/useBackPressSubscription';
import { processFonts } from './FontProcessor';
export default function HeaderConfig(_ref) {
  let {
    backButtonImage,
    backButtonInCustomView,
    direction,
    disableBackButtonMenu,
    headerBackTitle,
    headerBackTitleStyle = {},
    headerBackTitleVisible = true,
    headerCenter,
    headerHideBackButton,
    headerHideShadow,
    headerLargeStyle = {},
    headerLargeTitle,
    headerLargeTitleHideShadow,
    headerLargeTitleStyle = {},
    headerLeft,
    headerRight,
    headerShown,
    headerStyle = {},
    headerTintColor,
    headerTitle,
    headerTitleStyle = {},
    headerTopInsetEnabled = true,
    headerTranslucent,
    route,
    searchBar,
    title
  } = _ref;
  const {
    colors
  } = useTheme();
  const tintColor = headerTintColor !== null && headerTintColor !== void 0 ? headerTintColor : colors.primary;

  // We need to use back press subscription here to override back button behavior on JS side.
  // Because screens are usually used with react-navigation and this library overrides back button
  // we need to handle it first in case when search bar is open
  const {
    handleAttached,
    handleDetached,
    clearSubscription,
    createSubscription
  } = useBackPressSubscription({
    onBackPress: executeNativeBackPress,
    isDisabled: !searchBar || !!searchBar.disableBackButtonOverride
  });
  const [backTitleFontFamily, largeTitleFontFamily, titleFontFamily] = processFonts([headerBackTitleStyle.fontFamily, headerLargeTitleStyle.fontFamily, headerTitleStyle.fontFamily]);

  // We want to clear clearSubscription only when components unmounts or search bar changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => clearSubscription, [searchBar]);
  const processedSearchBarOptions = React.useMemo(() => {
    if (Platform.OS === 'android' && searchBar && !searchBar.disableBackButtonOverride) {
      const onFocus = function () {
        var _searchBar$onFocus;
        createSubscription();
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        (_searchBar$onFocus = searchBar.onFocus) === null || _searchBar$onFocus === void 0 ? void 0 : _searchBar$onFocus.call(searchBar, ...args);
      };
      const onClose = function () {
        var _searchBar$onClose;
        clearSubscription();
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        (_searchBar$onClose = searchBar.onClose) === null || _searchBar$onClose === void 0 ? void 0 : _searchBar$onClose.call(searchBar, ...args);
      };
      return {
        ...searchBar,
        onFocus,
        onClose
      };
    }
    return searchBar;
  }, [searchBar, createSubscription, clearSubscription]);
  return /*#__PURE__*/React.createElement(ScreenStackHeaderConfig, {
    backButtonInCustomView: backButtonInCustomView,
    backgroundColor: headerStyle.backgroundColor ? headerStyle.backgroundColor : colors.card,
    backTitle: headerBackTitle,
    backTitleFontFamily: backTitleFontFamily,
    backTitleFontSize: headerBackTitleStyle.fontSize,
    backTitleVisible: headerBackTitleVisible,
    blurEffect: headerStyle.blurEffect,
    color: tintColor,
    direction: direction,
    disableBackButtonMenu: disableBackButtonMenu,
    hidden: headerShown === false,
    hideBackButton: headerHideBackButton,
    hideShadow: headerHideShadow,
    largeTitle: headerLargeTitle,
    largeTitleBackgroundColor: headerLargeStyle.backgroundColor,
    largeTitleColor: headerLargeTitleStyle.color,
    largeTitleFontFamily: largeTitleFontFamily,
    largeTitleFontSize: headerLargeTitleStyle.fontSize,
    largeTitleFontWeight: headerLargeTitleStyle.fontWeight,
    largeTitleHideShadow: headerLargeTitleHideShadow,
    title: headerTitle !== undefined ? headerTitle : title !== undefined ? title : route.name,
    titleColor: headerTitleStyle.color !== undefined ? headerTitleStyle.color : headerTintColor !== undefined ? headerTintColor : colors.text,
    titleFontFamily: titleFontFamily,
    titleFontSize: headerTitleStyle.fontSize,
    titleFontWeight: headerTitleStyle.fontWeight,
    topInsetEnabled: headerTopInsetEnabled,
    translucent: headerTranslucent === true,
    onAttached: handleAttached,
    onDetached: handleDetached
  }, headerRight !== undefined ? /*#__PURE__*/React.createElement(ScreenStackHeaderRightView, null, headerRight({
    tintColor
  })) : null, backButtonImage !== undefined ? /*#__PURE__*/React.createElement(ScreenStackHeaderBackButtonImage, {
    key: "backImage",
    source: backButtonImage
  }) : null, headerLeft !== undefined ? /*#__PURE__*/React.createElement(ScreenStackHeaderLeftView, null, headerLeft({
    tintColor
  })) : null, headerCenter !== undefined ? /*#__PURE__*/React.createElement(ScreenStackHeaderCenterView, null, headerCenter({
    tintColor
  })) : null, isSearchBarAvailableForCurrentPlatform && processedSearchBarOptions !== undefined ? /*#__PURE__*/React.createElement(ScreenStackHeaderSearchBarView, null, /*#__PURE__*/React.createElement(SearchBar, processedSearchBarOptions)) : null);
}
//# sourceMappingURL=HeaderConfig.js.map