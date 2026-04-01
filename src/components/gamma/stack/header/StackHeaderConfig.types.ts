import { ReactNode } from 'react';
import { StackHeaderSubviewCollapseModeAndroid } from './StackHeaderSubview.types';

export type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

export type StackHeaderToolbarSubviewAndroid = {
  Component: ReactNode;
};

export type StackHeaderBackgroundSubviewCollapseModeAndroid =
  StackHeaderSubviewCollapseModeAndroid;

export type StackHeaderBackgroundSubviewAndroid = {
  collapseMode?: StackHeaderSubviewCollapseModeAndroid;
  Component: ReactNode;
};

export type StackHeaderConfigProps = {
  type?: StackHeaderTypeAndroid;
  title?: string;
  hidden?: boolean;
  transparent?: boolean;
  backgroundSubview?: StackHeaderBackgroundSubviewAndroid;
  leadingSubview?: StackHeaderToolbarSubviewAndroid;
  centerSubview?: StackHeaderToolbarSubviewAndroid;
  trailingSubview?: StackHeaderToolbarSubviewAndroid;
};
