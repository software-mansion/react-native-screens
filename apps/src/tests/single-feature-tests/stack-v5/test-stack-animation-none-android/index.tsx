import React from 'react';
import type { StackScreenAnimation } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { AnimationPresetPlayground } from '@apps/tests/shared/components/stack-v5/AnimationPresetPlayground';

// `slideFromRight` is offered so a screen pushed without an animation can be popped with one.
const ANIMATION_OPTIONS = [
  'none',
  'slideFromRight',
] as const satisfies readonly StackScreenAnimation[];

function TestStackAnimationNoneAndroid() {
  return (
    <AnimationPresetPlayground
      animationOptions={ANIMATION_OPTIONS}
      initialAnimation="none"
    />
  );
}

export default createScenario(
  TestStackAnimationNoneAndroid,
  scenarioDescription,
);
