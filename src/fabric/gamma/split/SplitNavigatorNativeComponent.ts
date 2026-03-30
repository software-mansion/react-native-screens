'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type SplitNavigatorColumnType =
  | 'primary'
  | 'secondary'
  | 'supplementary'
  | 'inspector';

interface NativeProps extends ViewProps {
  columnType?: CT.WithDefault<SplitNavigatorColumnType, 'secondary'>;
}

export default codegenNativeComponent<NativeProps>('RNSSplitNavigator', {});
