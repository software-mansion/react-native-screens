import {
  codegenNativeComponent,
  type ViewProps,
  type CodegenTypes,
} from 'react-native';

export interface NativeBarViewProps extends ViewProps {
  placement?: CodegenTypes.WithDefault<'header' | 'toolbar', 'header'>;
}

export default codegenNativeComponent<NativeBarViewProps>('RNSBarView');
