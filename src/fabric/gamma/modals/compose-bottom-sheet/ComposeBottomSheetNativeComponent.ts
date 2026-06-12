'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  // General
  isOpen?: CT.WithDefault<boolean, false>;

  // Events
  onDismiss?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
}

export default codegenNativeComponent<NativeProps>('ComposeBottomSheet', {
  excludedPlatforms: ['iOS'],
});
