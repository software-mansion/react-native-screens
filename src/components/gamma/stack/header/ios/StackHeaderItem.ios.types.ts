import { ComponentType } from 'react';

export type HeaderItemPlacement =
  | 'leading'
  | 'trailing'
  | 'title'
  | 'subtitle'
  | 'largeSubtitle';

export type StackHeaderItemProps = {
  itemKey: string;
  placement: HeaderItemPlacement;
  label?: string | undefined;
  component?: ComponentType | undefined;
};
