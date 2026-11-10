import type { NativeSyntheticEvent, ViewProps } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

export type SplitScreenColumnType = 'column' | 'inspector';

export interface SplitScreenProps extends ViewProps {
  children?: React.ReactNode | undefined;
  /**
   * @summary Keeps the column a plain one no matter of Stack.Host placement.
   *
   * By default, Stack.Host's navigation controller is installed in the column and
   * its header is the column's navigation bar. With this prop the stack is nested
   * in the column like any other content. The value is read when the column mounts
   * its content; to change it, remount the column.
   *
   * @platform ios
   */
  disableStackIntegration?: boolean | undefined;
  /**
   * @summary A callback that gets invoked when the current SplitScreen did appear.
   *
   * This is called as soon as the transition ends.
   */
  onDidAppear?:
    | ((e: NativeSyntheticEvent<GenericEmptyEvent>) => void)
    | undefined;
  /**
   * @summary A callback that gets invoked when the current SplitScreen did disappear.
   *
   * This is called as soon as the transition ends.
   */
  onDidDisappear?:
    | ((e: NativeSyntheticEvent<GenericEmptyEvent>) => void)
    | undefined;
  /**
   * @summary A callback that gets invoked when the current SplitScreen will appear.
   *
   * This is called as soon as the transition begins.
   */
  onWillAppear?:
    | ((e: NativeSyntheticEvent<GenericEmptyEvent>) => void)
    | undefined;
  /**
   * @summary A callback that gets invoked when the current SplitScreen will disappear.
   *
   * This is called as soon as the transition begins.
   */
  onWillDisappear?:
    | ((e: NativeSyntheticEvent<GenericEmptyEvent>) => void)
    | undefined;
}
