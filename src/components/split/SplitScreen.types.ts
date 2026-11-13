import type { ViewProps } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../shared/types';

/**
 * Kind of a Split column.
 *
 * @remarks
 * The following values are supported:
 * - `'column'` — a column declared with {@link Split.Column}.
 * - `'inspector'` — the inspector column declared with
 *   {@link Split.Inspector}.
 */
export type SplitScreenColumnType = 'column' | 'inspector';

/**
 * Props for {@link Split.Column}.
 *
 * @experimental
 */
export interface SplitColumnProps extends ViewProps {
  /**
   * Content of the column.
   *
   * @platform ios
   */
  children?: React.ReactNode | undefined;
  /**
   * Keeps the column a plain one even when its content is a `Stack.Host`.
   *
   * @remarks
   * By default a `Stack.Host` rendered as the only direct child of the column
   * navigates the column, and the header of the stack is the navigation bar of
   * the column. With this prop the stack is nested in the column like any other
   * content.
   *
   * The value is read when the column is mounted. Changing it later has no
   * effect.
   *
   * @defaultValue `false`
   *
   * @platform ios
   */
  disableStackIntegration?: boolean | undefined;
  /**
   * A callback that gets invoked when the current `Split.Column` did appear.
   *
   * @remarks
   * This is called as soon as the transition ends.
   *
   * @platform ios
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the current `Split.Column` did disappear.
   *
   * @remarks
   * This is called as soon as the transition ends.
   *
   * @platform ios
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the current `Split.Column` will appear.
   *
   * @remarks
   * This is called as soon as the transition begins.
   *
   * @platform ios
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the current `Split.Column` will
   * disappear.
   *
   * @remarks
   * This is called as soon as the transition begins.
   *
   * @platform ios
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
}

/**
 * Props for {@link Split.Inspector}.
 *
 * @experimental
 */
export interface SplitInspectorProps extends ViewProps {
  /**
   * Content of the inspector column.
   *
   * @platform ios >= 26
   */
  children?: React.ReactNode | undefined;
  /**
   * A callback that gets invoked when the current `Split.Inspector` did appear.
   *
   * @remarks
   * This is called as soon as the transition ends.
   *
   * @platform ios >= 26
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the current `Split.Inspector` did
   * disappear.
   *
   * @remarks
   * This is called as soon as the transition ends.
   *
   * @platform ios >= 26
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the current `Split.Inspector` will
   * appear.
   *
   * @remarks
   * This is called as soon as the transition begins.
   *
   * @platform ios >= 26
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the current `Split.Inspector` will
   * disappear.
   *
   * @remarks
   * This is called as soon as the transition begins.
   *
   * @platform ios >= 26
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
}
