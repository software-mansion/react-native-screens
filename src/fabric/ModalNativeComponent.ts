import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps } from 'react-native';

interface NativeProps extends ViewProps {
  presented?: boolean;
  onDismiss?: CT.DirectEventHandler<Readonly<{}>>;
}

export default codegenNativeComponent<NativeProps>('RNSModal', {});