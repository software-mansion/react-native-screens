import { ReactNode } from 'react';
import type { ColorValue } from 'react-native';
import type { StackHeaderSubviewCollapseModeAndroid } from './android/StackHeaderSubview.android.types';
import type { PlatformIconAndroid } from '../../../../types';

export type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

export type StackHeaderBackgroundSubviewCollapseModeAndroid =
  StackHeaderSubviewCollapseModeAndroid;

export interface StackHeaderToolbarSubviewAndroid {
  Component: ReactNode;
}

export interface StackHeaderBackgroundSubviewAndroid {
  collapseMode?: StackHeaderSubviewCollapseModeAndroid;
  Component: ReactNode;
}

export interface StackHeaderConfigPropsAndroid {
  type?: StackHeaderTypeAndroid;
  backgroundSubview?: StackHeaderBackgroundSubviewAndroid;
  leadingSubview?: StackHeaderToolbarSubviewAndroid;
  centerSubview?: StackHeaderToolbarSubviewAndroid;
  trailingSubview?: StackHeaderToolbarSubviewAndroid;
  /**
   * Tint color for the back button icon.
   * - `undefined` — use default tint (for custom images, no tint is applied)
   * - `ColorValue` — apply a custom tint color
   */
  backButtonTintColor?: ColorValue;
  /**
   * Custom icon for the back button.
   * - `undefined` — use the native default back arrow
   * - `PlatformIconAndroid` — use a custom icon (drawableResource or imageSource)
   */
  backButtonIcon?: PlatformIconAndroid;
}
