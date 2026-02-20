import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface BarSpacerProps extends ViewProps {
  size?: CodegenTypes.Double;
}

export default codegenNativeComponent<BarSpacerProps>('RNSBarSpacer');
