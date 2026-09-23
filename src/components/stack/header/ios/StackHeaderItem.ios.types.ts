import type { ReactElement } from 'react';
import type { PlatformIconIOS } from '../../../shared/types';
import type { StackHeaderMenuIOS } from './StackHeaderMenu.ios.types';

/**
 * @summary Priority used when the header has to decide which items to keep.
 *
 * @description
 * Each value maps to the matching `UIBarButtonItemVisibilityPriority` constant.
 *
 * @platform iOS
 *
 * @supported iOS 27 and higher
 */
export type StackHeaderItemVisibilityPriorityIOS = 'low' | 'standard' | 'high';

export type StackHeaderItemPlacement =
  | 'leading'
  | 'trailing'
  | 'title'
  | 'subtitle'
  | 'largeSubtitle';

export type StackHeaderItemProps = {
  placement: StackHeaderItemPlacement;
  itemId?: string | undefined;
  identifier?: string | undefined;
  hidesSharedBackground?: boolean | undefined;
  visibilityPriority?: StackHeaderItemVisibilityPriorityIOS | undefined;
  title?: string | undefined;
  icon?: PlatformIconIOS | undefined;
  render?: (() => ReactElement) | undefined;
  menu?: StackHeaderMenuIOS | undefined;
  onPress?: (() => void) | undefined;
};
