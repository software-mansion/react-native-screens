'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type StackHeaderSubviewTypeAndroid = 'left' | 'center' | 'right';

export interface NativeProps extends ViewProps {
  type?: CT.WithDefault<StackHeaderSubviewTypeAndroid, 'left'>;
}

export default codegenNativeComponent<NativeProps>('RNSStackHeaderSubview', {
  interfaceOnly: true,
});
