import { ViewProps } from 'react-native';

export type StackHeaderSubviewTypeAndroid =
  | 'background'
  | 'leading'
  | 'center'
  | 'trailing';

export type StackHeaderSubviewCollapseModeAndroid = 'off' | 'parallax';

export type StackHeaderSubviewProps = {
  children?: ViewProps['children'];

  type?: StackHeaderSubviewTypeAndroid;
  collapseMode?: StackHeaderSubviewCollapseModeAndroid;
};
