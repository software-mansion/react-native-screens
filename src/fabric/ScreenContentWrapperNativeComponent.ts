import { codegenNativeComponent } from 'react-native';
import type { ViewProps } from 'react-native';

export interface NativeProps extends ViewProps {}

export default codegenNativeComponent<NativeProps>(
  'RNSScreenContentWrapper',
  {},
);
