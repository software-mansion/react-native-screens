export interface StackHeaderMenuItem {
  id: string;
  type: 'menuItem';
  title?: string | undefined;
  onPress?: () => void | undefined;
}

export interface StackHeaderMenu {
  id: string;
  type: 'menu';
  title?: string | undefined;
  children: StackHeaderMenuElement[];
}

export type StackHeaderMenuElement = StackHeaderMenu | StackHeaderMenuItem;
