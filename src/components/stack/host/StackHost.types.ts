import React from 'react';
import type { HostInstance, ViewProps } from 'react-native';
import type { ColorScheme, Direction } from '../../shared/types';

/**
 * Color scheme used by a Stack and any child containers.
 *
 * @remarks
 * The following values are currently supported:
 * - `'inherit'` — the interface style from parent,
 * - `'light'` — the light interface style,
 * - `'dark'` — the dark interface style.
 */
export type StackColorScheme = ColorScheme | 'inherit';

/**
 * Layout direction of a Stack, its views and child containers.
 *
 * @remarks
 * The following values are currently supported:
 * - `'inherit'` — uses parent's layout direction,
 * - `'ltr'` — forces left-to-right layout direction,
 * - `'rtl'` — forces right-to-left layout direction.
 */
export type StackDirection = Direction | 'inherit';

/**
 * Props for {@link Stack.Host}.
 *
 * @experimental
 */
export type StackHostProps = {
  // General
  /**
   * Screens of the stack, declared with {@link Stack.Screen}.
   *
   * @platform android, ios
   */
  children: NonNullable<ViewProps['children']>;
  // TODO: Work on these types
  /**
   * Ref to the native view of the stack.
   *
   * @platform android, ios
   */
  ref?: React.Ref<HostInstance> | undefined;
  /**
   * Specifies the layout direction of the native container, its views and
   * child containers.
   *
   * @note
   * This is an implementation detail and may change. On Android, this property
   * relies on `react-native`'s `style.direction` (which sets the native Android
   * `layoutDirection` View property). It is propagated via the view hierarchy,
   * so `inherit` falls back to the direction set on one of the parent views.
   *
   * @defaultValue `'inherit'`
   * @platform android
   */
  direction?: StackDirection | undefined;
  /**
   * Specifies the color scheme used by the container and any child
   * containers.
   *
   * @remarks
   * Toolbar menu state survives a change of the effective color scheme:
   * checkbox/radio selections and changes applied via the
   * `updateToolbarMenuElements` view command are reapplied.
   *
   * @note
   * This is an implementation detail and may change. On Android, changing the
   * effective color scheme rebuilds the header.
   *
   * @defaultValue `'inherit'`
   * @platform android
   */
  colorScheme?: StackColorScheme | undefined;
};
