import type { ReactElement } from 'react';

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
};
