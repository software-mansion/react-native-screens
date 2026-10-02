'use client';

import type {
  CodegenTypes as CT,
  HostComponent,
  ViewProps,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';
import type { UnsafeMixed } from '../codegenUtils';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type OnDismissEventPayload = Readonly<{
  isNativeDismiss: boolean;
}>;

type ActivityMode = 'detached' | 'attached';

type StackScreenAnimation =
  | 'default'
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'slideFromBottom'
  | 'slideFromTop'
  | 'fade'
  | 'fadeFromBottom'
  | 'fadeFromTop'
  | 'iosFromRight'
  | 'iosFromLeft'
  | 'none';

export interface NativeProps extends ViewProps {
  // Control

  // Codegen does not currently support non-optional enum.
  activityMode?: CT.WithDefault<ActivityMode, 'detached'>;
  screenKey: string;

  // Events

  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;

  onDismiss?: CT.DirectEventHandler<OnDismissEventPayload> | undefined;

  onNativeDismissPrevented?:
    | CT.DirectEventHandler<GenericEmptyEvent>
    | undefined;

  // Configuration

  preventNativeDismiss?: CT.WithDefault<boolean, false>;
  animation?: UnsafeMixed<StackScreenAnimation> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSStackScreen', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
