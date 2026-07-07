import React, { useCallback, useEffect } from 'react';
import type { StackHeaderConfigProps } from './StackHeaderConfig.types';
import StackHeaderConfigIOSNativeComponent, {
  MenuItemPressEvent,
  MenuSelectionChangeEvent,
} from '../../../../fabric/gamma/stack/StackHeaderConfigIOSNativeComponent';
import type { StackHeaderItemPlacement } from './ios/StackHeaderItem.ios.types';
import { StackHeaderItemSpacerPlacement } from './ios/StackHeaderItemSpacer.ios.types';
import StackHeaderItemSpacer from './ios/StackHeaderItemSpacer.ios';
import StackHeaderItem from './ios/StackHeaderItem.ios';
import { NativeSyntheticEvent, StyleSheet } from 'react-native';
import type {
  StackHeaderInlineCustomItemIOS,
  StackHeaderInlineItemIOS,
  StackHeaderSpacerItemIOS,
  StackHeaderTitleCustomItemIOS,
} from './StackHeaderConfig.ios.types';
import { findMenuElementByIdInItems, validateMenuCallbacks } from './utils';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function StackHeaderConfig(props: StackHeaderConfigProps) {
  // android props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ios, android, ...restProps } = props;

  const {
    leadingItems,
    trailingItems,
    titleItem,
    subtitleItem,
    largeSubtitleItem,
    largeTitle,
    largeSubtitle,
    largeTitleEnabled,
  } = ios ?? {};

  const handleMenuItemPress = useCallback(
    (event: NativeSyntheticEvent<MenuItemPressEvent>) => {
      const items = Array.of(
        ...(leadingItems ?? []).filter(it => it && it.type === 'item'),
        ...(trailingItems ?? []).filter(it => it && it.type === 'item'),
      );
      const menuElement = findMenuElementByIdInItems(
        items,
        event.nativeEvent.menuItemId,
      );
      if (menuElement && menuElement.type === 'menuItem') {
        menuElement.onPress?.();
      }
    },
    [leadingItems, trailingItems],
  );

  const allMenuItems = [
    ...(leadingItems ?? []),
    ...(trailingItems ?? []),
  ].filter(it => it && it.type === 'item');

  const handleSelectionChange = useCallback(
    (event: NativeSyntheticEvent<MenuSelectionChangeEvent>) => {
      const { menuId, selectedMenuItemIds } = event.nativeEvent;
      const menu = findMenuElementByIdInItems(allMenuItems, menuId);
      if (menu && menu.type === 'menu') {
        menu.onSelectionChange?.(selectedMenuItemIds);
      }
    },
    [allMenuItems],
  );

  useEffect(() => {
    for (const item of allMenuItems) {
      if ('menu' in item && item.menu) {
        validateMenuCallbacks(item.menu);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadingItems, trailingItems]);

  return (
    <StackHeaderConfigIOSNativeComponent
      {...restProps}
      collapsable={false}
      largeTitle={largeTitle}
      largeSubtitle={largeSubtitle}
      largeTitleEnabled={!!largeTitleEnabled}
      style={styles.config}
      onMenuItemPress={handleMenuItemPress}
      onMenuSelectionChange={handleSelectionChange}>
      {leadingItems?.map(item => makeItemViewFromItem(item, 'leading'))}
      {titleItem && makeItemViewFromItem(titleItem, 'title')}
      {subtitleItem && makeItemViewFromItem(subtitleItem, 'subtitle')}
      {largeSubtitleItem &&
        makeItemViewFromItem(largeSubtitleItem, 'largeSubtitle')}
      {trailingItems?.map(item => makeItemViewFromItem(item, 'trailing'))}
    </StackHeaderConfigIOSNativeComponent>
  );
}

function makeItemViewFromItem(
  item:
    | StackHeaderInlineItemIOS
    | StackHeaderInlineCustomItemIOS
    | StackHeaderTitleCustomItemIOS
    | StackHeaderSpacerItemIOS,
  placement: StackHeaderItemPlacement,
) {
  if ('type' in item && item.type === 'spacer') {
    const { id, ...rest } = item;

    if (!(placement === 'leading' || placement === 'trailing')) {
      console.warn(
        `[Stack] Invalid placement for spacer: "${placement}", defaulting to "trailing"`,
      );
      placement = 'trailing';
    }

    return (
      <StackHeaderItemSpacer
        key={id}
        placement={placement as StackHeaderItemSpacerPlacement}
        {...rest}
      />
    );
  }

  const { id, ...rest } = item;

  return (
    <StackHeaderItem key={id} itemId={id} placement={placement} {...rest} />
  );
}

const styles = StyleSheet.create({
  config: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
