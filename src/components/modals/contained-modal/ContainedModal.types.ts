import type { ViewProps, StyleProp, ViewStyle } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../../shared/types';

// Props of `ContainedModalHost`. Internal: each contained modal component
// declares and documents its own props.
export interface ContainedModalProps {
  children?: ViewProps['children'] | undefined;
  isOpen: boolean;
  targetContainerId: string;

  // Events
  onPresentationRejected?: NativeEventHandler<EmptyEventPayload> | undefined;
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
}

/**
 * Props for {@link ContainedModalProvider}.
 *
 * @experimental
 */
export interface ContainedModalProviderProps {
  /**
   * Content the matched contained modals are presented over.
   *
   * @platform ios
   */
  children?: ViewProps['children'] | undefined;

  /**
   * Identifies this provider; a modal targets it through `targetContainerId`.
   *
   * @remarks
   * Must be unique among the providers on a modal's ancestor chain (two
   * providers in unrelated subtrees may share an id). Must not be empty.
   *
   * @platform ios
   */
  containerId: string;

  /**
   * Style applied to the provider's host view.
   *
   * @remarks
   * The provider is a regular container whose bounds define the area a
   * matched contained modal is presented in.
   *
   * @platform ios
   */
  style?: StyleProp<ViewStyle> | undefined;
}
