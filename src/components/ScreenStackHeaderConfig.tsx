'use client';

import React, { Component, LegacyRef } from 'react';
import {
  HeaderSubviewTypes,
  ScreenStackHeaderConfigProps,
  SearchBarProps,
} from '../types';
import {
  Image,
  ImageProps,
  NativeMethods,
  StyleSheet,
  ViewProps,
} from 'react-native';

// Native components
import ScreenStackHeaderConfigNativeComponent from '../fabric/ScreenStackHeaderConfigNativeComponent';
import ScreenStackHeaderSubviewNativeComponent from '../fabric/ScreenStackHeaderSubviewNativeComponent';

export const ScreenStackHeaderSubview: React.ComponentType<
  React.PropsWithChildren<ViewProps & { type?: HeaderSubviewTypes }>
> = ScreenStackHeaderSubviewNativeComponent as any;

export function ScreenStackHeaderConfig(
  props: ScreenStackHeaderConfigProps,
  ref?: LegacyRef<
    Component<ScreenStackHeaderConfigProps, any, any> & Readonly<NativeMethods>
  >,
): React.JSX.Element {
  return (
    <ScreenStackHeaderConfigNativeComponent
      {...props}
      ref={ref}
      style={styles.headerConfig}
      pointerEvents="box-none"
    />
  );
}

export const ScreenStackHeaderBackButtonImage = (
  props: ImageProps,
): JSX.Element => (
  <ScreenStackHeaderSubview type="back" style={styles.headerSubview}>
    <Image resizeMode="center" fadeDuration={0} {...props} />
  </ScreenStackHeaderSubview>
);

export const ScreenStackHeaderRightView = (
  props: React.PropsWithChildren<ViewProps>,
): JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="right"
      style={[styles.headerSubview, style]}
    />
  );
};

export const ScreenStackHeaderLeftView = (
  props: React.PropsWithChildren<ViewProps>,
): JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="left"
      style={[styles.headerSubview, style]}
    />
  );
};

export const ScreenStackHeaderCenterView = (
  props: React.PropsWithChildren<ViewProps>,
): JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="center"
      style={[styles.headerSubviewCenter, style]}
    />
  );
};

export const ScreenStackHeaderSearchBarView = (
  props: React.PropsWithChildren<SearchBarProps>,
): JSX.Element => (
  <ScreenStackHeaderSubview
    {...props}
    type="searchBar"
    style={styles.headerSubview}
  />
);

const styles = StyleSheet.create({
  headerSubview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubviewCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  headerConfig: {
    position: 'absolute',
    top: '-100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
