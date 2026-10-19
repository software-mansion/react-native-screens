import type { ViewProps, StyleProp, ViewStyle } from 'react-native';

/**
 * Props for {@link ContainedModalOverContext}.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export interface ContainedModalProps {
  children?: ViewProps['children'] | undefined;

  /**
   * Determines whether the contained modal is currently visible.
   *
   * @remarks
   * Presentation is driven by state transitions: updating this property
   * from `false` to `true` triggers the modal to present, while changing
   * it from `true` to `false` triggers a programmatic dismissal.
   *
   * @platform ios
   * @since 5.0
   */
  isOpen: boolean;

  /**
   * Selects which {@link ContainedModalProvider} this modal is presented in.
   *
   * @remarks
   * By default the modal is presented in the nearest `ContainedModalProvider`
   * above it in the React tree. Set this to the `containerId` of an outer
   * provider to present the modal within that provider's bounds instead.
   *
   * @platform ios
   * @since 5.0
   */
  targetContainerId?: string | undefined;
}

/**
 * Props for {@link ContainedModalProvider}.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export interface ContainedModalProviderProps {
  children?: ViewProps['children'] | undefined;

  /**
   * Style applied to the provider's host view.
   *
   * @remarks
   * The provider is a regular, space-filling container whose bounds define the
   * area within which a matched contained modal is presented, so its size is
   * configurable - unlike the modal components, whose hosts are zero-impact
   * logical anchors.
   *
   * @platform ios
   * @since 5.0
   */
  style?: StyleProp<ViewStyle> | undefined;
}
