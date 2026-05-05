import { ComponentType } from 'react';

export interface HeaderBaseItem {
  key: string;
  label?: string | undefined;
}

export interface HeaderCustomItem extends HeaderBaseItem {
  component: ComponentType;
}

export interface HeaderSpacerItem {
  key: string;
  size?: 'fixed' | 'flexible';
  width?: number;
}

export type HeaderItem = HeaderBaseItem | HeaderCustomItem;

export interface StackHeaderConfigPropsIOS {
  leftItemsSupplementBackButton?: boolean | undefined;
  subtitleItem?: HeaderItem | undefined;
  leftItems?: (HeaderItem | HeaderSpacerItem)[] | undefined;
  titleItem?: HeaderItem | undefined;
  rightItems?: (HeaderItem | HeaderSpacerItem)[] | undefined;
  largeTitleEnabled?: boolean | undefined;
  largeSubtitle?: string | undefined;
  largeSubtitleItem?: HeaderItem | undefined;
}
