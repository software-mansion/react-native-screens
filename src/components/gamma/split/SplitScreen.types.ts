import type { NativeSyntheticEvent, ViewProps } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

export type OnDismissEventPayload = {
  isNativeDismiss: boolean;
};

export type OnDismissEvent = NativeSyntheticEvent<OnDismissEventPayload>;

export type SplitScreenActivityMode = 'detached' | 'attached';

type SplitScreenEventHandler = (
  event: NativeSyntheticEvent<GenericEmptyEvent>,
) => void;

export interface SplitScreenProps extends ViewProps {
  children?: React.ReactNode;

  // Stack control
  activityMode: SplitScreenActivityMode;
  screenKey: string;

  // Header configuration
  title?: string;
  headerBackgroundColor?: string;

  // Dismiss control
  preventNativeDismiss?: boolean;

  // Lifecycle events
  onWillAppear?: SplitScreenEventHandler;
  onDidAppear?: SplitScreenEventHandler;
  onWillDisappear?: SplitScreenEventHandler;
  onDidDisappear?: SplitScreenEventHandler;

  // Dismiss events
  onDismiss?: (screenKey: string) => void;
  onNativeDismiss?: (screenKey: string) => void;
}
