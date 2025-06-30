'use client';

import type { ViewProps } from 'react-native';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface NativeProps extends ViewProps {
   title?: WithDefault<string, ''>;
}

export default codegenNativeComponent<NativeProps>('RNSScreenStackNavigationBar', {});
