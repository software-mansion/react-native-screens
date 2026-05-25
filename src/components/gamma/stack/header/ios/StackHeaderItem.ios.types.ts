import type { ComponentType } from 'react';

export type HeaderItemPlacement =
  | 'leading'
  | 'trailing'
  | 'title'
  | 'subtitle'
  | 'largeSubtitle';

export type StackHeaderItemProps = {
  placement: HeaderItemPlacement;
  label?: string | undefined;
  Component?: ComponentType | undefined;
};
