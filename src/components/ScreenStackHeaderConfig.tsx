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
import featureFlags from '../flags';

// Native components
import ScreenStackHeaderConfigNativeComponent from '../fabric/ScreenStackHeaderConfigNativeComponent';
import ScreenStackHeaderSubviewNativeComponent, {
  type NativeProps as ScreenStackHeaderSubviewNativeProps,
} from '../fabric/ScreenStackHeaderSubviewNativeComponent';

export const ScreenStackHeaderSubview: React.ComponentType<ScreenStackHeaderSubviewNativeProps> =
  ScreenStackHeaderSubviewNativeComponent;

export const ScreenStackHeaderConfig = React.forwardRef<
  View,
  ScreenStackHeaderConfigProps
>((props, ref) => (
  <ScreenStackHeaderConfigNativeComponent
    {...props}
    ref={ref}
    style={styles.headerConfig}
    pointerEvents="box-none"
    unstable_synchronousUpdatesEnabled={
      featureFlags.experiment.screenSynchronousStateUpdates
    }
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
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="right"
      unstable_synchronousUpdatesEnabled={
        featureFlags.experiment.screenSynchronousStateUpdates
      }
      style={[styles.headerSubview, style]}
    />
  );
};

export const ScreenStackHeaderLeftView = (props: ViewProps): JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="left"
      unstable_synchronousUpdatesEnabled={
        featureFlags.experiment.screenSynchronousStateUpdates
      }
      style={[styles.headerSubview, style]}
    />
  );
};

export const ScreenStackHeaderCenterView = (props: ViewProps): JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="center"
      unstable_synchronousUpdatesEnabled={
        featureFlags.experiment.screenSynchronousStateUpdates
      }
      style={[styles.headerSubviewCenter, style]}
    />
  );
};

export const ScreenStackHeaderSearchBarView = (
  props: ViewProps,
): JSX.Element => (
  <ScreenStackHeaderSubview
    {...props}
    type="searchBar"
    unstable_synchronousUpdatesEnabled={
      featureFlags.experiment.screenSynchronousStateUpdates
    }
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // We only want to center align the subviews on iOS.
    // See https://github.com/software-mansion/react-native-screens/pull/2456
    alignItems: Platform.OS === 'ios' ? 'center' : undefined,
  },
});
