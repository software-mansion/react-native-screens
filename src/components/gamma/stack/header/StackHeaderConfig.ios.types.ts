import type { ReactElement } from 'react';
import type { StackHeaderMenuIOS } from './ios/StackHeaderMenu.ios.types';

export interface StackHeaderBaseItemIOS {
  key: string;
  label?: string | undefined;
}

export interface SupportsMenuIOS {
  menu?: StackHeaderMenuIOS | undefined;
}

export interface StackHeaderInlineItemIOS
  extends StackHeaderBaseItemIOS,
    SupportsMenuIOS {
  type: 'item';
}

export interface StackHeaderInlineCustomItemIOS extends SupportsMenuIOS {
  key: string;
  type: 'item';
  render: () => ReactElement;
}

interface StackHeaderFixedSpacerItemIOS {
  key: string;
  type: 'spacer';
  sizing: 'fixed';
  width: number;
}

interface StackHeaderFlexibleSpacerItemIOS {
  key: string;
  type: 'spacer';
  sizing: 'flexible';
}

export type StackHeaderSpacerItemIOS =
  | StackHeaderFixedSpacerItemIOS
  | StackHeaderFlexibleSpacerItemIOS;

export interface StackHeaderTitleCustomItemIOS {
  key: string;
  render: () => ReactElement;
}

export interface StackHeaderConfigPropsIOS {
  subtitleItem?: StackHeaderTitleCustomItemIOS | undefined;
  leadingItems?:
    | (
        | StackHeaderInlineItemIOS
        | StackHeaderInlineCustomItemIOS
        | StackHeaderSpacerItemIOS
      )[]
    | undefined;
  titleItem?: StackHeaderTitleCustomItemIOS | undefined;
  trailingItems?:
    | (
        | StackHeaderInlineItemIOS
        | StackHeaderInlineCustomItemIOS
        | StackHeaderSpacerItemIOS
      )[]
    | undefined;
  largeTitle?: string | undefined;
  largeTitleEnabled?: boolean | undefined;
  largeSubtitle?: string | undefined;
  largeSubtitleItem?: StackHeaderTitleCustomItemIOS | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StackHeaderConfigCommandsIOS {}
