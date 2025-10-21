'use client';

import React from 'react';
import {
  HeaderBarButtonItemMenuAction,
  HeaderBarButtonItemWithMenu,
  ScreenStackHeaderConfigProps,
  ScreenStackHeaderSubviewProps,
} from '../types';
import {
  Image,
  ImageProps,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';

// Native components
import ScreenStackHeaderConfigNativeComponent from '../fabric/ScreenStackHeaderConfigNativeComponent';
import ScreenStackHeaderSubviewNativeComponent, {
  type NativeProps as ScreenStackHeaderSubviewNativeProps,
} from '../fabric/ScreenStackHeaderSubviewNativeComponent';
import { prepareHeaderBarButtonItems } from './helpers/prepareHeaderBarButtonItems';
import { isHeaderBarButtonsAvailableForCurrentPlatform } from '../utils';

export const ScreenStackHeaderSubview: React.ComponentType<ScreenStackHeaderSubviewNativeProps> =
  ScreenStackHeaderSubviewNativeComponent;

export const ScreenStackHeaderConfig = React.forwardRef<
  View,
  ScreenStackHeaderConfigProps
>((props, ref) => {
  const { headerLeftBarButtonItems, headerRightBarButtonItems } = props;

  const preparedHeaderLeftBarButtonItems =
    headerLeftBarButtonItems && isHeaderBarButtonsAvailableForCurrentPlatform
      ? prepareHeaderBarButtonItems(headerLeftBarButtonItems, 'left')
      : undefined;
  const preparedHeaderRightBarButtonItems =
    headerRightBarButtonItems && isHeaderBarButtonsAvailableForCurrentPlatform
      ? prepareHeaderBarButtonItems(headerRightBarButtonItems, 'right')
      : undefined;
  const hasHeaderBarButtonItems =
    isHeaderBarButtonsAvailableForCurrentPlatform &&
    (preparedHeaderLeftBarButtonItems?.length ||
      preparedHeaderRightBarButtonItems?.length);

  // Handle bar button item presses
  const onPressHeaderBarButtonItem = hasHeaderBarButtonItems
    ? (event: NativeSyntheticEvent<{ buttonId: string }>) => {
        const pressedItem = [
          ...(preparedHeaderLeftBarButtonItems ?? []),
          ...(preparedHeaderRightBarButtonItems ?? []),
        ].find(
          item =>
            item &&
            'buttonId' in item &&
            item.buttonId === event.nativeEvent.buttonId,
        );
        if (
          pressedItem &&
          pressedItem.type === 'button' &&
          pressedItem.onPress
        ) {
          pressedItem.onPress();
        }
      }
    : undefined;

  // Handle bar button menu item presses by deep-searching nested menus
  const onPressHeaderBarButtonMenuItem = hasHeaderBarButtonItems
    ? (event: NativeSyntheticEvent<{ menuId: string }>) => {
        // Recursively search menu tree
        const findInMenu = (
          menu: HeaderBarButtonItemWithMenu['menu'],
          menuId: string,
        ): HeaderBarButtonItemMenuAction | undefined => {
          for (const item of menu.items) {
            if ('items' in item) {
              // submenu: recurse
              const found = findInMenu(item, menuId);
              if (found) {
                return found;
              }
            } else if ('menuId' in item && item.menuId === menuId) {
              return item;
            }
          }
          return undefined;
        };

        // Check each bar-button item with a menu
        const allItems = [
          ...(preparedHeaderLeftBarButtonItems ?? []),
          ...(preparedHeaderRightBarButtonItems ?? []),
        ];
        for (const item of allItems) {
          if (item && item.type === 'menu' && item.menu) {
            const action = findInMenu(item.menu, event.nativeEvent.menuId);
            if (action) {
              action.onPress();
              return;
            }
          }
        }
      }
    : undefined;

  return (
    <ScreenStackHeaderConfigNativeComponent
      {...props}
      headerLeftBarButtonItems={preparedHeaderLeftBarButtonItems}
      headerRightBarButtonItems={preparedHeaderRightBarButtonItems}
      onPressHeaderBarButtonItem={onPressHeaderBarButtonItem}
      onPressHeaderBarButtonMenuItem={onPressHeaderBarButtonMenuItem}
      ref={ref}
      style={styles.headerConfig}
      pointerEvents="box-none"
    />
  );
});

ScreenStackHeaderConfig.displayName = 'ScreenStackHeaderConfig';

export const ScreenStackHeaderBackButtonImage = (
  props: ImageProps,
): JSX.Element => (
  <ScreenStackHeaderSubview type="back" style={styles.headerSubview}>
    <Image resizeMode="center" fadeDuration={0} {...props} />
  </ScreenStackHeaderSubview>
);

export const ScreenStackHeaderRightView = (
  props: ScreenStackHeaderSubviewProps & ViewProps,
): JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="right"
      style={[styles.headerSubview, style]}
    />
  );
};

export const ScreenStackHeaderLeftView = (
  props: ScreenStackHeaderSubviewProps & ViewProps,
): JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="left"
      style={[styles.headerSubview, style]}
    />
  );
};

export const ScreenStackHeaderCenterView = (props: ViewProps): JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="center"
      style={[styles.headerSubviewCenter, style]}
    />
  );
};

export const ScreenStackHeaderSearchBarView = (
  props: ViewProps,
): JSX.Element => (
  <ScreenStackHeaderSubview
    {...props}
    type="searchBar"
    style={styles.headerSubview}
  />
);

const styles = StyleSheet.create({
  headerSubview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubviewCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  headerConfig: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // We only want to center align the subviews on iOS.
    // See https://github.com/software-mansion/react-native-screens/pull/2456
    alignItems: Platform.OS === 'ios' ? 'center' : undefined,
  },
});
