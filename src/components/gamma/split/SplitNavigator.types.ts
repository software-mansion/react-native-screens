import type { NativeSyntheticEvent, ViewProps } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

export type SplitNavigatorColumnType =
  | 'primary'
  | 'secondary'
  | 'supplementary'
  | 'inspector';

type SplitNavigatorEventHandler = (
  event: NativeSyntheticEvent<GenericEmptyEvent>,
) => void;

export interface SplitNavigatorProps extends ViewProps {
  children?: React.ReactNode;
  columnType: SplitNavigatorColumnType;
  onWillAppear?: SplitNavigatorEventHandler;
  onDidAppear?: SplitNavigatorEventHandler;
  onWillDisappear?: SplitNavigatorEventHandler;
  onDidDisappear?: SplitNavigatorEventHandler;
}
