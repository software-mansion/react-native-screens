import { HeaderItemPlacement } from './StackHeaderItem.ios.types';

export type StackHeaderItemSpacerProps = {
  placement: HeaderItemPlacement;
  size?: 'fixed' | 'flexible' | undefined;
  width?: number | undefined;
};
