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
    const image = item.image ? Image.resolveAssetSource(item.image) : undefined;

    const titleStyle = item.titleStyle
      ? { ...item.titleStyle, color: processColor(item.titleStyle.color) }
      : undefined;
    const tintColor = item.tintColor ? processColor(item.tintColor) : undefined;
    const badge = item.badge
      ? {
          ...item.badge,
          color: processColor(item.badge.color),
          backgroundColor: processColor(item.badge.backgroundColor),
        }
      : undefined;
    const processedItem = {
      ...item,
      image,
      titleStyle,
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
