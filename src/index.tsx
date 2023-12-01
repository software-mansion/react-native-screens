import React, { ReactNode } from 'react';
import { Animated, View, ViewProps, ImageProps, Image } from 'react-native';
import {
  ScreenProps,
  ScreenContainerProps,
  ScreenStackProps,
  ScreenStackHeaderConfigProps,
  HeaderSubviewTypes,
  SearchBarProps,
} from './types';

import { screensEnabled } from './core';

export * from './types';

export {
  enableScreens,
  enableFreeze,
  screensEnabled,
  freezeEnabled,
  shouldUseActivityState,
} from './core';

export { default as useTransitionProgress } from './useTransitionProgress';
export {
  isSearchBarAvailableForCurrentPlatform,
  isNewBackTitleImplementation,
  executeNativeBackPress,
} from './utils';

const NativeScreen = (props: ScreenProps) => {
  let {
    active,
    activityState,
    style,
    enabled = screensEnabled(),
    ...rest
  } = props;

  if (enabled) {
    if (active !== undefined && activityState === undefined) {
      activityState = active !== 0 ? 2 : 0; // change taken from index.native.tsx
    }
    return (
      <View
        // @ts-expect-error: hidden exists on web, but not in React Native
        hidden={activityState === 0}
        style={[style, { display: activityState !== 0 ? 'flex' : 'none' }]}
        {...rest}
      />
    );
  }

  return <View {...rest} />;
};

export const Screen = Animated.createAnimatedComponent(NativeScreen);

export const InnerScreen = View;

export const ScreenContext = React.createContext(Screen);

export const ScreenContainer: React.ComponentType<ScreenContainerProps> = View;

export const NativeScreenContainer: React.ComponentType<ScreenContainerProps> =
  View;

export const NativeScreenNavigationContainer: React.ComponentType<ScreenContainerProps> =
  View;

export const ScreenStack: React.ComponentType<ScreenStackProps> = View;

export const FullWindowOverlay = View as React.ComponentType<{
  children: ReactNode;
}>;

export const ScreenStackHeaderBackButtonImage = (
  props: ImageProps
): JSX.Element => (
  <View>
    <Image resizeMode="center" fadeDuration={0} {...props} />
  </View>
);

export const ScreenStackHeaderRightView = (
  props: React.PropsWithChildren<ViewProps>
): JSX.Element => <View {...props} />;

export const ScreenStackHeaderLeftView = (
  props: React.PropsWithChildren<ViewProps>
): JSX.Element => <View {...props} />;

export const ScreenStackHeaderCenterView = (
  props: React.PropsWithChildren<ViewProps>
): JSX.Element => <View {...props} />;

export const ScreenStackHeaderSearchBarView = (
  props: React.PropsWithChildren<Omit<SearchBarProps, 'ref'>>
): JSX.Element => <View {...props} />;

export const ScreenStackHeaderConfig = (
  props: React.PropsWithChildren<ScreenStackHeaderConfigProps>
): JSX.Element => <View {...props} />;

// @ts-expect-error: search bar props have no common props with View
export const SearchBar: React.ComponentType<SearchBarProps> = View;

export const ScreenStackHeaderSubview: React.ComponentType<
  React.PropsWithChildren<ViewProps & { type?: HeaderSubviewTypes }>
> = View;
