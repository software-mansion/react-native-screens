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
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSSplitScreen', {
  interfaceOnly: true,
});
