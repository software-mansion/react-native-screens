import { ViewProps } from 'react-native';
import { TabsAccessoryEnvironment } from './TabsAccessory.types';

export type TabsAccessoryContentProps = ViewProps & {
  environment?: TabsAccessoryEnvironment;
};
