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

type StackScreenAnimationBezier = [number, number, number, number];

type StackScreenAnimationEasingName =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'standard'
  | 'standardAccelerate'
  | 'standardDecelerate'
  | 'emphasized'
  | 'emphasizedAccelerate'
  | 'emphasizedDecelerate';

type StackScreenAnimationEasing =
  | StackScreenAnimationEasingName
  | StackScreenAnimationBezier;

type StackScreenAnimationLength = number | `${number}%`;

type StackScreenAnimationPresetName =
  | 'default'
  | 'none'
  | 'fade'
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'slideFromBottom'
  | 'slideFromTop'
  | 'fadeFromBottom'
  | 'fadeFromTop'
  | 'iosFromRight'
  | 'iosFromLeft';

interface StackScreenAnimationTimingOptions {
  duration?: number;
  easing?: StackScreenAnimationEasing;
}

type StackScreenAnimationPresetRef =
  | ({
      type: 'preset';
      name: 'fadeFromBottom' | 'fadeFromTop';
      distance?: StackScreenAnimationLength;
    } & StackScreenAnimationTimingOptions)
  | ({
      type: 'preset';
      name:
        | 'slideFromRight'
        | 'slideFromLeft'
        | 'slideFromBottom'
        | 'slideFromTop'
        | 'fade'
        | 'iosFromRight'
        | 'iosFromLeft';
    } & StackScreenAnimationTimingOptions)
  | { type: 'preset'; name: 'default' | 'none' };

type StackScreenAnimation =
  | StackScreenAnimationPresetName
  | StackScreenAnimationPresetRef;

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
