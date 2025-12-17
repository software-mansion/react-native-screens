import type { NativeSyntheticEvent, ViewProps } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

export type SplitScreenColumnType = 'column' | 'inspector';

export interface SplitScreenProps extends ViewProps {
  children?: React.ReactNode;
  /**
   * @summary A callback that gets invoked when the current SplitScreen did appear.
   *
   * This is called as soon as the transition ends.
   */
  onDidAppear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * @summary A callback that gets invoked when the current SplitScreen did disappear.
   *
   * This is called as soon as the transition ends.
   */
  onDidDisappear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * @summary A callback that gets invoked when the current SplitScreen will appear.
   *
   * This is called as soon as the transition begins.
   */
  onWillAppear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * @summary A callback that gets invoked when the current SplitScreen will disappear.
   *
   * This is called as soon as the transition begins.
   */
  onWillDisappear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
}
