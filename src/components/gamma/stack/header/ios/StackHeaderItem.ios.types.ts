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
  label?: string | undefined;
  render?: (() => ReactElement) | undefined;
  menu?: StackHeaderMenuIOS | undefined;
};
