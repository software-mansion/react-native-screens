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
  onPress?: (() => void) | undefined;
};
