import React from 'react';
import type { HostInstance, ViewProps } from 'react-native';
import { type NativeProps } from '../../../fabric/stack/StackHostNativeComponent';
import { ColorScheme } from '../../shared/types';

export type StackHostColorScheme = ColorScheme | 'inherit';

export type StackHostProps = {
  // General
  children: NonNullable<ViewProps['children']>;
  // TODO: Work on these types
  ref?:
    | React.RefObject<(React.Component<NativeProps> & HostInstance) | null>
    | undefined;
  /**
   * @summary Specifies the color scheme used by the container and any child
   * containers.
   *
   * The following values are currently supported:
   * - `inherit` - the interface style from parent,
   * - `light` - the light interface style,
   * - `dark` - the dark interface style.
   *
   * @remarks
   * Color scheme isn't currently supported on iOS.
   *
   * @default inherit
   *
   * @platform android
   */
  colorScheme?: StackHostColorScheme | undefined;
};
