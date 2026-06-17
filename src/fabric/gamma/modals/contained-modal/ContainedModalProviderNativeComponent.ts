'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps } from 'react-native';

export interface NativeProps extends ViewProps {
  providerKey?: CT.WithDefault<string, ''>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSContainedModalProvider',
  {
    excludedPlatforms: ['android'],
  },
);
