import React from 'react';
import { Animated, View, ViewProps, ImageProps, Image } from 'react-native';
import {
  ScreenProps,
  ScreenContainerProps,
  ScreenStackProps,
  ScreenStackHeaderConfigProps,
  HeaderSubviewTypes,
} from './types';

export * from './types';

let ENABLE_SCREENS = true;

export function enableScreens(shouldEnableScreens = true): void {
  ENABLE_SCREENS = shouldEnableScreens;
}

export function screensEnabled(): boolean {
  return ENABLE_SCREENS;
}

export class NativeScreen extends React.Component<ScreenProps> {
  render(): JSX.Element {
    let { active, activityState, style, enabled = true, ...rest } = this.props;
    if (active !== undefined && activityState === undefined) {
      activityState = active !== 0 ? 2 : 0; // change taken from index.native.tsx
    }
    return (
      <View
        style={[
          style,
          ENABLE_SCREENS && enabled && activityState !== 2
            ? { display: 'none' }
            : null,
        ]}
        {...rest}
      />
    );
  }
}

export const Screen = Animated.createAnimatedComponent(NativeScreen);

export const ScreenContainer: React.ComponentType<ScreenContainerProps> = View;

export const NativeScreenContainer: React.ComponentType<ScreenContainerProps> = View;

export const ScreenStack: React.ComponentType<ScreenStackProps> = View;

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

export const ScreenStackHeaderConfig: React.ComponentType<ScreenStackHeaderConfigProps> = View;

export const ScreenStackHeaderSubview: React.ComponentType<React.PropsWithChildren<
  ViewProps & { type?: HeaderSubviewTypes }
>> = View;

export const shouldUseActivityState = true;
