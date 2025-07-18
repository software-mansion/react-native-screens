'use client';

import type { ViewProps } from 'react-native';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type SplitViewScreenColumnType = 'column' | 'inspector';

interface InternalNativeProps extends ViewProps {
  // Config
  columnType?: WithDefault<SplitViewScreenColumnType, 'column'>;
}

export interface NativeProps extends ViewProps {}

export default codegenNativeComponent<InternalNativeProps>(
  'RNSSplitViewScreen',
  {
    interfaceOnly: true,
  },
);
