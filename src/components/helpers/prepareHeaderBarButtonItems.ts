import { Image, processColor } from 'react-native';
import {
  HeaderBarButtonItem,
  HeaderBarButtonItemWithMenu,
} from 'react-native-screens/types';

const prepareMenu = (
  menu: HeaderBarButtonItemWithMenu['menu'],
  index: number,
  side: 'left' | 'right',
): HeaderBarButtonItemWithMenu['menu'] => {
  return {
    ...menu,
    items: menu.items.map((menuItem, menuIndex) => {
      const sfSymbolName =
        menuItem.icon?.type === 'sfSymbol' ? menuItem.icon.name : undefined;
      if (menuItem.type === 'submenu') {
        return {
          ...menuItem,
          sfSymbolName,
          ...prepareMenu(menuItem, menuIndex, side),
        };
      }
      return {
        ...menuItem,
        sfSymbolName,
        menuId: `${menuIndex}-${index}-${side}`,
      };
    }),
  };
};

export const prepareHeaderBarButtonItems = (
  barButtonItems: HeaderBarButtonItem[],
  side: 'left' | 'right',
) => {
  return barButtonItems?.map((item, index) => {
    if ('spacing' in item) {
      return item;
    }
    let imageSource;
    if (item.icon?.type === 'imageSource') {
      imageSource = Image.resolveAssetSource(item.icon.imageSource);
    } else if (item.icon?.type === 'templateSource') {
      imageSource = Image.resolveAssetSource(item.icon.templateSource);
    }

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
      sfSymbolName: item.icon?.type === 'sfSymbol' ? item.icon.name : undefined,
      labelStyle,
      tintColor,
      badge,
    };
    if ('onPress' in item) {
      return {
        ...processedItem,
        buttonId: `${index}-${side}`,
      };
    }
    if ('menu' in item) {
      return {
        ...processedItem,
        menu: prepareMenu(item.menu, index, side),
      };
    }
    return null;
  });
};
