'use client';

import type { ViewProps } from 'react-native';
import {
  DirectEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type SplitViewScreenColumnType = 'column' | 'inspector';

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
