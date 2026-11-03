import React from 'react';
import type { StackScreenAnimation } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { AnimationPresetPlayground } from '@apps/tests/shared/components/stack-v5/AnimationPresetPlayground';

// `slideFromRight` is offered so a screen can be pushed with a preset that has no dim scrim
// and popped with one that has.
const ANIMATION_OPTIONS = [
  'iosFromRight',
  'iosFromLeft',
  'slideFromRight',
] as const satisfies readonly StackScreenAnimation[];

function TestStackAnimationIOSAndroid() {
  return (
    <AnimationPresetPlayground
      animationOptions={ANIMATION_OPTIONS}
      initialAnimation="iosFromRight"
      withColorReference
    />
  );
}

export default createScenario(
  TestStackAnimationIOSAndroid,
  scenarioDescription,
);
