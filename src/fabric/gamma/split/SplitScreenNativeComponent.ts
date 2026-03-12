'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type SplitScreenColumnType = 'column' | 'inspector';

interface NativeProps extends ViewProps {
  // Config
  columnType?: CT.WithDefault<SplitScreenColumnType, 'column'>;

  // Events
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSSplitScreen', {
  interfaceOnly: true,
});
