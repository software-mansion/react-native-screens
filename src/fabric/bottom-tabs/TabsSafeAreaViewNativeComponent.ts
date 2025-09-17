'use client';

import type { ViewProps } from 'react-native';
 
import {
  DirectEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeLayoutEvent = Readonly<{
  tabBarHeight: Int32;
}>;

interface NativeProps extends ViewProps {
  onNativeLayout?: DirectEventHandler<NativeLayoutEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSTabsSafeAreaView', {});
