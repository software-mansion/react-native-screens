'use client';

import type {
  CodegenTypes as CT,
  HostComponent,
  ViewProps,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

interface NativeProps extends ViewProps {
  isOpen?: CT.WithDefault<boolean, false>;
  targetContainerId?: CT.WithDefault<string, ''>;
  presentationStyle?: CT.WithDefault<
    'overContent' | 'replacingContent',
    'overContent'
  >;
  onPresentationRejected?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSContainedModalHost', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
