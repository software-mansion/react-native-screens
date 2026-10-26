import type { ViewProps, StyleProp, ViewStyle } from 'react-native';

/**
 * Props for {@link ContainedModalOverContent}.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export interface ContainedModalProps {
  children?: ViewProps['children'] | undefined;

  /**
   * Requests the modal to be presented (`true`) or dismissed (`false`).
   *
   * @remarks
   * `true` expresses intent, not a guarantee of visibility: the presentation
   * is dropped when the targeted provider is already presenting another modal
   * or UIKit rejects it, and `onPresentationRejected` fires instead. While
   * the modal is suspended by navigation above its provider (e.g. a stack
   * screen pushed over it) `isOpen` stays `true` although nothing is on
   * screen; the presentation is restored when the covering content goes away.
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
   * provider (given to it explicitly via its `containerId` prop) to present
   * the modal within that provider's bounds instead. The targeted provider
   * must be an ancestor of the modal. An empty string behaves like an omitted
   * prop.
   *
   * @platform ios
   * @since 5.0
   */
  targetContainerId?: string | undefined;

  /**
   * Called when `isOpen` flipped to `true` but the presentation was dropped:
   * the target provider is already presenting another modal, or UIKit
   * rejected the presentation.
   *
   * @remarks
   * The request is not queued and nothing retries it; the modal stays closed
   * while `isOpen` remains `true`. Reconcile state here (e.g. set `isOpen`
   * back to `false`, or re-open after the blocking modal closes).
   *
   * @platform ios
   * @since 5.0
   */
  onPresentationRejected?: (() => void) | undefined;
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
   * Identifies this provider for a modal's `targetContainerId`.
   *
   * @remarks
   * Defaults to an auto-generated id, which keeps nearest-provider matching
   * working without any configuration. Set it explicitly only when a modal
   * nested under an inner provider must target this (outer) provider. Must be
   * unique among providers on the modal's ancestor chain; an empty string
   * behaves like an omitted prop.
   *
   * @platform ios
   * @since 5.0
   */
  containerId?: string | undefined;

  /**
   * Style applied to the provider's host view.
   *
   * @remarks
   * The provider is a regular container whose bounds define the area a
   * matched contained modal is presented in.
   *
   * @platform ios
   * @since 5.0
   */
  style?: StyleProp<ViewStyle> | undefined;
}
