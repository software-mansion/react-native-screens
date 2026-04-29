import { ComponentType } from 'react';

export type HeaderItemPlacement =
  | 'left'
  | 'right'
  | 'title'
  | 'subtitle'
  | 'largeSubtitle';

export type StackHeaderItemProps = {
  itemKey: string;
  placement: HeaderItemPlacement;
  label?: string | undefined;
  component?: ComponentType | undefined;
};
