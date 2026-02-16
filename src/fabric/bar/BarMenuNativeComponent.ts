import {
  codegenNativeComponent,
  type ColorValue,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeBarMenuProps extends ViewProps {
  title?: string;
  icon?: string;
  placement?: string;
  variant?: string;
  tintColor?: ColorValue;
  width?: CodegenTypes.Double;
  disabled?: boolean;
  selected?: boolean;
  changesSelectionAsPrimaryAction?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  titleFontFamily?: string;
  titleFontSize?: CodegenTypes.Double;
  titleFontWeight?: string;
  titleColor?: ColorValue;
  identifier?: string;
  hidesSharedBackground?: boolean;
  sharesBackground?: boolean;
  hasSharesBackground?: boolean;
  badgeCount?: CodegenTypes.Int32;
  badgeValue?: string;
  badgeForegroundColor?: ColorValue;
  badgeBackgroundColor?: ColorValue;
  badgeFontFamily?: string;
  badgeFontSize?: CodegenTypes.Double;
  badgeFontWeight?: string;
  hasBadge?: boolean;
  menuTitle?: string;
  menuLayout?: string;
  menuMultiselectable?: boolean;
  selectedId?: string;
  defaultSelectedId?: string;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  hasSelectedId?: boolean;
  hasSelectedIds?: boolean;
  onSelectionChange?: CodegenTypes.DirectEventHandler<{
    id: string;
    ids: string[];
  }>;
}

export default codegenNativeComponent<NativeBarMenuProps>('RNSBarMenu');
