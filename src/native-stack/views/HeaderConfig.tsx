import * as React from 'react';
import {
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderConfig,
  ScreenStackHeaderRightView,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderCenterView,
} from 'react-native-screens';
import { Route, useTheme } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '../types';

type Props = NativeStackNavigationOptions & {
  route: Route<string>;
};

export default function HeaderConfig(props: Props) {
  const { colors } = useTheme();
  const {
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
  } = props;

  return (
    <ScreenStackHeaderConfig
      hidden={headerShown === false}
      backButtonInCustomView={backButtonInCustomView}
      translucent={headerTranslucent === true}
      hideShadow={headerHideShadow}
      largeTitleHideShadow={headerLargeTitleHideShadow}
      hideBackButton={headerHideBackButton}
      title={
        headerTitle !== undefined
          ? headerTitle
          : title !== undefined
          ? title
          : route.name
      }
      titleFontFamily={headerTitleStyle.fontFamily}
      titleFontSize={headerTitleStyle.fontSize}
      titleColor={
        headerTitleStyle.color !== undefined
          ? headerTitleStyle.color
          : headerTintColor !== undefined
          ? headerTintColor
          : colors.text
      }
      topInsetEnabled={headerTopInsetEnabled}
      backTitle={headerBackTitleVisible ? headerBackTitle : ' '}
      backTitleFontFamily={headerBackTitleStyle.fontFamily}
      backTitleFontSize={headerBackTitleStyle.fontSize}
      color={headerTintColor !== undefined ? headerTintColor : colors.primary}
      largeTitle={headerLargeTitle}
      largeTitleFontFamily={headerLargeTitleStyle.fontFamily}
      largeTitleFontSize={headerLargeTitleStyle.fontSize}
      largeTitleColor={headerLargeTitleStyle.color}
      backgroundColor={
        headerStyle.backgroundColor !== undefined
          ? headerStyle.backgroundColor
          : colors.card
      }
      largeTitleBackgroundColor={headerLargeStyle.backgroundColor}>
      {headerRight !== undefined ? (
        <ScreenStackHeaderRightView>
          {headerRight({ tintColor: headerTintColor ?? colors.primary })}
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
          {headerLeft({ tintColor: headerTintColor ?? colors.primary })}
        </ScreenStackHeaderLeftView>
      ) : null}
      {headerCenter !== undefined ? (
        <ScreenStackHeaderCenterView>
          {headerCenter({ tintColor: headerTintColor ?? colors.primary })}
        </ScreenStackHeaderCenterView>
      ) : null}
    </ScreenStackHeaderConfig>
  );
}
