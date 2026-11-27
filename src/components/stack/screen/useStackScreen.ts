import React from 'react';
import { processColor } from 'react-native';
import type { StackScreenAnimation as NativeAnimation } from '../../../fabric/stack/StackScreenAnimationTypes';
import { useRenderDebugInfo } from '../../../private';
import type { NativeEventHandler } from '../../shared/types';
import type {
  OnDismissEventPayload,
  StackScreenProps,
} from './StackScreen.types';
import type {
  StackScreenAnimation,
  StackScreenAnimationMotion,
  StackScreenAnimationTransition,
} from './animation';

type StackScreenConfig = Pick<
  StackScreenProps,
  'screenKey' | 'onDismiss' | 'onNativeDismiss' | 'animation'
>;

export function useStackScreen({
  screenKey,
  onDismiss,
  onNativeDismiss,
  animation,
}: StackScreenConfig) {
  const onDismissWrapper = React.useCallback<
    NativeEventHandler<OnDismissEventPayload>
  >(
    event => {
      if (event.nativeEvent.isNativeDismiss) {
        onNativeDismiss?.(screenKey);
      } else {
        onDismiss?.(screenKey);
      }
    },
    [onDismiss, onNativeDismiss, screenKey],
  );

  const componentRef = useRenderDebugInfo(
    React.useMemo(() => `StackScreen (${screenKey})`, [screenKey]),
  );

  const nativeAnimation = React.useMemo(
    () => parseAnimationToNativeProp(animation),
    [animation],
  );

  return { componentRef, onDismissWrapper, nativeAnimation };
}

type NativeTransition = Extract<NativeAnimation, { type: 'custom' }>['push'];
type NativeMotion = Extract<NativeTransition, { type: 'custom' }>['enter'];

/**
 * Processes the colors the value carries (the `color` of a `dim` track); everything else
 * reaches native as written, `null` included (native reads it as an omitted value).
 */
function parseAnimationToNativeProp(
  animation: StackScreenAnimation | undefined,
): NativeAnimation | undefined {
  if (
    animation == null ||
    typeof animation !== 'object' ||
    animation.type !== 'custom'
  ) {
    return animation;
  }
  return {
    ...animation,
    push: parseTransitionToNativeProp(animation.push),
    pop: parseTransitionToNativeProp(animation.pop),
  };
}

function parseTransitionToNativeProp(
  transition: StackScreenAnimationTransition | undefined,
): NativeTransition {
  if (
    transition == null ||
    typeof transition !== 'object' ||
    transition.type !== 'custom'
  ) {
    return transition;
  }
  return {
    ...transition,
    enter: parseMotionToNativeProp(transition.enter),
    exit: parseMotionToNativeProp(transition.exit),
  };
}

function parseMotionToNativeProp(
  motion: StackScreenAnimationMotion | undefined,
): NativeMotion {
  if (
    motion == null ||
    typeof motion !== 'object' ||
    motion.type !== 'custom'
  ) {
    return motion;
  }
  const { dim, ...tracks } = motion;
  if (dim == null) {
    return tracks;
  }
  return { ...tracks, dim: { ...dim, color: processColor(dim.color) } };
}
