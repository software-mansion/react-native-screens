import { NativeSyntheticEvent, ViewProps } from 'react-native';

export type BottomTabsAccessoryEnvironment = 'regular' | 'inline' | 'none';

export type EnvironmentChangeEvent = {
  environment: BottomTabsAccessoryEnvironment;
};

export type BottomTabsAccessoryProps = ViewProps & {
  onEnvironmentChange?: (
    event: NativeSyntheticEvent<EnvironmentChangeEvent>,
  ) => void;
};
