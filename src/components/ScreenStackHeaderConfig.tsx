import React from 'react';
import {
  HeaderSubviewTypes,
  ScreenStackHeaderConfigProps,
  SearchBarProps,
} from 'react-native-screens';
import { Image, ImageProps, StyleSheet, ViewProps } from 'react-native';

import ScreenStackHeaderConfigNativeComponent from '../fabric/ScreenStackHeaderConfigNativeComponent';
import ScreenStackHeaderSubviewNativeComponent from '../fabric/ScreenStackHeaderSubviewNativeComponent';

export const NativeScreenStackHeaderConfig: React.ComponentType<ScreenStackHeaderConfigProps> =
  ScreenStackHeaderConfigNativeComponent as any;
export const NativeScreenStackHeaderSubview: React.ComponentType<
  React.PropsWithChildren<ViewProps & { type?: HeaderSubviewTypes }>
> = ScreenStackHeaderSubviewNativeComponent as any;

export const ScreenStackHeaderBackButtonImage = (
  props: ImageProps
): JSX.Element => (
  <NativeScreenStackHeaderSubview type="back" style={styles.headerSubview}>
    <Image resizeMode="center" fadeDuration={0} {...props} />
  </NativeScreenStackHeaderSubview>
);

export const ScreenStackHeaderRightView = (
  props: React.PropsWithChildren<ViewProps>
): JSX.Element => (
  <NativeScreenStackHeaderSubview
    {...props}
    type="right"
    style={styles.headerSubview}
  />
);

export const ScreenStackHeaderLeftView = (
  props: React.PropsWithChildren<ViewProps>
): JSX.Element => (
  <NativeScreenStackHeaderSubview
    {...props}
    type="left"
    style={styles.headerSubview}
  />
);

export const ScreenStackHeaderCenterView = (
  props: React.PropsWithChildren<ViewProps>
): JSX.Element => (
  <NativeScreenStackHeaderSubview
    {...props}
    type="center"
    style={styles.headerSubview}
  />
);

export const ScreenStackHeaderSearchBarView = (
  props: React.PropsWithChildren<SearchBarProps>
): JSX.Element => (
  <NativeScreenStackHeaderSubview
    {...props}
    type="searchBar"
    style={styles.headerSubview}
  />
);

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
