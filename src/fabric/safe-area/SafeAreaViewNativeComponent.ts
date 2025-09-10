// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/src/specs/NativeSafeAreaView.ts
import { ViewProps } from 'react-native';
import {codegenNativeComponent} from 'react-native';

export interface NativeProps extends ViewProps {
  edges?: Readonly<{
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  }>;
}

export default codegenNativeComponent<NativeProps>('RNSSafeAreaView', {
  interfaceOnly: true,
});
