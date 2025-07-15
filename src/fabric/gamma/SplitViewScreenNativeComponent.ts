'use client';

import type { ViewProps } from 'react-native';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type SplitViewScreenColumnType = 'column' | 'inspector';

export interface NativeProps extends ViewProps {
  // Config

  columnType?: WithDefault<SplitViewScreenColumnType, 'column'>;
}

export default codegenNativeComponent<NativeProps>('RNSSplitViewScreen', {
  interfaceOnly: true,
});
