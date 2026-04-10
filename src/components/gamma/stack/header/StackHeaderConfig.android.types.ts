import { ReactNode } from 'react';
import { StackHeaderSubviewCollapseModeAndroid } from './android/StackHeaderSubview.android.types';

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
}
