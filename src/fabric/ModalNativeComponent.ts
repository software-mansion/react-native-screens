import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps } from 'react-native';

export type ModalPresentation =
  | 'automatic'
  | 'fullScreen'
  | 'pageSheet'
  | 'formSheet'
  | 'currentContext'
  | 'custom'
  | 'overFullScreen'
  | 'overCurrentContext'
  | 'popover';

// eslint-disable-next-line @typescript-eslint/ban-types
type ModalEvent = Readonly<{}>;

interface NativeProps extends ViewProps {
  presented?: boolean;
  presentation?: CT.WithDefault<ModalPresentation, 'pageSheet'>;
  onDismiss?: CT.DirectEventHandler<ModalEvent>;
  sheetAllowedDetents?: number[];
}

export default codegenNativeComponent<NativeProps>('RNSModal', {});