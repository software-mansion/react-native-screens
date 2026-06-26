import type { ReactElement } from 'react';
import type { StackHeaderMenuIOS } from './StackHeaderMenu.ios.types';

export type StackHeaderItemPlacement =
  | 'leading'
  | 'trailing'
  | 'title'
  | 'subtitle'
  | 'largeSubtitle';

export type StackHeaderItemProps = {
  placement: StackHeaderItemPlacement;
  itemId?: string | undefined;
  title?: string | undefined;
  render?: (() => ReactElement) | undefined;
  menu?: StackHeaderMenuIOS | undefined;
  /**
   * @summary Callback invoked when the header item is pressed.
   *
   * @description
   * Fires when the user taps the header item. When combined with
   * {@link StackHeaderItemProps.menu | menu}, tapping fires `onPress` and
   * long-pressing shows the menu.
   *
   * @platform ios
   */
  onPress?: (() => void) | undefined;
};
