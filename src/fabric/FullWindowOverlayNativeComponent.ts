'use client';

// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

// Internal export, not part of stable library API.
export interface NativeProps extends ViewProps {
  accessibilityContainerViewIsModal?: WithDefault<boolean, true>;
}

export default codegenNativeComponent<NativeProps>('RNSFullWindowOverlay', {
  interfaceOnly: true,
});
