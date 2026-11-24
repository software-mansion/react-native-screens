import type { ViewProps } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../../shared/types';

export interface FullScreenModalProps {
  children?: ViewProps['children'] | undefined;
  isOpen: boolean;

  // Events
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onDismiss?: NativeEventHandler<EmptyEventPayload> | undefined;
  onNativeDismiss?: NativeEventHandler<EmptyEventPayload> | undefined;
}
