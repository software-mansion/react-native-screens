import type { ViewProps } from 'react-native';

export interface ContainedModalProps {
  children?: ViewProps['children'] | undefined;
  /**
   * @summary Determines whether the contained modal is currently visible.
   *
   * Presentation is driven by state transitions: updating this property
   * from `false` to `true` triggers the sheet to present, while changing
   * it from `true` to `false` triggers a programmatic dismissal.
   *
   * @platform ios
   */
  isOpen: boolean;
  /**
   * @summary Selects which `ContainedModalProvider` this modal is presented in.
   *
   * The modal is matched to a provider by comparing this `providerKey`
   * against the provider's `providerKey`. The modal is presented within the
   * bounds of the provider whose `providerKey` equals this value.
   *
   * @platform ios
   */
  providerKey: string;
}
