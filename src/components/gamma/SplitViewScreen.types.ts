import type { NativeSyntheticEvent, ViewProps } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
export type GenericEmptyEvent = Readonly<{}>;

export type SplitViewScreenColumnType = 'column' | 'inspector';

export interface SplitViewScreenProps extends ViewProps {
  children?: React.ReactNode;
  /**
   * A callback that gets invoked when the current SplitViewScreen did appear. This is called as soon as the transition ends.
   *
   * @platform ios
   */
  onDidAppear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * A callback that gets invoked when the current SplitViewScreen did disappear. This is called as soon as the transition ends.
   *
   * @platform ios
   */
  onDidDisappear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * A callback that gets invoked when the current SplitViewScreen will appear. This is called as soon as the transition begins.
   *
   * @platform ios
   */
  onWillAppear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * A callback that gets invoked when the current SplitViewScreen will disappear. This is called as soon as the transition begins.
   *
   * @platform ios
   */
  onWillDisappear?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
}
