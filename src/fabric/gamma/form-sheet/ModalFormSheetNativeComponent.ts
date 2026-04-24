'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

interface NativeProps extends ViewProps {
  isOpen?: CT.WithDefault<boolean, false>;
  detents?: readonly CT.Double[] | undefined;
  onDismiss?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSModalFormSheet', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
