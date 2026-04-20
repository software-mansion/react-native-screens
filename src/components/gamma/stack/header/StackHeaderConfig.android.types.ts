import { ReactNode } from 'react';
import { StackHeaderSubviewCollapseModeAndroid } from './android/StackHeaderSubview.android.types';

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
}
