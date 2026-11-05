import type { ViewProps } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../shared/types';

export type SplitScreenColumnType = 'column' | 'inspector';

export interface SplitScreenProps extends ViewProps {
  children?: React.ReactNode | undefined;
  /**
   * @summary A callback that gets invoked when the current SplitScreen did appear.
   *
   * This is called as soon as the transition ends.
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * @summary A callback that gets invoked when the current SplitScreen did disappear.
   *
   * This is called as soon as the transition ends.
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * @summary A callback that gets invoked when the current SplitScreen will appear.
   *
   * This is called as soon as the transition begins.
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * @summary A callback that gets invoked when the current SplitScreen will disappear.
   *
   * This is called as soon as the transition begins.
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
}
