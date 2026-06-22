export interface StackHeaderMenuItemIOS {
  id: string;
  type: 'menuItem';
  title?: string | undefined;
  onPress?: () => void | undefined;
}

export interface StackHeaderMenuIOS {
  id: string;
  type: 'menu';
  title?: string | undefined;
  children: StackHeaderMenuElementIOS[];
}

export type StackHeaderMenuElementIOS =
  | StackHeaderMenuIOS
  | StackHeaderMenuItemIOS;
