import React from 'react';
import type { HostInstance, ViewProps } from 'react-native';
import { type NativeProps } from '../../../fabric/stack/StackHostNativeComponent';
import type { ColorScheme } from '../../shared/types';

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
   * On Android, changing the effective color scheme rebuilds the header. The
   * toolbar menu is rebuilt from the `toolbarMenu` prop, so its initial
   * selection is restored and any changes applied via the
   * `updateToolbarMenuElements` view command are discarded.
   *
   * @default inherit
   *
   * @platform android
   */
  colorScheme?: StackHostColorScheme | undefined;
};
