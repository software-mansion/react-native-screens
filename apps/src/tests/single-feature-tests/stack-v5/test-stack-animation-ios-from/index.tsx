import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  AnimationPresetPlayground,
  type AnimationPresetOption,
} from '@apps/tests/shared/components/stack-v5/AnimationPresetPlayground';

// `slideFromRight` is offered so a screen can be pushed with a preset that has no dim scrim
// and popped with one that has. 2000 ms stretches the tint far enough to judge it by eye.
const ANIMATION_OPTIONS = [
  'iosFromRight',
  'iosFromLeft',
  'iosFromTrailing',
  'iosFromLeading',
  'slideFromRight',
  {
    label: 'iosFromRight 2000 ms',
    animation: { type: 'preset', name: 'iosFromRight', duration: 2000 },
  },
] satisfies readonly AnimationPresetOption[];

function TestStackAnimationIOSFrom() {
  return (
    <AnimationPresetPlayground
      animationOptions={ANIMATION_OPTIONS}
      initialAnimation="iosFromRight"
      withDirectionPicker
      withColorReference
      withHeaderPicker
    />
  );
}

export default createScenario(TestStackAnimationIOSFrom, scenarioDescription);
