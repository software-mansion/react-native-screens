import {
  StackHeaderMenuElementIOS,
  StackHeaderMenuIOS,
} from './ios/StackHeaderMenu.ios.types';
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

export function validateMenuCallbacks(menu: StackHeaderMenuIOS): void {
  walkMenuTreeAndValidateCallbacks(menu, false);
}

function walkMenuTreeAndValidateCallbacks(
  menu: StackHeaderMenuIOS,
  insideSingleSelection: boolean,
): void {
  // If this menu starts a singleSelection hierarchy, mark it.
  // If already inside one, stay inside.
  const isInsideSingleSelection =
    insideSingleSelection || !!menu.singleSelection;

  for (const child of menu.children) {
    if (child.type === 'menuItem') {
      if (
        (child.itemType === 'toggle' ||
          (isInsideSingleSelection &&
            (child.itemType ?? 'automatic') === 'automatic')) &&
        child.onPress
      ) {
        console.warn(
          `[RNScreens] onPress on menu item "${child.id}" will not fire ` +
            'because it is a toggle. Use onSelectionChange on parent menu instead.',
        );
      }
    }

    if (child.type === 'menu') {
      if (isInsideSingleSelection && child.onSelectionChange) {
        console.warn(
          `[RNScreens] onSelectionChange on menu "${child.id}" will not fire ` +
            'because it is nested inside a singleSelection hierarchy. ' +
            'Place onSelectionChange on the topmost singleSelection menu instead.',
        );
      }

      walkMenuTreeAndValidateCallbacks(child, isInsideSingleSelection);
    }
  }
}
