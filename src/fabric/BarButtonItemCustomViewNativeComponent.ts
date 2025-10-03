'use client';

// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

export interface NativeProps extends ViewProps {
  hidesSharedBackground?: WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSBarButtonItemCustomView',
  {
    excludedPlatforms: ['android'],
  },
);
