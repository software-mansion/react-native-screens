import React from 'react';
import type { HostInstance, ViewProps } from 'react-native';
import { type NativeProps } from '../../../fabric/stack/StackHostNativeComponent';
import type { ColorScheme, Direction } from '../../shared/types';

export type StackHostColorScheme = ColorScheme | 'inherit';

export type StackHostDirection = Direction | 'inherit';

export type StackHostProps = {
  // General
  children: NonNullable<ViewProps['children']>;
  // TODO: Work on these types
  ref?:
    | React.RefObject<(React.Component<NativeProps> & HostInstance) | null>
    | undefined;
  /**
   * @summary Specifies the layout direction of the native container, its views
   * and child containers.
   *
   * The following values are currently supported:
   * - `inherit` - uses parent's layout direction,
   * - `ltr` - forces left-to-right layout direction,
   * - `rtl` - forces right-to-left layout direction.
   *
   * @remarks
   * Layout direction isn't currently supported on iOS.
   *
   * On Android, this property relies on `react-native`'s `style.direction`
   * (which sets the native Android `layoutDirection` View property). It is
   * propagated via the view hierarchy, so `inherit` falls back to the direction
   * set on one of the parent views.
   *
   * @default inherit
   *
   * @platform android
   */
  direction?: StackHostDirection | undefined;
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
   * On Android, changing the effective color scheme rebuilds the header.
   * Toolbar menu state survives the rebuild: checkbox/radio selections and
   * changes applied via the `updateToolbarMenuElements` view command are
   * reapplied to the new toolbar.
   *
   * @default inherit
   *
   * @platform android
   */
  colorScheme?: StackHostColorScheme | undefined;
};
