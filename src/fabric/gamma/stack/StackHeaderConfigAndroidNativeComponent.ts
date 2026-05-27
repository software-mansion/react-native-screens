'use client';

import type {
  ColorValue,
  CodegenTypes as CT,
  HostComponent,
  ImageSource,
  ViewProps,
} from 'react-native';
import { codegenNativeCommands, codegenNativeComponent } from 'react-native';

type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

type StackHeaderToolbarMenuItemClickedEvent = Readonly<{
  id: string;
}>;

type StackHeaderToolbarMenuItemShowAsActionAndroid =
  | 'always'
  | 'alwaysWithText'
  | 'ifRoom'
  | 'ifRoomWithText'
  | 'never';

export interface StackHeaderToolbarMenuItemAndroid {
  id: string;
  title?: CT.WithDefault<string, ''>;
  hidden?: CT.WithDefault<boolean, false>;
  showAsAction?: CT.WithDefault<
    StackHeaderToolbarMenuItemShowAsActionAndroid,
    'never'
  >;
  drawableIconResourceName?: string | undefined;
  imageIconResource?: ImageSource | undefined;
  iconTintColorNormal?: ColorValue | undefined;
  iconTintColorPressed?: ColorValue | undefined;
  iconTintColorFocused?: ColorValue | undefined;
  iconTintColorDisabled?: ColorValue | undefined;
}

export interface NativeProps extends ViewProps {
  title?: string | undefined;
  hidden?: CT.WithDefault<boolean, false>;
  transparent?: CT.WithDefault<boolean, false>;
  backButtonHidden?: CT.WithDefault<boolean, false>;

  // Android-specific props
  type?: CT.WithDefault<StackHeaderTypeAndroid, 'small'>;

  backButtonTintColor?: ColorValue | undefined;
  backButtonDrawableIconResourceName?: string | undefined;
  backButtonImageIconResource?: ImageSource | undefined;

  scrollFlagScroll?: CT.WithDefault<boolean, false>;
  scrollFlagEnterAlways?: CT.WithDefault<boolean, false>;
  scrollFlagEnterAlwaysCollapsed?: CT.WithDefault<boolean, false>;
  scrollFlagExitUntilCollapsed?: CT.WithDefault<boolean, false>;
  scrollFlagSnap?: CT.WithDefault<boolean, false>;

  toolbarMenuItems?: StackHeaderToolbarMenuItemAndroid[] | undefined;
  onToolbarMenuItemClicked?:
    | CT.DirectEventHandler<StackHeaderToolbarMenuItemClickedEvent>
    | undefined;

  // When StackHeaderToolbarMenuItemAndroid is used as an array
  // in toolbarMenuItems, Codegen doesn't generate an enum in Props.h
  // which causes a build failure on iOS. By adding a property where
  // StackHeaderToolbarMenuItemAndroid is used directly, we ensure
  // that the enum is generated.
  DO_NOT_USE?: StackHeaderToolbarMenuItemAndroid | undefined;
}

type ComponentType = HostComponent<NativeProps>;

export type StackHeaderToolbarMenuItemOptionsAndroid = Partial<
  Omit<StackHeaderToolbarMenuItemAndroid, 'id'>
>;

export interface NativeCommands {
  setToolbarMenuItemOptions: (
    viewRef: React.ComponentRef<ComponentType>,
    id: string,
    // We use the array here only due to codegen limitation. We're using only
    // the first index of the array.
    options: StackHeaderToolbarMenuItemOptionsAndroid[],
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['setToolbarMenuItemOptions'],
});

export default codegenNativeComponent<NativeProps>(
  'RNSStackHeaderConfigAndroid',
  {
    interfaceOnly: true,
    excludedPlatforms: ['iOS'],
  },
);
