import type { ViewProps } from 'react-native';

export interface ContainedModalProps {
  children?: ViewProps['children'] | undefined;
  /**
   * @summary Determines whether the contained modal is currently visible.
   *
   * Presentation is driven by state transitions: updating this property
   * from `false` to `true` triggers the modal to present, while changing
   * it from `true` to `false` triggers a programmatic dismissal.
   *
   * @platform ios
   */
  isOpen: boolean;
  /**
   * @summary Selects which `ContainedModalProvider` this modal is presented in.
   *
   * The modal is matched to a provider by comparing this `targetContainerId`
   * against the provider's `containerId`. The modal is presented within the
   * bounds of the provider whose `containerId` equals this value.
   *
   * @platform ios
   */
  targetContainerId: string;
  /**
   * @summary Determines the presentation context of the contained modal.
   *
   * When `true`, the modal is presented over the current context
   * (`UIModalPresentationOverCurrentContext`), leaving the presenting
   * content visible underneath. When `false`, it is presented within the
   * current context (`UIModalPresentationCurrentContext`), replacing the
   * presenting content.
   *
   * @default true
   * @platform ios
   */
  transparent?: boolean;
}
