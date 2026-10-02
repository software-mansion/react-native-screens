import React from 'react';
import type { StackScreenAnimation } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { AnimationPresetPlayground } from '@apps/tests/shared/components/stack-v5/AnimationPresetPlayground';

const ANIMATION_OPTIONS = [
  'slideFromRight',
  'slideFromLeft',
  'slideFromBottom',
  'slideFromTop',
] as const satisfies readonly StackScreenAnimation[];

function TestStackAnimationSlideAndroid() {
  return (
    <AnimationPresetPlayground
      animationOptions={ANIMATION_OPTIONS}
      initialAnimation="slideFromRight"
      withDirectionPicker
    />
  );
}

export default createScenario(
  TestStackAnimationSlideAndroid,
  scenarioDescription,
);
