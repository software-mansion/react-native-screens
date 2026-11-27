// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/src/specs/NativeSafeAreaView.ts

import { codegenNativeComponent } from 'react-native';
import type {
  CodegenTypes as CT,
  HostComponent,
  ViewProps,
} from 'react-native';

type InsetType = 'all' | 'system' | 'interface';
type Mode = 'padding' | 'margin';

export interface NativeProps extends ViewProps {
  edges?:
    | Readonly<{
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
      }>
    | undefined;
  mode?: CT.WithDefault<Mode, 'padding'>;
  // Android-only
  insetType?: CT.WithDefault<InsetType, 'all'>;
}

export default codegenNativeComponent<NativeProps>('RNSSafeAreaView', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
