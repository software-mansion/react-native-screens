import { ComponentType } from 'react';

export interface HeaderBaseItem {
  key: string;
  label?: string;
}

export interface HeaderCustomItem extends HeaderBaseItem {
  component: ComponentType;
}

export interface HeaderSpacerItem {
  key: string;
  spacer?: 'fixed' | 'flexible';
  width?: number;
}

export type HeaderItem = HeaderBaseItem | HeaderCustomItem;

export default interface HeaderConfigProps {
  leftItemsSupplementBackButton?: boolean;
  subtitleItem?: HeaderItem;
  children?: HeaderItem[];
  hidden?: boolean;
  leftItems?: (HeaderItem | HeaderSpacerItem)[];
  title?: string;
  titleItem?: HeaderItem;
  rightItems?: (HeaderItem | HeaderSpacerItem)[];
  largeTitleEnabled?: boolean;
  largeSubtitle?: string;
  largeSubtitleItem?: HeaderItem;
}
