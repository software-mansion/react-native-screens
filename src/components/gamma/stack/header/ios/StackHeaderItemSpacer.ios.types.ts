import { HeaderItemPlacement } from './StackHeaderItem.ios.types';

export type StackHeaderItemSpacerProps = {
  itemKey: string;
  placement: HeaderItemPlacement;
  size?: 'fixed' | 'flexible' | undefined;
  width?: number | undefined;
};
