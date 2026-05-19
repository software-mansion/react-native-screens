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

type ToolbarMenuItemClickedEvent = Readonly<{
  id: string;
}>;

export interface ToolbarMenuItemAndroid {
  id: string;
  title?: CT.WithDefault<string, ''>;
  hidden?: CT.WithDefault<boolean, false>;
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

  toolbarMenuItems?: ToolbarMenuItemAndroid[] | undefined;
  onToolbarMenuItemClicked?:
    | CT.DirectEventHandler<ToolbarMenuItemClickedEvent>
    | undefined;
}

type ComponentType = HostComponent<NativeProps>;

export type ToolbarMenuItemOptionsAndroid = Partial<
  Omit<ToolbarMenuItemAndroid, 'id'>
>;

export interface NativeCommands {
  setToolbarMenuItemOptions: (
    viewRef: React.ComponentRef<ComponentType>,
    id: string,
    // We use the array here only due to codegen limitation. We're using only
    // the first index of the array.
    options: ToolbarMenuItemOptionsAndroid[],
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
