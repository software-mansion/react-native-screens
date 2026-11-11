import React from 'react';
import type { StackScreenAnimation } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  AnimationPresetPlayground,
  type AnimationPresetOption,
} from '@apps/tests/shared/components/stack-v5/AnimationPresetPlayground';

// 2000 ms stretches a transition far enough to judge its curve and travel by eye.
const ANIMATION_OPTIONS = [
  'slideFromRight',
  {
    label: 'slideFromRight 2000 ms',
    animation: { type: 'preset', name: 'slideFromRight', duration: 2000 },
  },
  {
    label: 'slideFromRight 100 ms',
    animation: { type: 'preset', name: 'slideFromRight', duration: 100 },
  },
  {
    label: 'slideFromRight 2000 ms linear',
    animation: {
      type: 'preset',
      name: 'slideFromRight',
      duration: 2000,
      easing: 'linear',
    },
  },
  {
    label: 'slideFromRight 2000 ms overshoot',
    animation: {
      type: 'preset',
      name: 'slideFromRight',
      duration: 2000,
      easing: [0.34, 1.56, 0.64, 1],
    },
  },
  {
    label: 'fadeFromBottom 2000 ms',
    animation: { type: 'preset', name: 'fadeFromBottom', duration: 2000 },
  },
  {
    label: 'fadeFromBottom 2000 ms 50%',
    animation: {
      type: 'preset',
      name: 'fadeFromBottom',
      duration: 2000,
      distance: '50%',
    },
  },
  {
    label: 'fadeFromBottom 2000 ms 300 dp',
    animation: {
      type: 'preset',
      name: 'fadeFromBottom',
      duration: 2000,
      distance: 300,
    },
  },
  {
    label: 'fadeFromTop 2000 ms 50%',
    animation: {
      type: 'preset',
      name: 'fadeFromTop',
      duration: 2000,
      distance: '50%',
    },
  },
  {
    label: 'invalid: distance on slideFromRight',
    // The types reject it; the cast reaches the native fallback to `default`.
    animation: {
      type: 'preset',
      name: 'slideFromRight',
      distance: '50%',
    } as unknown as StackScreenAnimation,
  },
  {
    label: 'invalid: bezier x1 = 1.5',
    // The types accept any four numbers; native rejects x outside [0, 1].
    animation: {
      type: 'preset',
      name: 'slideFromRight',
      easing: [1.5, 0, 1, 1],
    },
  },
] satisfies readonly AnimationPresetOption[];

function TestStackAnimationOptionsAndroid() {
  return (
    <AnimationPresetPlayground
      animationOptions={ANIMATION_OPTIONS}
      initialAnimation="slideFromRight"
    />
  );
}

export default createScenario(
  TestStackAnimationOptionsAndroid,
  scenarioDescription,
);
