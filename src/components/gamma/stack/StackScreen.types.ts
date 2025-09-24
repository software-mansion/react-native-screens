import { NativeSyntheticEvent, ViewProps } from 'react-native';

export type GenericEmptyEvent = Record<string, never>;

export type StackScreenEventHandler = (
  event: NativeSyntheticEvent<GenericEmptyEvent>,
) => void;

export type StackScreenProps = {
  children?: ViewProps['children'];

  maxLifecycleState: 0 | 1 | 2; // TODO: Figure out to type this w/o circular import

  screenKey: string;

  // Events
  onWillAppear?: StackScreenEventHandler;
  onDidAppear?: StackScreenEventHandler;
  onWillDisappear?: StackScreenEventHandler;
  onDidDisappear?: StackScreenEventHandler;

  // Custom events
  onPop?: (screenKey: string) => void;
};
