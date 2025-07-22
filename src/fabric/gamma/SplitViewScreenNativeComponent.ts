'use client';

import type { ViewProps } from 'react-native';
import type {
  GenericEmptyEvent,
  SplitViewScreenColumnType,
} from 'react-native-screens/components/gamma/SplitViewScreen.types';
import {
  DirectEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

interface NativeProps extends ViewProps {
  // Config
  columnType?: WithDefault<SplitViewScreenColumnType, 'column'>;

  // Events
  onWillAppear?: DirectEventHandler<GenericEmptyEvent>;
  onDidAppear?: DirectEventHandler<GenericEmptyEvent>;
  onWillDisappear?: DirectEventHandler<GenericEmptyEvent>;
  onDidDisappear?: DirectEventHandler<GenericEmptyEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSSplitViewScreen', {
  interfaceOnly: true,
});
