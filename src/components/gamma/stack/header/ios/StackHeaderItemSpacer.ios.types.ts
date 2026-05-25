import type { StackHeaderItemPlacement } from './StackHeaderItem.ios.types';

export type StackHeaderItemSpacerPlacement = Extract<
  StackHeaderItemPlacement,
  'leading' | 'trailing'
>;

export type StackHeaderItemSpacerProps = {
  placement: StackHeaderItemSpacerPlacement;
  size?: 'fixed' | 'flexible' | undefined;
  width?: number | undefined;
};
