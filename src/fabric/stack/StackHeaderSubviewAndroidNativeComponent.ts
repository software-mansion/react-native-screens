'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type StackHeaderSubviewTypeAndroid =
  | 'background'
  | 'leading'
  | 'center'
  | 'trailing';
type StackHeaderSubviewBackgroundCollapseModeAndroid = 'off' | 'parallax';

export interface NativeProps extends ViewProps {
  type?: CT.WithDefault<StackHeaderSubviewTypeAndroid, 'leading'>;
  collapseMode?: CT.WithDefault<
    StackHeaderSubviewBackgroundCollapseModeAndroid,
    'off'
  >;
}

export default codegenNativeComponent<NativeProps>(
  'RNSStackHeaderSubviewAndroid',
  {
    interfaceOnly: true,
    excludedPlatforms: ['iOS'],
  },
);
