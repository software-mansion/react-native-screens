'use client';

import type {
  CodegenTypes as CT,
  HostComponent,
  ProcessedColorValue,
  ViewProps,
} from 'react-native';
import { codegenNativeCommands, codegenNativeComponent } from 'react-native';
import type {
  PlatformIconIOS,
  StackHeaderMenuIOS,
} from './StackHeaderItemIOSNativeComponent';
import { UnsafeMixed } from '../codegenUtils';

type BackButtonDisplayMode = 'default' | 'generic' | 'minimal';

export type HeaderAppearance = {
  titleFontFamily?: string | undefined;
  titleFontSize?: CT.Float | undefined;
  titleFontWeight?: string | undefined;
  titleFontStyle?: string | undefined;
  titleFontColor?: ProcessedColorValue | null | undefined;

  largeTitleFontFamily?: string | undefined;
  largeTitleFontSize?: CT.Float | undefined;
  largeTitleFontWeight?: string | undefined;
  largeTitleFontStyle?: string | undefined;
  largeTitleFontColor?: ProcessedColorValue | null | undefined;

  subtitleFontFamily?: string | undefined;
  subtitleFontSize?: CT.Float | undefined;
  subtitleFontWeight?: string | undefined;
  subtitleFontStyle?: string | undefined;
  subtitleFontColor?: ProcessedColorValue | null | undefined;
};

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
  backButtonTitle?: string | undefined;
  backButtonDisplayMode?: CT.WithDefault<BackButtonDisplayMode, 'default'>;
  backButtonMenuEnabled?: CT.WithDefault<boolean, true>;

  largeTitle?: string | undefined;
  largeSubtitle?: string | undefined;
  largeTitleEnabled?: CT.WithDefault<boolean, false>;

  prompt?: string | undefined;

  titleMenu?: UnsafeMixed<StackHeaderMenuIOS> | undefined;

  standardAppearance?: UnsafeMixed<HeaderAppearance> | undefined;
  scrollEdgeAppearance?: UnsafeMixed<HeaderAppearance> | undefined;

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
}) as HostComponent<NativeProps>;
