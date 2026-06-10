import { StackHeaderMenuElement } from './ios/StackHeaderMenu.ios.types';
import { SupportsMenuIOS } from './StackHeaderConfig.ios.types';

export function findMenuElementByIdInItems(
  items: SupportsMenuIOS[],
  menuElementId: string,
): StackHeaderMenuElement | null {
  for (const item of items) {
    if (item.menu === undefined) {
      continue;
    }

    const menu = findMenuElementById(item.menu, menuElementId);
    if (menu !== null) {
      return menu;
    }
  }

  return null;
}

export function findMenuElementById(
  menu: StackHeaderMenuElement,
  menuElementId: string,
): StackHeaderMenuElement | null {
  if (menu.menuElementId === menuElementId) {
    return menu;
  }

  if (menu.type === 'menu') {
    for (const child of menu.children) {
      const result = findMenuElementById(child, menuElementId);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}
