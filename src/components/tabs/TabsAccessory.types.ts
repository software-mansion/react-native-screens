import { NativeSyntheticEvent, ViewProps } from 'react-native';

export type TabsAccessoryEnvironment = 'regular' | 'inline';

export type EnvironmentChangeEvent = {
  environment: TabsAccessoryEnvironment;
};

export type TabsAccessoryProps = ViewProps & {
  onEnvironmentChange?: (
    event: NativeSyntheticEvent<EnvironmentChangeEvent>,
  ) => void;
};
