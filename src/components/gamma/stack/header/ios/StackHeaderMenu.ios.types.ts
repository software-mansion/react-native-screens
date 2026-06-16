export interface StackHeaderMenuItem {
  menuElementId: string;
  type: 'menuItem';
  title?: string | undefined;
  onPress?: () => void | undefined;
}

export interface StackHeaderMenu {
  menuElementId: string;
  type: 'menu';
  title?: string | undefined;
  children: StackHeaderMenuElement[];
}

export type StackHeaderMenuElement = StackHeaderMenu | StackHeaderMenuItem;
