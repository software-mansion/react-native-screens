'use client';

import type {
  CodegenTypes as CT,
  HostComponent,
  ViewProps,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';

interface NativeProps extends ViewProps {
  containerId?: CT.WithDefault<string, ''>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSContainedModalProvider',
  {
    excludedPlatforms: ['android'],
  },
) as HostComponent<NativeProps>;
