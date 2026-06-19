export interface StackHeaderMenuItemIOS {
  id: string;
  type: 'menuItem';
  title?: string | undefined;
  itemType?: 'action' | 'toggle' | 'inherit' | undefined;
  initialToggleState?: boolean | undefined;
  onPress?: () => void | undefined;
}

export interface StackHeaderMenuIOS {
  id: string;
  type: 'menu';
  title?: string | undefined;
  singleSelection?: boolean | undefined;
  children: StackHeaderMenuElementIOS[];
  onSelectionChanged?: (selectedMenuElementIds: string[]) => void;
}

export type StackHeaderMenuElementIOS =
  | StackHeaderMenuIOS
  | StackHeaderMenuItemIOS;
