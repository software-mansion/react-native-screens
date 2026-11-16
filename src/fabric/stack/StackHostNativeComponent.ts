'use client';

import type {
  HostComponent,
  ViewProps,
  CodegenTypes as CT,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';

type StackHostColorScheme = 'inherit' | 'light' | 'dark';
type StackHostLayoutDirection = 'inherit' | 'ltr' | 'rtl';

export interface NativeProps extends ViewProps {
  // General
  colorScheme?: CT.WithDefault<StackHostColorScheme, 'inherit'>;
  // Not `direction`: that name is RN's style prop.
  layoutDirection?: CT.WithDefault<StackHostLayoutDirection, 'inherit'>;

  // Internal, iOS. In headless mode the host does not show the stack itself.
  // The stack is shown by the native component the host is rendered in. A
  // host in headless mode has to be rendered with `display: 'contents'`, so
  // that it takes no part in layout. Can be set once.
  headlessModeEnabled?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSStackHost', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
