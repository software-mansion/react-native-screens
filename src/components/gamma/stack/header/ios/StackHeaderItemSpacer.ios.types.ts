import { HeaderItemPlacement } from './StackHeaderItem.ios.types';

export type StackHeaderItemSpacerProps = {
  itemKey: string;
  placement: HeaderItemPlacement;
  spacer?: 'fixed' | 'flexible' | undefined;
  width?: number | undefined;
};
