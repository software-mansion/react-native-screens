import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  AnimationPresetPlayground,
  type AnimationPresetOption,
} from '@apps/tests/shared/components/stack-v5/AnimationPresetPlayground';

// 2000 ms leaves time to start a swipe while a push or a pop is still running.
const ANIMATION_OPTIONS = [
  {
    label: 'slideFromRight 2000 ms',
    animation: { type: 'preset', name: 'slideFromRight', duration: 2000 },
  },
] satisfies readonly AnimationPresetOption[];

function TestStackAnimationSwipeDuringTransitionIOS() {
  return (
    <AnimationPresetPlayground
      animationOptions={ANIMATION_OPTIONS}
      initialAnimation="slideFromRight 2000 ms"
    />
  );
}

export default createScenario(
  TestStackAnimationSwipeDuringTransitionIOS,
  scenarioDescription,
);
