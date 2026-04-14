'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type OnDismissEventPayload = Readonly<{
  isNativeDismiss: boolean;
}>;

type SplitScreenActivityMode = 'detached' | 'attached';

interface NativeProps extends ViewProps {
  // Stack management
  activityMode?: CT.WithDefault<SplitScreenActivityMode, 'detached'>;
  screenKey: string;

  // Dismiss control
  preventNativeDismiss?: CT.WithDefault<boolean, false>;

  // Events
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onDismiss?: CT.DirectEventHandler<OnDismissEventPayload>;
}

export default codegenNativeComponent<NativeProps>('RNSSplitScreen', {});
