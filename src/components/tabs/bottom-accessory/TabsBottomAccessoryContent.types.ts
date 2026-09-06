import { ViewProps } from 'react-native';
import { TabsBottomAccessoryEnvironment } from './TabsBottomAccessory.types';

export type TabsBottomAccessoryContentProps = ViewProps & {
  environment?: TabsBottomAccessoryEnvironment | undefined;
};
