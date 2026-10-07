'use client';

import { codegenNativeComponent } from 'react-native';
import type {
  CodegenTypes as CT,
  HostComponent,
  ViewProps,
} from 'react-native';

export type HeaderSubviewVisibilityPriority = 'low' | 'standard' | 'high';

export type HeaderSubviewTypes =
  | 'back'
  | 'right'
  | 'left'
  | 'title'
  | 'center'
  | 'searchBar';

export interface NativeProps extends ViewProps {
  type?: CT.WithDefault<HeaderSubviewTypes, 'left'>;
  hidesSharedBackground?: boolean | undefined;
  visibilityPriority?: CT.WithDefault<
    HeaderSubviewVisibilityPriority,
    'standard'
  >;
  synchronousShadowStateUpdatesEnabled?: CT.WithDefault<boolean, true>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSScreenStackHeaderSubview',
  {
    interfaceOnly: true,
  },
) as HostComponent<NativeProps>;
