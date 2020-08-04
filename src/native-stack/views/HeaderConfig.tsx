import { Route, useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
} from 'react-native-screens';
import { NativeStackNavigationOptions } from '../types';

type Props = NativeStackNavigationOptions & {
  route: Route<string>;
};

export default function HeaderConfig({
  route,
  title,
  headerRight,
  headerLeft,
  headerCenter,
  headerTitle,
  headerBackTitle,
  headerBackTitleVisible = true,
  backButtonImage,
  headerHideBackButton,
  headerHideShadow,
  headerLargeTitleHideShadow,
  headerTintColor,
  headerTopInsetEnabled = true,
  headerLargeTitle,
  headerTranslucent,
  headerStyle = {},
  headerLargeStyle = {},
  headerTitleStyle = {},
  headerLargeTitleStyle = {},
  headerBackTitleStyle = {},
  headerShown,
  backButtonInCustomView,
}: Props) {
  const { colors } = useTheme();
  const tintColor = headerTintColor ?? colors.primary;

  return (
    <ScreenStackHeaderConfig
      backButtonInCustomView={backButtonInCustomView}
      backgroundColor={
        headerStyle.backgroundColor ? headerStyle.backgroundColor : colors.card
      }
      backTitle={headerBackTitleVisible ? headerBackTitle : ' '}
      backTitleFontFamily={headerBackTitleStyle.fontFamily}
      backTitleFontSize={headerBackTitleStyle.fontSize}
      blurEffect={headerStyle.blurEffect}
      color={tintColor}
      hidden={!headerShown}
      hideBackButton={headerHideBackButton}
      hideShadow={headerHideShadow}
      largeTitle={headerLargeTitle}
      largeTitleBackgroundColor={headerLargeStyle.backgroundColor}
      largeTitleColor={headerLargeTitleStyle.color}
      largeTitleFontFamily={headerLargeTitleStyle.fontFamily}
      largeTitleFontSize={headerLargeTitleStyle.fontSize}
      largeTitleHideShadow={headerLargeTitleHideShadow}
      title={headerTitle || title || route.name}
      titleColor={
        headerTitleStyle.color
          ? headerTitleStyle.color
          : headerTintColor || colors.text
      }
      titleFontFamily={headerTitleStyle.fontFamily}
      titleFontSize={headerTitleStyle.fontSize}
      topInsetEnabled={headerTopInsetEnabled}
      translucent={headerTranslucent}>
      {headerRight ? (
        <ScreenStackHeaderRightView>
          {headerRight({ tintColor })}
        </ScreenStackHeaderRightView>
      ) : null}
      {backButtonImage ? (
        <ScreenStackHeaderBackButtonImage
          key="backImage"
          source={backButtonImage}
        />
      ) : null}
      {headerLeft ? (
        <ScreenStackHeaderLeftView>
          {headerLeft({ tintColor })}
        </ScreenStackHeaderLeftView>
      ) : null}
      {headerCenter ? (
        <ScreenStackHeaderCenterView>
          {headerCenter({ tintColor })}
        </ScreenStackHeaderCenterView>
      ) : null}
    </ScreenStackHeaderConfig>
  );
}
