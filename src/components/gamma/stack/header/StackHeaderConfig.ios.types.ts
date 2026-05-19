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

interface HeaderFixedSpacerItem {
  key: string;
  type: 'spacer';
  sizing: 'fixed';
  width: number;
}

interface HeaderFlexibleSpacerItem {
  key: string;
  type: 'spacer';
  sizing: 'flexible';
}

export type HeaderSpacerItem = HeaderFixedSpacerItem | HeaderFlexibleSpacerItem;

export interface HeaderTitleItem extends HeaderBaseItem {}

export interface HeaderTitleCustomItem {
  key: string;
  component: ComponentType;
}

export interface StackHeaderConfigPropsIOS {
  subtitleItem?: HeaderTitleItem | HeaderTitleCustomItem | undefined;
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
