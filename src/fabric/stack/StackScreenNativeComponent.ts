'use client';

import type {
  CodegenTypes as CT,
  HostComponent,
  ProcessedColorValue,
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

type StackScreenReplaceAnimation = 'push' | 'pop';

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

interface StackScreenAnimationTimingOptions {
  duration?: number | undefined;
  easing?: StackScreenAnimationEasing | undefined;
}

type StackScreenAnimationSlideFromPresetName =
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'slideFromTrailing'
  | 'slideFromLeading'
  | 'slideFromBottom'
  | 'slideFromTop';

type StackScreenAnimationFadeFromPresetName = 'fadeFromBottom' | 'fadeFromTop';

type StackScreenAnimationIosFromPresetName =
  | 'iosFromRight'
  | 'iosFromLeft'
  | 'iosFromTrailing'
  | 'iosFromLeading';

interface StackScreenAnimationSlideFromPresetConfig
  extends StackScreenAnimationTimingOptions {
  type: 'preset';
  name: StackScreenAnimationSlideFromPresetName;
}

interface StackScreenAnimationSlideFromMotionPresetConfig
  extends StackScreenAnimationSlideFromPresetConfig {
  distance?: StackScreenAnimationLength | undefined;
}

interface StackScreenAnimationFadeFromPresetConfig
  extends StackScreenAnimationTimingOptions {
  type: 'preset';
  name: StackScreenAnimationFadeFromPresetName;
  distance?: StackScreenAnimationLength | undefined;
}

interface StackScreenAnimationFadePresetConfig
  extends StackScreenAnimationTimingOptions {
  type: 'preset';
  name: 'fade';
}

interface StackScreenAnimationIosFromPresetConfig
  extends StackScreenAnimationTimingOptions {
  type: 'preset';
  name: StackScreenAnimationIosFromPresetName;
}

interface StackScreenAnimationNonePresetConfig {
  type: 'preset';
  name: 'none';
}

interface StackScreenAnimationDefaultPresetConfig {
  type: 'preset';
  name: 'default';
}

type StackScreenAnimationMotionPresetName =
  | 'none'
  | 'fade'
  | StackScreenAnimationSlideFromPresetName
  | StackScreenAnimationFadeFromPresetName;

type StackScreenAnimationMotionPresetConfig =
  | StackScreenAnimationSlideFromMotionPresetConfig
  | StackScreenAnimationFadeFromPresetConfig
  | StackScreenAnimationFadePresetConfig
  | StackScreenAnimationNonePresetConfig;

interface StackScreenAnimationTrackTiming {
  duration: number;
  delay?: number | undefined;
  easing?: StackScreenAnimationEasing | undefined;
}

interface StackScreenAnimationTrack extends StackScreenAnimationTrackTiming {
  from?: number | undefined;
  to?: number | undefined;
}

interface StackScreenAnimationTranslateTrack
  extends StackScreenAnimationTrackTiming {
  from?: StackScreenAnimationLength | undefined;
  to?: StackScreenAnimationLength | undefined;
}

interface StackScreenAnimationDimTrack extends StackScreenAnimationTrack {
  color?: ProcessedColorValue | null | undefined;
}

interface StackScreenAnimationCustomMotion {
  type: 'custom';
  translateX?: StackScreenAnimationTranslateTrack | undefined;
  translateY?: StackScreenAnimationTranslateTrack | undefined;
  opacity?: StackScreenAnimationTrack | undefined;
  scale?: StackScreenAnimationTrack | undefined;
  scaleX?: StackScreenAnimationTrack | undefined;
  scaleY?: StackScreenAnimationTrack | undefined;
  rotate?: StackScreenAnimationTrack | undefined;
  dim?: StackScreenAnimationDimTrack | undefined;
}

type StackScreenAnimationMotion =
  | StackScreenAnimationMotionPresetName
  | StackScreenAnimationMotionPresetConfig
  | StackScreenAnimationCustomMotion;

interface StackScreenAnimationCustomTransition {
  type: 'custom';
  enter?: StackScreenAnimationMotion | undefined;
  exit?: StackScreenAnimationMotion | undefined;
}

type StackScreenAnimationTransitionPresetName =
  | StackScreenAnimationMotionPresetName
  | StackScreenAnimationIosFromPresetName;

type StackScreenAnimationTransitionPresetConfig =
  | StackScreenAnimationSlideFromPresetConfig
  | StackScreenAnimationFadeFromPresetConfig
  | StackScreenAnimationFadePresetConfig
  | StackScreenAnimationIosFromPresetConfig
  | StackScreenAnimationNonePresetConfig;

type StackScreenAnimationTransition =
  | StackScreenAnimationTransitionPresetName
  | StackScreenAnimationTransitionPresetConfig
  | StackScreenAnimationCustomTransition;

interface StackScreenAnimationCustom {
  type: 'custom';
  push?: StackScreenAnimationTransition | undefined;
  pop?: StackScreenAnimationTransition | undefined;
}

type StackScreenAnimationPresetName =
  | StackScreenAnimationTransitionPresetName
  | 'default';

type StackScreenAnimationPresetConfig =
  | StackScreenAnimationTransitionPresetConfig
  | StackScreenAnimationDefaultPresetConfig;

type StackScreenAnimation =
  | StackScreenAnimationPresetName
  | StackScreenAnimationPresetConfig
  | StackScreenAnimationCustom;

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
}

export default codegenNativeComponent<NativeProps>('RNSStackScreen', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
