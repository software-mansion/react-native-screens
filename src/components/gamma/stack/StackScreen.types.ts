import { NativeSyntheticEvent, ViewProps } from 'react-native';

export type GenericEmptyEvent = Record<string, never>;

export type StackScreenActivityMode = 'detached' | 'attached';

export type StackScreenEventHandler = (
  event: NativeSyntheticEvent<GenericEmptyEvent>,
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
