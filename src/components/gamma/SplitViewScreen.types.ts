import type { NativeSyntheticEvent, ViewProps } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

export type SplitViewScreenColumnType = 'column' | 'inspector';

export interface SplitViewScreenProps extends ViewProps {
  children?: React.ReactNode;
  /**
   * @summary A callback that gets invoked when the current SplitViewScreen did appear.
   *
   * This is called as soon as the transition ends.
   */
  onDidAppear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * @summary A callback that gets invoked when the current SplitViewScreen did disappear.
   *
   * This is called as soon as the transition ends.
   */
  onDidDisappear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * @summary A callback that gets invoked when the current SplitViewScreen will appear.
   *
   * This is called as soon as the transition begins.
   */
  onWillAppear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * @summary A callback that gets invoked when the current SplitViewScreen will disappear.
   *
   * This is called as soon as the transition begins.
   */
  onWillDisappear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
}
