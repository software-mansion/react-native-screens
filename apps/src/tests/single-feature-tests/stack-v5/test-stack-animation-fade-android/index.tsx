import React from 'react';
import type { StackScreenAnimation } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { AnimationPresetPlayground } from '@apps/tests/shared/components/stack-v5/AnimationPresetPlayground';

const ANIMATION_OPTIONS = [
  'fade',
  'fadeFromBottom',
  'fadeFromTop',
] as const satisfies readonly StackScreenAnimation[];

function TestStackAnimationFadeAndroid() {
  return (
    <AnimationPresetPlayground
      animationOptions={ANIMATION_OPTIONS}
      initialAnimation="fade"
    />
  );
}

export default createScenario(
  TestStackAnimationFadeAndroid,
  scenarioDescription,
);
