import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeBarMenuActionProps extends ViewProps {
  identifier?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  state?: string;
  disabled?: boolean;
  destructive?: boolean;
  hidden?: boolean;
  keepsMenuPresented?: boolean;
  discoverabilityLabel?: string;
  // TODO: something in the event type
  // eslint-disable-next-line @typescript-eslint/ban-types
  onMenuActionPress?: CodegenTypes.DirectEventHandler<{}>;
}

export default codegenNativeComponent<NativeBarMenuActionProps>(
  'RNSBarMenuAction'
);
