'use client';

import type { ViewProps } from 'react-native';
import {
  DirectEventHandler,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type GenericEmptyEvent = Readonly<{}>;

type SplitViewScreenColumnType = 'column' | 'inspector';

interface InternalNativeProps extends ViewProps {
  // Config
  columnType?: WithDefault<SplitViewScreenColumnType, 'column'>;

  // Events
  onWillAppear?: DirectEventHandler<GenericEmptyEvent>;
  onDidAppear?: DirectEventHandler<GenericEmptyEvent>;
  onWillDisappear?: DirectEventHandler<GenericEmptyEvent>;
  onDidDisappear?: DirectEventHandler<GenericEmptyEvent>;
}

export interface NativeProps extends ViewProps {
  // TODO: remove duplication with InternalNativeProps
  // Events
  onWillAppear?: DirectEventHandler<GenericEmptyEvent>;
  onDidAppear?: DirectEventHandler<GenericEmptyEvent>;
  onWillDisappear?: DirectEventHandler<GenericEmptyEvent>;
  onDidDisappear?: DirectEventHandler<GenericEmptyEvent>;
}

export default codegenNativeComponent<InternalNativeProps>(
  'RNSSplitViewScreen',
  {
    interfaceOnly: true,
  },
);
