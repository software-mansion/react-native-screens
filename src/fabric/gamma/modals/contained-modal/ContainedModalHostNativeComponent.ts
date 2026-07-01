'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps } from 'react-native';

export interface NativeProps extends ViewProps {
  isOpen?: CT.WithDefault<boolean, false>;
  targetContainerId?: CT.WithDefault<string, ''>;
}

export default codegenNativeComponent<NativeProps>('RNSContainedModalHost', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
