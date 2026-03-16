'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps } from 'react-native';

// Internal export, not part of stable library API.
export interface NativeProps extends ViewProps {
  accessibilityContainerViewIsModal?: CT.WithDefault<boolean, true>;
}

export default codegenNativeComponent<NativeProps>('RNSFullWindowOverlay', {
  interfaceOnly: true,
});
