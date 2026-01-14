import { Image, ImageProps, View, ViewProps } from 'react-native';
import React from 'react';
import { HeaderSubviewTypes, ScreenStackHeaderConfigProps } from '../types';

export const ScreenStackHeaderBackButtonImage = (
  props: ImageProps,
): React.JSX.Element => (
  <View>
    <Image resizeMode="center" fadeDuration={0} {...props} />
  </View>
);

export const ScreenStackHeaderRightView = (
  props: ViewProps,
): React.JSX.Element => <View {...props} />;

export const ScreenStackHeaderLeftView = (
  props: ViewProps,
): React.JSX.Element => <View {...props} />;

export const ScreenStackHeaderCenterView = (
  props: ViewProps,
): React.JSX.Element => <View {...props} />;

export const ScreenStackHeaderSearchBarView = (
  props: ViewProps,
): React.JSX.Element => <View {...props} />;

export const ScreenStackHeaderConfig = (
  props: ScreenStackHeaderConfigProps,
): React.JSX.Element => <View {...props} />;

export const ScreenStackHeaderSubview: React.ComponentType<
  ViewProps & { type?: HeaderSubviewTypes }
> = View;
