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

  buttonFontFamily?: string | undefined;
  buttonFontSize?: CT.Float | undefined;
  buttonFontWeight?: string | undefined;
  buttonFontStyle?: string | undefined;
  buttonFontColor?: ProcessedColorValue | null | undefined;

  prominentButtonFontFamily?: string | undefined;
  prominentButtonFontSize?: CT.Float | undefined;
  prominentButtonFontWeight?: string | undefined;
  prominentButtonFontStyle?: string | undefined;
  prominentButtonFontColor?: ProcessedColorValue | null | undefined;

  buttonHighlightedFontFamily?: string | undefined;
  buttonHighlightedFontSize?: CT.Float | undefined;
  buttonHighlightedFontWeight?: string | undefined;
  buttonHighlightedFontStyle?: string | undefined;
  buttonHighlightedFontColor?: ProcessedColorValue | null | undefined;

  buttonDisabledFontFamily?: string | undefined;
  buttonDisabledFontSize?: CT.Float | undefined;
  buttonDisabledFontWeight?: string | undefined;
  buttonDisabledFontStyle?: string | undefined;
  buttonDisabledFontColor?: ProcessedColorValue | null | undefined;

  buttonFocusedFontFamily?: string | undefined;
  buttonFocusedFontSize?: CT.Float | undefined;
  buttonFocusedFontWeight?: string | undefined;
  buttonFocusedFontStyle?: string | undefined;
  buttonFocusedFontColor?: ProcessedColorValue | null | undefined;

  prominentButtonHighlightedFontFamily?: string | undefined;
  prominentButtonHighlightedFontSize?: CT.Float | undefined;
  prominentButtonHighlightedFontWeight?: string | undefined;
  prominentButtonHighlightedFontStyle?: string | undefined;
  prominentButtonHighlightedFontColor?: ProcessedColorValue | null | undefined;

  prominentButtonDisabledFontFamily?: string | undefined;
  prominentButtonDisabledFontSize?: CT.Float | undefined;
  prominentButtonDisabledFontWeight?: string | undefined;
  prominentButtonDisabledFontStyle?: string | undefined;
  prominentButtonDisabledFontColor?: ProcessedColorValue | null | undefined;

  prominentButtonFocusedFontFamily?: string | undefined;
  prominentButtonFocusedFontSize?: CT.Float | undefined;
  prominentButtonFocusedFontWeight?: string | undefined;
  prominentButtonFocusedFontStyle?: string | undefined;
  prominentButtonFocusedFontColor?: ProcessedColorValue | null | undefined;

  backButtonFontFamily?: string | undefined;
  backButtonFontSize?: CT.Float | undefined;
  backButtonFontWeight?: string | undefined;
  backButtonFontStyle?: string | undefined;
  backButtonFontColor?: ProcessedColorValue | null | undefined;

  backButtonHighlightedFontFamily?: string | undefined;
  backButtonHighlightedFontSize?: CT.Float | undefined;
  backButtonHighlightedFontWeight?: string | undefined;
  backButtonHighlightedFontStyle?: string | undefined;
  backButtonHighlightedFontColor?: ProcessedColorValue | null | undefined;

  backButtonFocusedFontFamily?: string | undefined;
  backButtonFocusedFontSize?: CT.Float | undefined;
  backButtonFocusedFontWeight?: string | undefined;
  backButtonFocusedFontStyle?: string | undefined;
  backButtonFocusedFontColor?: ProcessedColorValue | null | undefined;
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
