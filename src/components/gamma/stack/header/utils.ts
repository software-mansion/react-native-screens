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

/**
 * In a singleSelection hierarchy, only one item can have initialToggleState: true.
 * UIKit honors only the first one and native code asserts that this is the case.
 * This function enforces the constraint by keeping only the first
 * initialToggleState: true per singleSelection root and warning about the rest.
 *
 * Must be called before the menu data reaches the native component.
 */
export function sanitizeMenuInitialToggleStates(menu: StackHeaderMenu): void {
  walkMenuTreeAndSanitizeInitialToggleStates(menu, false, null);
}

function walkMenuTreeAndValidateCallbacks(
  menu: StackHeaderMenu,
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
          (isInsideSingleSelection && child.itemType === 'inherit')) &&
        child.onPress
      ) {
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

function walkMenuTreeAndSanitizeInitialToggleStates(
  menu: StackHeaderMenu,
  insideSingleSelection: boolean,
  initialSingleSelectionStateClaimed: { claimed: boolean } | null,
): void {
  // When entering a new singleSelection root, create a fresh flag.
  // Multiple independent singleSelection roots each get their own.
  let resolvedInitialSingleSelectionStateClaimed =
    initialSingleSelectionStateClaimed;
  if (!insideSingleSelection && menu.singleSelection) {
    resolvedInitialSingleSelectionStateClaimed = { claimed: false };
  }
  const isInsideSingleSelection = insideSingleSelection || menu.singleSelection;

  for (const child of menu.children) {
    if (child.type === 'menuItem') {
      if (
        resolvedInitialSingleSelectionStateClaimed != null &&
        child.initialToggleState
      ) {
        if (resolvedInitialSingleSelectionStateClaimed.claimed) {
          console.warn(
            `[RNScreens] Multiple items with initialToggleState: true in singleSelection ` +
              `menu. Only the first one will be honored. ` +
              `Item "${child.menuElementId}" will be initialized as off.`,
          );
          child.initialToggleState = false;
        } else {
          resolvedInitialSingleSelectionStateClaimed.claimed = true;
        }
      }
    }

    if (child.type === 'menu') {
      walkMenuTreeAndSanitizeInitialToggleStates(
        child,
        isInsideSingleSelection ?? false,
        resolvedInitialSingleSelectionStateClaimed,
      );
    }
  }
}
