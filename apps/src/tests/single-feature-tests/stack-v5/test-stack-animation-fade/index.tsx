import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  AnimationPresetPlayground,
  type AnimationPresetOption,
} from '@apps/tests/shared/components/stack-v5/AnimationPresetPlayground';

// 2000 ms stretches a transition far enough to judge the crossfade and the
// curve by eye.
const ANIMATION_OPTIONS = [
  'fade',
  'fadeFromBottom',
  'fadeFromTop',
  {
    label: 'fade 2000 ms',
    animation: { type: 'preset', name: 'fade', duration: 2000 },
  },
  {
    label: 'fadeFromBottom 2000 ms',
    animation: { type: 'preset', name: 'fadeFromBottom', duration: 2000 },
  },
  {
    label: 'fadeFromTop 2000 ms',
    animation: { type: 'preset', name: 'fadeFromTop', duration: 2000 },
  },
] satisfies readonly AnimationPresetOption[];

function TestStackAnimationFade() {
  return (
    <AnimationPresetPlayground
      animationOptions={ANIMATION_OPTIONS}
      initialAnimation="fade"
      withHeaderPicker
    />
  );
}

export default createScenario(TestStackAnimationFade, scenarioDescription);
