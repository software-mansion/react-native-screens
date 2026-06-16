export interface StackHeaderMenuItem {
  type: 'menuItem';
  title?: string | undefined;
}

export interface StackHeaderMenu {
  type: 'menu';
  title?: string | undefined;
  children: StackHeaderMenuElement[];
}

export type StackHeaderMenuElement = StackHeaderMenu | StackHeaderMenuItem;
