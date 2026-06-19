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

export function validateMenuCallbacks(menu: StackHeaderMenu): void {
  walkMenuTreeAndValidateCallbacks(menu, false);
}

function walkMenuTreeAndValidateCallbacks(
  menu: StackHeaderMenu,
  insideSingleSelection: boolean,
): void {
  // If this menu starts a singleSelection hierarchy, mark it.
  // If already inside one, stay inside.
  const isInsideSingleSelection = insideSingleSelection || menu.singleSelection;

  for (const child of menu.children) {
    if (child.type === 'menuItem') {
      if (child.itemType === 'toggle') {
        console.warn(
          `[RNScreens] onPress on menu item "${child.menuElementId}" will not fire ` +
            'because it is a toggle. Use onSelectionChanged on parent menu instead.',
        );
      }
    }

    if (child.type === 'menu') {
      if (isInsideSingleSelection && child.onSelectionChanged) {
        console.warn(
          `[RNScreens] onSelectionChanged on menu "${child.menuElementId}" will not fire ` +
            'because it is nested inside a singleSelection hierarchy. ' +
            'Place onSelectionChanged on the topmost singleSelection menu instead.',
        );
      }

      walkMenuTreeAndValidateCallbacks(child, isInsideSingleSelection ?? false);
    }
  }
}
