// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/src/specs/NativeSafeAreaView.ts

import { codegenNativeComponent, ViewProps } from 'react-native';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypesNamespace';

type InsetType = 'all' | 'system' | 'interface';

export interface NativeProps extends ViewProps {
  edges?: Readonly<{
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  }>;
  // Android-only
  insetType?: WithDefault<InsetType, 'all'>;
}

export default codegenNativeComponent<NativeProps>('RNSSafeAreaView', {
  interfaceOnly: true,
});
