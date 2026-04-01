'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

export interface NativeProps extends ViewProps {
  type?: CT.WithDefault<StackHeaderTypeAndroid, 'small'>;
  title?: string;
  hidden?: CT.WithDefault<boolean, false>;
  transparent?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSStackHeaderConfig', {
  interfaceOnly: true,
});
