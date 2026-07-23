'use client';

import type {
  CodegenTypes as CT,
  HostComponent,
  ViewProps,
} from 'react-native';
import { codegenNativeCommands, codegenNativeComponent } from 'react-native';
import { PlatformIconIOS } from './StackHeaderItemIOSNativeComponent';
import { UnsafeMixed } from '../codegenUtils';

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

type ComponentType = HostComponent<NativeProps>;

// Codegen requires a concrete interface — bare `object` causes
// "Unknown primitive type TSObjectKeyword". Fields are intentionally
// loose (all optional) because the native side uses 3-state semantics
// (key absent = no change, null = reset, value = set).
export interface NativeMenuElementOptionsIOS {
  title?: string | null | undefined;
  icon?: UnsafeMixed<PlatformIconIOS> | null | undefined;
  toggleState?: boolean | undefined;
}

export interface NativeCommands {
  setMenuItemOptions: (
    viewRef: React.ComponentRef<ComponentType>,
    menuElementId: string,
    // Array wrapper due to codegen limitation — only the first element is used.
    options: NativeMenuElementOptionsIOS[],
  ) => void;
  setMenuOptions: (
    viewRef: React.ComponentRef<ComponentType>,
    menuElementId: string,
    // Array wrapper due to codegen limitation — only the first element is used.
    options: NativeMenuElementOptionsIOS[],
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['setMenuItemOptions', 'setMenuOptions'],
});

export default codegenNativeComponent<NativeProps>('RNSStackHeaderConfigIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
