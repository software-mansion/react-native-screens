import { NativeSyntheticEvent, ViewProps } from 'react-native';

/**
 * Environment the bottom accessory is laid out in.
 *
 * @remarks
 * The following values are supported:
 * - `'regular'` — the accessory is laid out above the bottom tab bar,
 * - `'inline'` — the accessory is laid out inline with the collapsed bottom
 *   tab bar.
 */
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
