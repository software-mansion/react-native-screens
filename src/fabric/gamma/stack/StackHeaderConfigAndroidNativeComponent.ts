'use client';

import type {
  ColorValue,
  CodegenTypes as CT,
  HostComponent,
  ImageSource,
  ProcessedColorValue,
  ViewProps,
} from 'react-native';
import { codegenNativeCommands, codegenNativeComponent } from 'react-native';
import type { UnsafeMixed } from '../../codegenUtils';

type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

export type StackHeaderToolbarMenuItemClickedEventAndroid = Readonly<{
  id: string;
}>;

type StackHeaderToolbarMenuItemShowAsActionAndroid =
  | 'always'
  | 'alwaysWithText'
  | 'ifRoom'
  | 'ifRoomWithText'
  | 'never';

export interface StackHeaderToolbarMenuItemBaseAndroid {
  id: string;
  title?: CT.WithDefault<string, ''>;
  hidden?: CT.WithDefault<boolean, false>;
  showAsAction?: CT.WithDefault<
    StackHeaderToolbarMenuItemShowAsActionAndroid,
    'never'
  >;
  drawableIconResourceName?: string | null | undefined;
  imageIconResource?: ImageSource | null | undefined;
  iconTintColorNormal?: ProcessedColorValue | null | undefined;
  iconTintColorPressed?: ProcessedColorValue | null | undefined;
  iconTintColorFocused?: ProcessedColorValue | null | undefined;
  iconTintColorDisabled?: ProcessedColorValue | null | undefined;
}

type StackHeaderToolbarMenuItemAndroid =
  StackHeaderToolbarMenuItemBaseAndroid & {
    type: 'menuItem';
  };

export type StackHeaderToolbarMenuBaseAndroid = {
  children?: StackHeaderToolbarMenuElementAndroid[] | undefined;
};

type StackHeaderToolbarMenuAndroid = StackHeaderToolbarMenuItemBaseAndroid &
  StackHeaderToolbarMenuBaseAndroid & {
    type: 'menu';
  };

export type StackHeaderToolbarMenuElementAndroid =
  | StackHeaderToolbarMenuItemAndroid
  | StackHeaderToolbarMenuAndroid;

export interface NativeProps extends ViewProps {
  title?: string | undefined;
  hidden?: CT.WithDefault<boolean, false>;
  transparent?: CT.WithDefault<boolean, false>;
  backButtonHidden?: CT.WithDefault<boolean, false>;

  // Android-specific props
  type?: CT.WithDefault<StackHeaderTypeAndroid, 'small'>;

  backButtonTintColorNormal?: ColorValue | undefined;
  backButtonTintColorPressed?: ColorValue | undefined;
  backButtonTintColorFocused?: ColorValue | undefined;
  backButtonDrawableIconResourceName?: string | undefined;
  backButtonImageIconResource?: ImageSource | undefined;

  scrollFlagScroll?: CT.WithDefault<boolean, false>;
  scrollFlagEnterAlways?: CT.WithDefault<boolean, false>;
  scrollFlagEnterAlwaysCollapsed?: CT.WithDefault<boolean, false>;
  scrollFlagExitUntilCollapsed?: CT.WithDefault<boolean, false>;
  scrollFlagSnap?: CT.WithDefault<boolean, false>;

  toolbarMenu?: UnsafeMixed<StackHeaderToolbarMenuBaseAndroid> | undefined;
  onToolbarMenuItemClicked?:
    | CT.DirectEventHandler<StackHeaderToolbarMenuItemClickedEventAndroid>
    | undefined;
}

type ComponentType = HostComponent<NativeProps>;

export type StackHeaderToolbarMenuItemOptionsAndroid = Partial<
  Omit<StackHeaderToolbarMenuItemBaseAndroid, 'id'>
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
