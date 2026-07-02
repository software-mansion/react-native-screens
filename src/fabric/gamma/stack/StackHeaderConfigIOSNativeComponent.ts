'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

export type MenuItemPressEvent = Readonly<{ menuItemId: string }>;

export type MenuSelectionChangeEvent = Readonly<{
  menuId: string;
  selectedMenuItemIds: string[];
}>;

export interface NativeProps extends ViewProps {
  title?: string | undefined;
  subtitle?: string | undefined;
  hidden?: CT.WithDefault<boolean, false>;
  transparent?: CT.WithDefault<boolean, false>;
  backButtonHidden?: CT.WithDefault<boolean, false>;

  // iOS-specific props
  largeTitle?: string | undefined;
  largeSubtitle?: string | undefined;
  largeTitleEnabled?: CT.WithDefault<boolean, false>;

  onMenuItemPress?: CT.DirectEventHandler<MenuItemPressEvent> | undefined;
  onMenuSelectionChange?:
    | CT.DirectEventHandler<MenuSelectionChangeEvent>
    | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSStackHeaderConfigIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
