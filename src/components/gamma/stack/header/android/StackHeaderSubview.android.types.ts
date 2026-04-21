import { ViewProps } from 'react-native';

export type StackHeaderSubviewTypeAndroid =
  | 'background'
  | 'leading'
  | 'center'
  | 'trailing';

export type StackHeaderSubviewCollapseModeAndroid = 'off' | 'parallax';

export type StackHeaderSubviewProps = {
  children: NonNullable<ViewProps['children']>;

  type?: StackHeaderSubviewTypeAndroid | undefined;
  collapseMode?: StackHeaderSubviewCollapseModeAndroid | undefined;
};
