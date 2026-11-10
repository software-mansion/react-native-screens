'use client';

import type {
  CodegenTypes as CT,
  ColorValue,
  HostComponent,
  ViewProps,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

// Internal. Selects the UIKit `modalPresentationStyle` the host presents with.
// `FullScreenModalReplacingContent` and `FullScreenModalOverContent` pin it;
// it is not part of their public props.
type PresentationStyle = 'replacingContent' | 'overContent';

interface NativeProps extends ViewProps {
  presentationStyle?: CT.WithDefault<PresentationStyle, 'replacingContent'>;
  isOpen?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue | undefined;
  // Events
  onPresentationRejected?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDismiss?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onNativeDismiss?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSFullScreenModalHost', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
