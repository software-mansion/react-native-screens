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
}

export default codegenNativeComponent<NativeProps>(
  'RNSStackHost',
  {},
) as HostComponent<NativeProps>;
