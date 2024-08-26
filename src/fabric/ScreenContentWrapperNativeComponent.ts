import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';

export interface NativeProps extends ViewProps {}

export default codegenNativeComponent<NativeProps>(
  'RNSScreenContentWrapper',
  {},
);
