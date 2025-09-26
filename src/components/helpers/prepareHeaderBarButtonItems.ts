import { Image, processColor } from 'react-native';
import {
  HeaderBarButtonItem,
  HeaderBarButtonItemWithMenu,
} from 'react-native-screens/types';

const prepareMenu = (
  menu: HeaderBarButtonItemWithMenu['menu'],
  index: number,
  screenId: string,
  side: 'left' | 'right',
): HeaderBarButtonItemWithMenu['menu'] => {
  return {
    ...menu,
    items: menu.items.map((menuItem, menuIndex) => {
      if (menuItem.type === 'submenu') {
        return {
          ...menuItem,
          ...prepareMenu(menuItem, menuIndex, screenId, side),
        };
      }
      return {
        ...menuItem,
        menuId: `${menuIndex}-${index}-${screenId}-${side}`,
      };
    }),
  };
};

export const prepareHeaderBarButtonItems = (
  barButtonItems: HeaderBarButtonItem[],
  screenId: string,
  side: 'left' | 'right',
) => {
  return barButtonItems?.map((item, index) => {
    if ('spacing' in item) {
      return item;
    }
    const imageSource = item.imageSource
      ? Image.resolveAssetSource(item.imageSource)
      : undefined;

    const labelStyle = item.labelStyle
      ? { ...item.labelStyle, color: processColor(item.labelStyle.color) }
      : undefined;
    const tintColor = item.tintColor ? processColor(item.tintColor) : undefined;
    const badge = item.badge
      ? {
          ...item.badge,
          style: {
            ...item.badge.style,
            color: processColor(item.badge.style?.color),
            backgroundColor: processColor(item.badge.style?.backgroundColor),
          },
        }
      : undefined;
    const processedItem = {
      ...item,
      imageSource,
      labelStyle,
      tintColor,
      badge,
    };
    if ('onPress' in item) {
      return {
        ...processedItem,
        buttonId: `${index}-${screenId}-${side}`,
      };
    }
    if ('menu' in item) {
      return {
        ...processedItem,
        menu: prepareMenu(item.menu, index, screenId, side),
      };
    }
    return null;
  });
};
