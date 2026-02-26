import React from 'react';
import { type ColorValue, type ViewProps } from 'react-native';
import BarView from './BarViewNativeComponent';
import BarItemNative, {
  type NativeBarItemProps,
} from './BarItemNativeComponent';
import BarMenuNative, {
  type NativeBarMenuProps,
} from './BarMenuNativeComponent';
import BarMenuActionNative, {
  type NativeBarMenuActionProps,
} from './BarMenuActionNativeComponent';
import BarMenuSubmenuNative, {
  type NativeBarMenuSubmenuProps,
} from './BarMenuSubmenuNativeComponent';
import BarSpacerNative, {
  type BarSpacerProps,
} from './BarSpacerNativeComponent';

export type BarPlacement = 'header' | 'toolbar';

export type BarProps = ViewProps & {
  placement?: BarPlacement;
  children?: React.ReactNode;
};

export type BarIcon = {
  type: 'sfSymbol';
  name: string;
};

export type BarTitleStyle = {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: ColorValue;
};

export type BarBadgeStyle = {
  color?: ColorValue;
  backgroundColor?: ColorValue;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
};

export type BarBadge = {
  value: number | string;
  style?: BarBadgeStyle;
};

export type BarItemVariant = 'plain' | 'done' | 'prominent';
export type BarItemPlacement = 'left' | 'right';

type SharedBarItemProps = {
  title?: string;
  titleStyle?: BarTitleStyle;
  icon?: BarIcon;
  placement?: BarItemPlacement;
  variant?: BarItemVariant;
  tintColor?: ColorValue;
  disabled?: boolean;
  width?: number;
  identifier?: string;
  hidesSharedBackground?: boolean;
  sharesBackground?: boolean;
  badge?: BarBadge;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
};

export function Bar(props: BarProps) {
  return <BarView {...props} style={{ height: 0, width: 0 }} />;
}

export type BarItemProps = SharedBarItemProps & {
  selected?: boolean;
  onPress?: () => void;
};

export type BarMenuProps = SharedBarItemProps & {
  selected?: boolean;
  menuTitle?: string;
  menuLayout?: 'default' | 'palette';
  menuMultiselectable?: boolean;
  selectedId?: string;
  defaultSelectedId?: string;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (selection: { id: string; ids: string[] }) => void;
  children?: React.ReactNode;
};

export type BarMenuActionProps = {
  identifier?: string;
  title: string;
  subtitle?: string;
  icon?: BarIcon;
  onPress?: () => void;
  state?: 'on' | 'off' | 'mixed';
  disabled?: boolean;
  destructive?: boolean;
  hidden?: boolean;
  keepsMenuPresented?: boolean;
  discoverabilityLabel?: string;
};

export type BarMenuSubmenuProps = {
  identifier?: string;
  title: string;
  subtitle?: string;
  icon?: BarIcon;
  inline?: boolean;
  layout?: 'default' | 'palette';
  destructive?: boolean;
  multiselectable?: boolean;
  selectedId?: string;
  defaultSelectedId?: string;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  children?: React.ReactNode;
};

const resolveIconProps = (icon?: BarIcon) => {
  if (!icon) {
    return {};
  }

  return {
    icon: icon.name,
  };
};

const mapTitleStyle = (style?: BarTitleStyle) => {
  if (!style) {
    return {};
  }

  return {
    titleFontFamily: style.fontFamily,
    titleFontSize: style.fontSize,
    titleFontWeight: style.fontWeight,
    titleColor: style.color,
  };
};

const mapBadge = (badge?: BarBadge) => {
  if (!badge) {
    return {
      hasBadge: false,
    };
  }

  const value = badge.value;

  return {
    hasBadge: true,
    badgeCount: typeof value === 'number' ? value : undefined,
    badgeValue: typeof value === 'string' ? value : undefined,
    badgeForegroundColor: badge.style?.color,
    badgeBackgroundColor: badge.style?.backgroundColor,
    badgeFontFamily: badge.style?.fontFamily,
    badgeFontSize: badge.style?.fontSize,
    badgeFontWeight: badge.style?.fontWeight,
  };
};

const applySharedProps = (
  props: SharedBarItemProps & {
    selected?: boolean;
  }
) => {
  const { icon, badge, titleStyle, sharesBackground, selected, ...rest } =
    props;

  const iconProps = resolveIconProps(icon);
  const badgeProps = mapBadge(badge);
  const titleStyleProps = mapTitleStyle(titleStyle);
  const hasSharesBackground = sharesBackground !== undefined;

  return {
    ...rest,
    ...badgeProps,
    ...titleStyleProps,
    ...iconProps,
    selected,
    hasSharesBackground,
    sharesBackground: sharesBackground ?? false,
  };
};

Bar.Item = function BarItem({ onPress, ...rest }: BarItemProps) {
  const nativeProps: NativeBarItemProps = {
    ...applySharedProps(rest),
  };

  return <BarItemNative {...nativeProps} onItemPress={onPress} />;
};

Bar.Menu = function BarMenu({ children, ...rest }: BarMenuProps) {
  const changesSelectionAsPrimaryAction = rest.onSelectionChange !== undefined;
  const hasSelectedId = rest.selectedId !== undefined;
  const hasSelectedIds = rest.selectedIds !== undefined;

  const nativeProps: NativeBarMenuProps = {
    ...applySharedProps(rest),
    changesSelectionAsPrimaryAction,
    menuTitle: rest.menuTitle,
    menuLayout: rest.menuLayout,
    menuMultiselectable: rest.menuMultiselectable,
    selectedId: rest.selectedId,
    defaultSelectedId: rest.defaultSelectedId,
    selectedIds: rest.selectedIds,
    defaultSelectedIds: rest.defaultSelectedIds,
    hasSelectedId,
    hasSelectedIds,
    onSelectionChange: rest.onSelectionChange
      ? (event) => {
          rest.onSelectionChange?.({
            id: event.nativeEvent.id,
            ids: event.nativeEvent.ids,
          });
        }
      : undefined,
  };

  return <BarMenuNative {...nativeProps}>{children}</BarMenuNative>;
};

Bar.MenuAction = function BarMenuAction({
  onPress,
  icon,
  ...rest
}: BarMenuActionProps) {
  const nativeProps: NativeBarMenuActionProps = {
    ...rest,
    ...resolveIconProps(icon),
  };

  return <BarMenuActionNative {...nativeProps} onMenuActionPress={onPress} />;
};

Bar.MenuSubmenu = function BarMenuSubmenu({
  icon,
  children,
  inline,
  ...rest
}: BarMenuSubmenuProps) {
  const hasSelectedId = rest.selectedId !== undefined;
  const hasSelectedIds = rest.selectedIds !== undefined;

  const nativeProps: NativeBarMenuSubmenuProps = {
    ...rest,
    ...resolveIconProps(icon),
    inlinePresentation: inline,
    selectedId: rest.selectedId,
    defaultSelectedId: rest.defaultSelectedId,
    selectedIds: rest.selectedIds,
    defaultSelectedIds: rest.defaultSelectedIds,
    hasSelectedId,
    hasSelectedIds,
  };

  return (
    <BarMenuSubmenuNative {...nativeProps}>{children}</BarMenuSubmenuNative>
  );
};

Bar.Spacer = function BarSpacer(props: BarSpacerProps) {
  return <BarSpacerNative {...props} />;
};
