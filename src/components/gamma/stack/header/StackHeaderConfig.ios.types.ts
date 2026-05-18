import { ComponentType } from 'react';

export interface HeaderBaseItem {
  key: string;
  label?: string | undefined;
}

export interface HeaderInlineItem extends HeaderBaseItem {
  type: 'item';
}

export interface HeaderInlineCustomItem {
  key: string;
  type: 'item';
  component: ComponentType;
}

export interface HeaderSpacerItem {
  key: string;
  type: 'spacer';
  sizing?: 'fixed' | 'flexible';
  width?: number;
}

export interface HeaderTitleItem extends HeaderBaseItem {}

export interface HeaderTitleCustomItem {
  key: string;
  component: ComponentType;
}

export interface StackHeaderConfigPropsIOS {
  leadingItemsSupplementBackButton?: boolean | undefined;
  subtitleItem?: undefined;
  leadingItems?:
    | (HeaderInlineItem | HeaderInlineCustomItem | HeaderSpacerItem)[]
    | undefined;
  titleItem?: HeaderTitleItem | HeaderTitleCustomItem | undefined;
  trailingItems?:
    | (HeaderInlineItem | HeaderInlineCustomItem | HeaderSpacerItem)[]
    | undefined;
  largeTitle?: string | undefined;
  largeTitleEnabled?: boolean | undefined;
  largeSubtitle?: string | undefined;
  largeSubtitleItem?: HeaderTitleItem | HeaderTitleCustomItem | undefined;
}
