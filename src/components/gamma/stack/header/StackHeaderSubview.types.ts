import { ViewProps } from 'react-native';

export type StackHeaderSubviewTypeAndroid = 'left' | 'center' | 'right';

export type StackHeaderSubviewProps = {
  children?: ViewProps['children'];

  type?: StackHeaderSubviewTypeAndroid;
};
