import type { StackHeaderItemPlacement } from './StackHeaderItem.ios.types';

export type StackHeaderItemSpacerPlacement = Extract<
  StackHeaderItemPlacement,
  'leading' | 'trailing' | 'toolbar'
>;

export type StackHeaderItemSpacerProps = {
  placement: StackHeaderItemSpacerPlacement;
  sizing?: 'fixed' | 'flexible' | undefined;
  width?: number | undefined;
};
