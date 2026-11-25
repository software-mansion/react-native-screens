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
  /**
   * Makes the stack a provider for contained modals and identifies it; a
   * modal targets the stack through `targetContainerId`.
   *
   * @remarks
   * The stack takes the role of a {@link ContainedModalProvider} and this is
   * its `containerId`. A contained modal that targets the stack is presented
   * within the bounds of the stack and covers its header. The modal has to be
   * rendered in a screen of the stack.
   *
   * Must be unique among the stacks and the
   * {@link ContainedModalProvider | ContainedModalProviders} on a modal's
   * ancestor chain. An empty string is treated as not set.
   *
   * @note
   * A modal that targets a stack shown by a `Split.Column` does not follow
   * the Split between its collapsed and expanded layouts yet: after such a
   * change the modal may be hidden or cover another column.
   *
   * @platform ios
   */
  modalProviderContainerId?: string | undefined;
};
