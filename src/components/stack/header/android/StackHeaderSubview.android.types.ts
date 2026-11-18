import { ViewProps } from 'react-native';
import type { StackHeaderBackgroundSubviewCollapseModeAndroid } from '../StackHeaderConfig.android.types';

export type StackHeaderSubviewTypeAndroid =
  | 'background'
  | 'leading'
  | 'center'
  | 'trailing';

export type StackHeaderSubviewProps = {
  children: NonNullable<ViewProps['children']>;

  type?: StackHeaderSubviewTypeAndroid | undefined;
  collapseMode?: StackHeaderBackgroundSubviewCollapseModeAndroid | undefined;
};
