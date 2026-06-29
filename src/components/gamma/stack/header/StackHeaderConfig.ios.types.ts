import type { ReactElement } from 'react';
import type { StackHeaderMenuIOS } from './ios/StackHeaderMenu.ios.types';

export interface StackHeaderBaseItemIOS {
  /**
   * @summary A unique identifier within the screen header.
   *
   * @platform iOS
   */
  id: string;
  /**
   * @summary A title for the item that is displayed in the header.
   *
   * @platform iOS
   */
  title?: string | undefined;
}

export interface SupportsMenuIOS {
  /**
   * @summary Menu definition for the context menu that appears when item is tapped.
   *
   * @platform iOS
   */
  menu?: StackHeaderMenuIOS | undefined;
}

/**
 * @summary Native header item with text label.
 *
 * @platform iOS
 */
export interface StackHeaderInlineItemIOS
  extends StackHeaderBaseItemIOS,
    SupportsMenuIOS {
  /**
   * @summary Marks this object as a header item definition.
   *
   * @platform iOS
   */
  type: 'item';
  /**
   * @summary Callback invoked when the header item is pressed.
   *
   * @description
   * Fires when the user taps the header item. When combined with
   * {@link SupportsMenuIOS.menu | menu}, tapping fires `onPress` and
   * long-pressing shows the menu.
   *
   * @platform iOS
   */
  onPress?: (() => void) | undefined;
}

/**
 * @summary Header item with custom view.
 *
 * @platform iOS
 */
export interface StackHeaderInlineCustomItemIOS extends SupportsMenuIOS {
  /**
   * @summary A unique identifier within the screen header.
   *
   * @platform iOS
   */
  id: string;
  /**
   * @summary Marks this object as a header item definition.
   *
   * @platform iOS
   */
  type: 'item';
  /**
   * @summary A function that renders the custom view.
   *
   * @description
   * The subview is sized by React Native's layout engine but positioned by the
   * platform native layout. Each item's size is calculated independently and will
   * not respect flex layout. Use static width and height for best results.
   *
   * @platform iOS
   */
  render: () => ReactElement;
}

/**
 * @summary A spacer item for visual separation of items.
 *
 * @description Separates items defined in {@link StackHeaderConfigPropsIOS.leadingItems | leadingItems}
 * and {@link StackHeaderConfigPropsIOS.trailingItems | trailingItems}. The fixed size spacing works
 * for iOS 18 and below, for iOS 26 it only splits liquid glass bubble for two adjacent items.
 *
 * @platform iOS
 */
interface StackHeaderFixedSpacerItemIOS {
  /**
   * @summary A unique identifier within the screen header.
   *
   * @platform iOS
   */
  id: string;
  /**
   * @summary Marks this object as a spacer definition.
   *
   * @platform iOS
   */
  type: 'spacer';
  /**
   * @summary Marks this object as a fixed-size spacer definition.
   *
   * @platform iOS
   */
  sizing: 'fixed';
  /**
   * @summary Specifies space width between adjacent header items.
   *
   * @platform iOS
   */
  width: number;
}

/**
 * @summary A spacer item for visual separation of items.
 *
 * @description Separates items defined in {@link StackHeaderConfigPropsIOS.leadingItems | leadingItems}
 * and {@link StackHeaderConfigPropsIOS.trailingItems | trailingItems}.
 * For iOS 26 it splits liquid glass bubble for two adjacent items.
 *
 * @platform iOS
 */
interface StackHeaderFlexibleSpacerItemIOS {
  /**
   * @summary A unique identifier within the screen header.
   *
   * @platform iOS
   */
  id: string;
  /**
   * @summary Marks this object as a spacer definition.
   *
   * @platform iOS
   */
  type: 'spacer';
  /**
   * @summary Marks this object as a flexible-size spacer definition.
   *
   * @platform iOS
   */
  sizing: 'flexible';
}

/**
 * @summary A header spacer item type
 */
export type StackHeaderSpacerItemIOS =
  | StackHeaderFixedSpacerItemIOS
  | StackHeaderFlexibleSpacerItemIOS;

export interface StackHeaderTitleCustomItemIOS {
  /**
   * @summary A unique identifier within the screen header.
   *
   * @platform iOS
   */
  id: string;
  /**
   * @summary A function that renders the custom view.
   *
   * @description
   * The subview is sized by React Native's layout engine but positioned by the
   * platform native layout. Each item's size is calculated independently and will
   * not respect flex layout. Use static width and height for best results.
   *
   * Note: Due to layout process limitations, text view will not resize and
   * ellipsize to fit available space without manually setting desired view
   * width. For text-only elements that should ellipsize it is recommended to
   * use regular `title` instead.
   *
   * @platform iOS
   */
  render: () => ReactElement;
}

export interface StackHeaderConfigPropsIOS {
  /**
   * @summary Custom item to display as a subtitle.
   *
   * @description Takes precedence over subtitle text.
   *
   * @platform iOS
   *
   * @supported iOS 26 and higher
   */
  subtitleItem?: StackHeaderTitleCustomItemIOS | undefined;
  /**
   * @summary A list of items placed starting from the leading edge.
   *
   * @description Items are placed next to the back button, if present. If there
   * is not enough space to fit all leading items at once, they are all moved to
   * overflow menu. This differs from trailing items, which are moved one by one.
   *
   * Note: Custom items are not put into the overflow menu, but are removed entirely.
   *
   * @platform iOS
   */
  leadingItems?:
    | (
        | StackHeaderInlineItemIOS
        | StackHeaderInlineCustomItemIOS
        | StackHeaderSpacerItemIOS
      )[]
    | undefined;
  /**
   * @summary Custom item to display as a title.
   *
   * @description Takes precedence over title text.
   *
   * @platform iOS
   */
  titleItem?: StackHeaderTitleCustomItemIOS | undefined;
  /**
   * @summary A list of items placed starting from the trailing edge.
   * If there is not enough space to fit some items, they are moved to the overflow menu, one by one.
   *
   * Note: Custom items are not put into the overflow menu, but are removed entirely.
   *
   * @platform iOS
   */
  trailingItems?:
    | (
        | StackHeaderInlineItemIOS
        | StackHeaderInlineCustomItemIOS
        | StackHeaderSpacerItemIOS
      )[]
    | undefined;
  /**
   * @summary Large title text, displayed when `largeTitleEnabled = true`.
   *
   * @description When ScrollView is present on the screen, large header is displayed only when
   * fully scrolled to top, otherwise it collapses to regular header. If `largeTitle` is not defined,
   * it falls back to regular title.
   *
   * @platform iOS
   */
  largeTitle?: string | undefined;
  /**
   * @summary Specifies if the header should display the large title. It collapses to a regular header when scrolling.
   *
   * @platform iOS
   */
  largeTitleEnabled?: boolean | undefined;
  /**
   * @summary Large subtitle text, displayed when `largeTitleEnabled = true`.
   *
   * @description When ScrollView is present on the screen, large header is displayed only when
   * fully scrolled to top, otherwise it collapses to regular header. If `largeSubititle` is not defined,
   * it falls back to regular subtitle.
   *
   * @platform iOS
   *
   * @supported iOS 26 and higher
   */
  largeSubtitle?: string | undefined;
  /**
   * @summary Custom item to display as a subtitle for large header. Takes precedence over largeSubtitle text.
   *
   * @platform iOS
   *
   * @supported iOS 26 and higher
   */
  largeSubtitleItem?: StackHeaderTitleCustomItemIOS | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StackHeaderConfigCommandsIOS {}
