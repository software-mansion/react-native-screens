import { NativeSyntheticEvent, ViewProps } from 'react-native';

export type OnDismissEventPayload = {
  isNativeDismiss: boolean;
};

export type EmptyEventPayload = Record<string, never>;

export type OnDismissEvent = NativeSyntheticEvent<OnDismissEventPayload>;

export type StackScreenActivityMode = 'detached' | 'attached';

export type StackScreenEventHandler = (
  event: NativeSyntheticEvent<EmptyEventPayload>,
) => void;

export type StackScreenProps = {
  children?: ViewProps['children'];

  // Control
  activityMode: StackScreenActivityMode;
  screenKey: string;

  // Events
  onWillAppear?: StackScreenEventHandler;
  onDidAppear?: StackScreenEventHandler;
  onWillDisappear?: StackScreenEventHandler;
  onDidDisappear?: StackScreenEventHandler;

  onDismiss?: (screenKey: string) => void;
  onNativeDismiss?: (screenKey: string) => void;
};
