'use client';

import type {
  CodegenTypes as CT,
  HostComponent,
  ViewProps,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';

interface NativeProps extends ViewProps {
  isOpen?: CT.WithDefault<boolean, false>;
  targetContainerId?: CT.WithDefault<string, ''>;
}

export default codegenNativeComponent<NativeProps>('RNSContainedModalHost', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
