'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

interface NativeProps extends ViewProps {
  isOpen?: CT.WithDefault<boolean, false>;
  detents?: CT.Double[] | undefined;
  onDismiss?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSFormSheet', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
