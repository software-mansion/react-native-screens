'use client';

import React from 'react';
import { ScreenStackHeaderConfigProps } from '../types';
import {
  Image,
  ImageProps,
  Platform,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';

// Native components
import ScreenStackHeaderConfigNativeComponent from '../fabric/ScreenStackHeaderConfigNativeComponent';
import ScreenStackHeaderSubviewNativeComponent, {
  type NativeProps as ScreenStackHeaderSubviewNativeProps,
} from '../fabric/ScreenStackHeaderSubviewNativeComponent';
import { EDGE_TO_EDGE } from './helpers/edge-to-edge';
import HeaderSubviewContentWrapper from './HeaderSubviewContentWrapper';

export const ScreenStackHeaderSubview: React.ComponentType<ScreenStackHeaderSubviewNativeProps> =
  ScreenStackHeaderSubviewNativeComponent;

export const ScreenStackHeaderConfig = React.forwardRef<
  View,
  ScreenStackHeaderConfigProps
>((props, ref) => (
  <ScreenStackHeaderConfigNativeComponent
    {...props}
    ref={ref}
    topInsetEnabled={EDGE_TO_EDGE ? true : props.topInsetEnabled}
    style={styles.headerConfig}
    pointerEvents="box-none"
  />
));

ScreenStackHeaderConfig.displayName = 'ScreenStackHeaderConfig';

export const ScreenStackHeaderBackButtonImage = (
  props: ImageProps,
): JSX.Element => (
  <ScreenStackHeaderSubview type="back" style={styles.headerSubview}>
    <Image resizeMode="center" fadeDuration={0} {...props} />
  </ScreenStackHeaderSubview>
);

export const ScreenStackHeaderRightView = (props: ViewProps): JSX.Element => {
  const { style, children, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="right"
      style={[styles.headerSubview, style]}>
      <HeaderSubviewContentWrapper>{children}</HeaderSubviewContentWrapper>
    </ScreenStackHeaderSubview>
  );
};

export const ScreenStackHeaderLeftView = (props: ViewProps): JSX.Element => {
  const { style, children, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="left"
      style={[styles.headerSubview, style]}>
      <HeaderSubviewContentWrapper>{children}</HeaderSubviewContentWrapper>
    </ScreenStackHeaderSubview>
  );
};

export const ScreenStackHeaderCenterView = (props: ViewProps): JSX.Element => {
  const { style, children, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="center"
      style={[styles.headerSubviewCenter, style]}>
      <HeaderSubviewContentWrapper>{children}</HeaderSubviewContentWrapper>
    </ScreenStackHeaderSubview>
  );
};

export const ScreenStackHeaderSearchBarView = (
  props: ViewProps,
): JSX.Element => (
  <ScreenStackHeaderSubview
    {...props}
    type="searchBar"
    style={styles.headerSubview}>
    <HeaderSubviewContentWrapper>{props.children}</HeaderSubviewContentWrapper>
  </ScreenStackHeaderSubview>
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // We only want to center align the subviews on iOS.
    // See https://github.com/software-mansion/react-native-screens/pull/2456
    alignItems: Platform.OS === 'ios' ? 'center' : undefined,
  },
});
