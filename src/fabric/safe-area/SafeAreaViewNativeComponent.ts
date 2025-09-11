// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/src/specs/NativeSafeAreaView.ts

// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import { ViewProps } from 'react-native';

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
