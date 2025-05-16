'use client';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue, ViewProps } from 'react-native';
import {
  DirectEventHandler,
  Float,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

// eslint-disable-next-line @typescript-eslint/ban-types
export type GenericEmptyEvent = Readonly<{}>;

export type LifecycleStateChangeEvent = Readonly<{
  previousState: Int32;
  newState: Int32;
}>;

export type TabBarItemAppearance = {
  titleFontSize?: Float;
};

export interface NativeProps extends ViewProps {
  // Events
  onLifecycleStateChange?: DirectEventHandler<LifecycleStateChangeEvent>;
  onWillAppear?: DirectEventHandler<GenericEmptyEvent>;
  onDidAppear?: DirectEventHandler<GenericEmptyEvent>;
  onWillDisappear?: DirectEventHandler<GenericEmptyEvent>;
  onDidDisappear?: DirectEventHandler<GenericEmptyEvent>;

  // Control
  isFocused?: boolean;

  // Appearance
  badgeValue?: string;
  badgeColor?: ColorValue;

  tabBarItemAppearance?: TabBarItemAppearance;

  // General
  title?: string | undefined | null;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabsScreen', {});
