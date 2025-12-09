'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps } from 'react-native';

export type HeaderSubviewTypes =
  | 'back'
  | 'right'
  | 'left'
  | 'title'
  | 'center'
  | 'searchBar';

export interface NativeProps extends ViewProps {
  type?: CT.WithDefault<HeaderSubviewTypes, 'left'>;
  hidesSharedBackground?: boolean;
  synchronousShadowStateUpdatesEnabled?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSScreenStackHeaderSubview',
  {
    interfaceOnly: true,
  },
);
