import { codegenNativeComponent, type ViewProps } from 'react-native';

export interface NativeBarMenuSubmenuProps extends ViewProps {
  identifier?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  inlinePresentation?: boolean;
  layout?: string;
  destructive?: boolean;
  multiselectable?: boolean;
  selectedId?: string;
  defaultSelectedId?: string;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  hasSelectedId?: boolean;
  hasSelectedIds?: boolean;
}

export default codegenNativeComponent<NativeBarMenuSubmenuProps>(
  'RNSBarMenuSubmenu'
);
