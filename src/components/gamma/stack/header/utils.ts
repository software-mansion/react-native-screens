import { StackHeaderMenuElementIOS } from './ios/StackHeaderMenu.ios.types';
import { SupportsMenuIOS } from './StackHeaderConfig.ios.types';

export function findMenuElementByIdInItems(
  items: SupportsMenuIOS[],
  id: string,
): StackHeaderMenuElementIOS | null {
  for (const item of items) {
    if (item.menu === undefined) {
      continue;
    }

    const menu = findMenuElementById(item.menu, id);
    if (menu !== null) {
      return menu;
    }
  }

  return null;
}

export function findMenuElementById(
  menu: StackHeaderMenuElementIOS,
  id: string,
): StackHeaderMenuElementIOS | null {
  if (menu.id === id) {
    return menu;
  }

  if (menu.type === 'menu') {
    for (const child of menu.children) {
      const result = findMenuElementById(child, id);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}
