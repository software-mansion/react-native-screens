'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type StackHeaderSubviewTypeAndroid = 'left' | 'center' | 'right' | 'background';
type StackHeaderSubviewBackgroundCollapseModeAndroid = 'off' | 'parallax';

export interface NativeProps extends ViewProps {
  type?: CT.WithDefault<StackHeaderSubviewTypeAndroid, 'left'>;
  collapseMode?: CT.WithDefault<
    StackHeaderSubviewBackgroundCollapseModeAndroid,
    'parallax'
  >;
}

export default codegenNativeComponent<NativeProps>('RNSStackHeaderSubview', {
  interfaceOnly: true,
});
