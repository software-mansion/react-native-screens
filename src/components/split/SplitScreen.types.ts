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
