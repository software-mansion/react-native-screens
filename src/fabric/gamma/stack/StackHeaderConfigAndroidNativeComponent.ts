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

export type StackHeaderToolbarMenuItemPressEventAndroid = Readonly<{
  id: string;
}>;

export type StackHeaderToolbarMenuGroupSelectionChangeEventAndroid = Readonly<{
  groupId: string;
  selectedIds: string[];
}>;

type StackHeaderToolbarMenuItemShowAsActionAndroid =
  | 'always'
  | 'alwaysWithText'
  | 'ifRoom'
  | 'ifRoomWithText'
  | 'never';

type StackHeaderToolbarMenuItemTypeAndroid = 'action' | 'toggle' | 'automatic';

export interface StackHeaderToolbarMenuItemBaseAndroid {
  id: string;
  title?: string | undefined;
  titleCondensed?: string | undefined;
  tooltipText?: string | undefined;
  hidden?: CT.WithDefault<boolean, false>;
  disabled?: CT.WithDefault<boolean, false>;
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
    groupId?: string | undefined;
    itemType?: CT.WithDefault<
      StackHeaderToolbarMenuItemTypeAndroid,
      'automatic'
    >;
    initialToggleState?: CT.WithDefault<boolean, false>;
  };

type StackHeaderToolbarMenuGroupAndroid = {
  groupId: string;
  singleSelection?: CT.WithDefault<boolean, false>;
};

export type StackHeaderToolbarMenuBaseAndroid = {
  groups?: StackHeaderToolbarMenuGroupAndroid[] | undefined;
  children?: StackHeaderToolbarMenuElementAndroid[] | undefined;
};

type StackHeaderToolbarMenuAndroid = StackHeaderToolbarMenuItemBaseAndroid &
  StackHeaderToolbarMenuBaseAndroid & {
    type: 'menu';
    menuTitle?: string | undefined;
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
  toolbarMenuGroupDividerEnabled?: CT.WithDefault<boolean, false>;
  onToolbarMenuItemPress?:
    | CT.DirectEventHandler<StackHeaderToolbarMenuItemPressEventAndroid>
    | undefined;
  onToolbarMenuGroupSelectionChange?:
    | CT.DirectEventHandler<StackHeaderToolbarMenuGroupSelectionChangeEventAndroid>
    | undefined;
}

type ComponentType = HostComponent<NativeProps>;

export type StackHeaderToolbarMenuElementOptionsAndroid = Partial<
  Omit<StackHeaderToolbarMenuItemBaseAndroid, 'id'>
> & {
  checked?: boolean | undefined;
  menuTitle?: string | undefined;
};

export interface NativeCommands {
  setToolbarMenuElementOptions: (
    viewRef: React.ComponentRef<ComponentType>,
    id: string,
    // We use the array here only due to codegen limitation. We're using only
    // the first index of the array.
    options: StackHeaderToolbarMenuElementOptionsAndroid[],
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['setToolbarMenuElementOptions'],
});

export default codegenNativeComponent<NativeProps>(
  'RNSStackHeaderConfigAndroid',
  {
    interfaceOnly: true,
    excludedPlatforms: ['iOS'],
  },
);
