import { ViewProps } from 'react-native';

export type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

export type StackHeaderConfigurationProps = {
  children?: ViewProps['children'];

  type?: StackHeaderTypeAndroid;
  title?: string;
  hidden?: boolean;
  transparent?: boolean;
};
