'use client';

import type { ViewProps } from 'react-native';
import {
  DirectEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

// eslint-disable-next-line @typescript-eslint/ban-types
export type GenericEmptyEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  // Control
  maxLifecycleState: Int32;
  screenKey: string;

  // Events
  onWillAppear?: DirectEventHandler<GenericEmptyEvent>;
  onDidAppear?: DirectEventHandler<GenericEmptyEvent>;
  onWillDisappear?: DirectEventHandler<GenericEmptyEvent>;
  onDidDisappear?: DirectEventHandler<GenericEmptyEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSStackScreen', {});
