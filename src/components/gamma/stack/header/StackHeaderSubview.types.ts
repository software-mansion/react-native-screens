import { ViewProps } from 'react-native';

export type StackHeaderSubviewTypeAndroid =
  | 'left'
  | 'center'
  | 'right'
  | 'background';

export type StackHeaderSubviewBackgroundCollapseModeAndroid =
  | 'off'
  | 'pin'
  | 'parallax';

export type StackHeaderSubviewProps = {
  children?: ViewProps['children'];

  type?: StackHeaderSubviewTypeAndroid;
  collapseMode?: StackHeaderSubviewBackgroundCollapseModeAndroid;
};
