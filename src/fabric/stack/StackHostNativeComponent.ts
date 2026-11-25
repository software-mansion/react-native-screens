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

  // Internal, iOS. In headless mode the host does not show the stack itself.
  // The stack is shown by the native component the host is rendered in. A
  // host in headless mode has to be rendered with `display: 'contents'`, so
  // that it takes no part in layout. Can be set once.
  headlessModeEnabled?: CT.WithDefault<boolean, false>;

  // SPIKE (labs #2127 / #2128), Android only, throwaway. A target stack
  // applied by native whenever `prototypeRequestId` changes. Screens are
  // expected to be rendered with `activityMode: 'detached'`.
  prototypeRequestId?: CT.WithDefault<CT.Int32, 0>;
  prototypeStack?: ReadonlyArray<string>;
  // 'none' | 'cancel-post' | 'cancel-delay': what to do with a held predictive
  // back gesture when a request is applied.
  prototypeHeldBackMode?: CT.WithDefault<string, 'cancel-post'>;
}

export default codegenNativeComponent<NativeProps>('RNSStackHost', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
