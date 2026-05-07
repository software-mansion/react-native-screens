import { NativeSyntheticEvent, ViewProps } from 'react-native';

export type TabsBottomAccessoryEnvironment = 'regular' | 'inline';

export type TabsBottomAccessoryEnvironmentChangeEvent = {
  environment: TabsBottomAccessoryEnvironment;
};

export type TabsBottomAccessoryProps = ViewProps & {
  onEnvironmentChange?:
    | ((
        event: NativeSyntheticEvent<TabsBottomAccessoryEnvironmentChangeEvent>,
      ) => void)
    | undefined;
};
