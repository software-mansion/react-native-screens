import { ReactNode } from 'react';
import { ColorValue } from 'react-native';
import { StackHeaderSubviewCollapseModeAndroid } from './android/StackHeaderSubview.android.types';
import { PlatformIconAndroid } from '../../../../types';

export type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

export type StackHeaderBackgroundSubviewCollapseModeAndroid =
  StackHeaderSubviewCollapseModeAndroid;

export interface StackHeaderToolbarSubviewAndroid {
  Component: ReactNode;
}

export interface StackHeaderBackgroundSubviewAndroid {
  collapseMode?: StackHeaderSubviewCollapseModeAndroid | undefined;
  Component: ReactNode;
}

export interface StackHeaderConfigPropsAndroid {
  type?: StackHeaderTypeAndroid | undefined;
  backgroundSubview?: StackHeaderBackgroundSubviewAndroid | undefined;
  leadingSubview?: StackHeaderToolbarSubviewAndroid | undefined;
  centerSubview?: StackHeaderToolbarSubviewAndroid | undefined;
  trailingSubview?: StackHeaderToolbarSubviewAndroid | undefined;
  /**
   * Tint color for the back button icon.
   * - `undefined` — use default tint (for custom images, no tint is applied)
   * - `ColorValue` — apply a custom tint color
   */
  backButtonTintColor?: ColorValue | undefined;
  /**
   * Custom icon for the back button.
   * - `undefined` — use the native default back arrow
   * - `PlatformIconAndroid` — use a custom icon (drawableResource or imageSource)
   */
  backButtonIcon?: PlatformIconAndroid | undefined;
}
