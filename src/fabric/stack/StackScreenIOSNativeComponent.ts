'use client';

import type {
  CodegenTypes as CT,
  HostComponent,
  ViewProps,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';
import type { UnsafeMixed } from '../codegenUtils';
import type { StackScreenAnimation } from './StackScreenAnimationTypes';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type OnDismissEventPayload = Readonly<{
  isNativeDismiss: boolean;
}>;

type ActivityMode = 'detached' | 'attached';

type StackScreenReplaceAnimation = 'push' | 'pop';

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
  replaceAnimation?: CT.WithDefault<StackScreenReplaceAnimation, 'pop'>;

  // Internal. The screen is placed by a native container that Yoga does
  // not lay out, so it reports the frame it got there to the shadow tree
  // through the state.
  reportsFrameToShadowTree?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSStackScreenIOS', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
