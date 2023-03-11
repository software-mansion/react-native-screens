import { Route, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Platform } from 'react-native';
import {
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackHeaderSearchBarView,
  SearchBar,
  SearchBarProps,
  isSearchBarAvailableForCurrentPlatform,
  executeNativeBackPress,
} from 'react-native-screens';
import { NativeStackNavigationOptions } from '../types';
import { useBackPressSubscription } from '../utils/useBackPressSubscription';
import { processFonts } from './FontProcessor';

type Props = NativeStackNavigationOptions & {
  route: Route<string>;
};

export default function HeaderConfig({
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
  title,
}: Props): JSX.Element {
  const { colors } = useTheme();
  const tintColor = headerTintColor ?? colors.primary;

  // We need to use back press subscription here to override back button behavior on JS side.
  // Because screens are usually used with react-navigation and this library overrides back button
  // we need to handle it first in case when search bar is open
  const {
    handleAttached,
    handleDetached,
    clearSubscription,
    createSubscription,
  } = useBackPressSubscription({
    onBackPress: executeNativeBackPress,
    isDisabled: !searchBar || !!searchBar.disableBackButtonOverride,
  });

  const [backTitleFontFamily, largeTitleFontFamily, titleFontFamily] =
    processFonts([
      headerBackTitleStyle.fontFamily,
      headerLargeTitleStyle.fontFamily,
      headerTitleStyle.fontFamily,
    ]);

  // We want to clear clearSubscription only when components unmounts or search bar changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => clearSubscription, [searchBar]);

  const processedSearchBarOptions = React.useMemo(() => {
    if (
      Platform.OS === 'android' &&
      searchBar &&
      !searchBar.disableBackButtonOverride
    ) {
      const onFocus: SearchBarProps['onFocus'] = (...args) => {
        createSubscription();
        searchBar.onFocus?.(...args);
      };
      const onClose: SearchBarProps['onClose'] = (...args) => {
        clearSubscription();
        searchBar.onClose?.(...args);
      };

      return { ...searchBar, onFocus, onClose };
    }
    return searchBar;
  }, [searchBar, createSubscription, clearSubscription]);

  return (
    <ScreenStackHeaderConfig
      backButtonInCustomView={backButtonInCustomView}
      backgroundColor={
        headerStyle.backgroundColor ? headerStyle.backgroundColor : colors.card
      }
      backTitle={headerBackTitle}
      backTitleFontFamily={backTitleFontFamily}
      backTitleFontSize={headerBackTitleStyle.fontSize}
      backTitleVisible={headerBackTitleVisible}
      blurEffect={headerStyle.blurEffect}
      color={tintColor}
      direction={direction}
      disableBackButtonMenu={disableBackButtonMenu}
      hidden={headerShown === false}
      hideBackButton={headerHideBackButton}
      hideShadow={headerHideShadow}
      largeTitle={headerLargeTitle}
      largeTitleBackgroundColor={headerLargeStyle.backgroundColor}
      largeTitleColor={headerLargeTitleStyle.color}
      largeTitleFontFamily={largeTitleFontFamily}
      largeTitleFontSize={headerLargeTitleStyle.fontSize}
      largeTitleFontWeight={headerLargeTitleStyle.fontWeight}
      largeTitleHideShadow={headerLargeTitleHideShadow}
      title={
        headerTitle !== undefined
          ? headerTitle
          : title !== undefined
          ? title
          : route.name
      }
      titleColor={
        headerTitleStyle.color !== undefined
          ? headerTitleStyle.color
          : headerTintColor !== undefined
          ? headerTintColor
          : colors.text
      }
      titleFontFamily={titleFontFamily}
      titleFontSize={headerTitleStyle.fontSize}
      titleFontWeight={headerTitleStyle.fontWeight}
      topInsetEnabled={headerTopInsetEnabled}
      translucent={headerTranslucent === true}
      onAttached={handleAttached}
      onDetached={handleDetached}
    >
      {headerRight !== undefined ? (
        <ScreenStackHeaderRightView>
          {headerRight({ tintColor })}
        </ScreenStackHeaderRightView>
      ) : null}
      {backButtonImage !== undefined ? (
        <ScreenStackHeaderBackButtonImage
          key="backImage"
          source={backButtonImage}
        />
      ) : null}
      {headerLeft !== undefined ? (
        <ScreenStackHeaderLeftView>
          {headerLeft({ tintColor })}
        </ScreenStackHeaderLeftView>
      ) : null}
      {headerCenter !== undefined ? (
        <ScreenStackHeaderCenterView>
          {headerCenter({ tintColor })}
        </ScreenStackHeaderCenterView>
      ) : null}
      {isSearchBarAvailableForCurrentPlatform &&
      processedSearchBarOptions !== undefined ? (
        <ScreenStackHeaderSearchBarView>
          <SearchBar {...processedSearchBarOptions} />
        </ScreenStackHeaderSearchBarView>
      ) : null}
    </ScreenStackHeaderConfig>
  );
}
