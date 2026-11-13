'use client';

import type {
  HostComponent,
  ViewProps,
  CodegenTypes as CT,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';

type StackHostColorScheme = 'inherit' | 'light' | 'dark';

export interface NativeProps extends ViewProps {
  // General
  colorScheme?: CT.WithDefault<StackHostColorScheme, 'inherit'>;

  // Internal, iOS. The host does not create a navigation controller of its
  // own. It takes no part in layout and operates on the navigation controller
  // it gets from the native container it is rendered in.
  usesExternalNavigationController?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSStackHost', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
