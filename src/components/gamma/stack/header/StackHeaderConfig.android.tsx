import React from 'react';
import { Image, StyleSheet } from 'react-native';
import type { StackHeaderConfigProps } from './StackHeaderConfig.types';
import StackHeaderConfigAndroidNativeComponent from '../../../../fabric/gamma/stack/StackHeaderConfigAndroidNativeComponent';
import type { NativeProps as StackHeaderConfigAndroidNativeComponentProps } from '../../../../fabric/gamma/stack/StackHeaderConfigAndroidNativeComponent';
import StackHeaderSubview from './android/StackHeaderSubview.android';
import type { StackHeaderConfigPropsAndroid } from './StackHeaderConfig.android.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHeaderConfig(props: StackHeaderConfigProps) {
  // ios props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { android, ios, ...baseProps } = props;

  const {
    backgroundSubview,
    leadingSubview,
    centerSubview,
    trailingSubview,
    backButtonIcon,
    ...filteredAndroidProps
  } = android ?? {};

  const backButtonIconProps = parseBackButtonIconToNativeProps(backButtonIcon);

  return (
    <StackHeaderConfigAndroidNativeComponent
      collapsable={false}
      style={StyleSheet.absoluteFill}
      {...baseProps}
      {...filteredAndroidProps}
      {...backButtonIconProps}>
      {/*
        Please note that the order of the subviews MUST match
        the order in native StackHeaderConfig.getConfigSubviewAt.
        */}
      {backgroundSubview && (
        <StackHeaderSubview
          type="background"
          collapseMode={backgroundSubview.collapseMode}>
          {backgroundSubview.Component}
        </StackHeaderSubview>
      )}
      {leadingSubview && (
        <StackHeaderSubview type="leading">
          {leadingSubview.Component}
        </StackHeaderSubview>
      )}
      {centerSubview && (
        <StackHeaderSubview type="center">
          {centerSubview.Component}
        </StackHeaderSubview>
      )}
      {trailingSubview && (
        <StackHeaderSubview type="trailing">
          {trailingSubview.Component}
        </StackHeaderSubview>
      )}
    </StackHeaderConfigAndroidNativeComponent>
  );
}

function parseBackButtonIconToNativeProps(
  icon: StackHeaderConfigPropsAndroid['backButtonIcon'],
): Pick<
  StackHeaderConfigAndroidNativeComponentProps,
  'backButtonImageIconResource' | 'backButtonDrawableIconResourceName'
> {
  if (!icon) {
    return {};
  }

  if (icon.type === 'imageSource') {
    const resolved = Image.resolveAssetSource(icon.imageSource);
    if (!resolved) {
      console.error(
        '[RNScreens] failed to resolve an asset for back button icon',
      );
    }
    return {
      backButtonImageIconResource: resolved || undefined,
    };
  } else if (icon.type === 'drawableResource') {
    return {
      backButtonDrawableIconResourceName: icon.name,
    };
  } else {
    throw new Error(
      '[RNScreens] Incorrect icon format for Android. You must provide `imageSource` or `drawableResource`.',
    );
  }
}

export default StackHeaderConfig;
