import { ViewProps } from 'react-native';
import { TabsAccessoryEnvironment } from './TabsAccessory.types';

export type BottomTabsAccessoryContentProps = ViewProps & {
  environment?: TabsAccessoryEnvironment;
};
