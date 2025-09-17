'use client';

import type { ViewProps } from 'react-native';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

// eslint-disable-next-line @typescript-eslint/ban-types
export type GenericEmptyEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  transitionTag: string;
}

export default codegenNativeComponent<NativeProps>(
  'RNSZoomTransitionSource',
  {},
);
