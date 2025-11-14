import { ViewProps } from 'react-native';
import { BottomTabsAccessoryEnvironment } from './BottomTabsAccessory.types';

export type BottomTabsAccessoryContentProps = ViewProps & {
  environment?: BottomTabsAccessoryEnvironment;
};
