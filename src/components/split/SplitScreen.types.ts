import type { ViewProps } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../shared/types';

export type SplitScreenColumnType = 'column' | 'inspector';

/**
 * Props for {@link Split.Column} and {@link Split.Inspector}.
 *
 * @experimental
 */
export interface SplitScreenProps extends ViewProps {
  children?: React.ReactNode | undefined;
  /**
   * A callback that gets invoked when the current SplitScreen did appear.
   *
   * @remarks
   * This is called as soon as the transition ends.
   *
   * @platform ios
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the current SplitScreen did disappear.
   *
   * @remarks
   * This is called as soon as the transition ends.
   *
   * @platform ios
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the current SplitScreen will appear.
   *
   * @remarks
   * This is called as soon as the transition begins.
   *
   * @platform ios
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the current SplitScreen will disappear.
   *
   * @remarks
   * This is called as soon as the transition begins.
   *
   * @platform ios
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
}
