import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

export interface ContainedModalProviderProps {
  children?: ViewProps['children'] | undefined;
  /**
   * @summary Style applied to the provider's host view.
   *
   * The provider is a regular, space-filling container whose bounds define the
   * area within which a matched `ContainedModal` is presented, so its size is
   * configurable - unlike `ContainedModal`, whose host is a zero-sized logical anchor.
   *
   * @platform ios
   */
  style?: StyleProp<ViewStyle> | undefined;
  /**
   * @summary Identifies this provider so a `ContainedModal` can target it.
   *
   * A `ContainedModal` is matched to its provider by comparing this
   * `containerId` against the modal's `targetContainerId`. The modal is
   * presented within the bounds of the provider whose `containerId` equals
   * the modal's `targetContainerId`.
   *
   * @platform ios
   */
  containerId: string;
}
