'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

interface NativeProps extends ViewProps {
  isOpen?: CT.WithDefault<boolean, false>;
  detents?: CT.Double[] | undefined;
  prefersGrabberVisible?: CT.WithDefault<boolean, false>;
  preferredCornerRadius?: CT.WithDefault<CT.Float, -1.0>;
  largestUndimmedDetentIndex?: CT.WithDefault<CT.Int32, -1>;
  initialDetentIndex?: CT.WithDefault<CT.Int32, 0>;
  onNativeDismiss?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSFormSheetHost', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
