'use client';

import type { ViewProps } from 'react-native';
// eslint-disable-next-line -- required for backward compatibility
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface NativeProps extends ViewProps {}

export default codegenNativeComponent<NativeProps>('RNSScreenStackHost', {});
