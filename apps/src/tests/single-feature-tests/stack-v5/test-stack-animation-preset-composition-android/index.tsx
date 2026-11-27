import type { StackScreenAnimation } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  AnimationPresetPlayground,
  type AnimationPresetOption,
} from '@apps/tests/shared/components/stack-v5/AnimationPresetPlayground';
import React from 'react';

const ANIMATION_OPTIONS = [
  'slideFromRight',
  {
    label: 'push slideFromRight · pop slideFromLeft',
    animation: { type: 'custom', push: 'slideFromRight', pop: 'slideFromLeft' },
  },
  {
    label: 'push slideFromBottom · pop fade',
    animation: { type: 'custom', push: 'slideFromBottom', pop: 'fade' },
  },
  {
    label: 'push slideFromRight · pop slideFromRight',
    animation: {
      type: 'custom',
      push: 'slideFromRight',
      pop: 'slideFromRight',
    },
  },
  {
    label: 'push fadeFromBottom · pop fadeFromBottom',
    animation: {
      type: 'custom',
      push: 'fadeFromBottom',
      pop: 'fadeFromBottom',
    },
  },
  {
    label: 'push iosFromRight · pop iosFromRight',
    animation: { type: 'custom', push: 'iosFromRight', pop: 'iosFromRight' },
  },
  {
    label: 'push enter slideFromRight only',
    animation: {
      type: 'custom',
      push: { type: 'custom', enter: 'slideFromRight' },
    },
  },
  {
    label: 'custom with nothing set',
    animation: { type: 'custom' },
  },
  {
    // 2000 ms and 1000 ms stretch the motions far enough to see the shorter one end first.
    label: 'slide 2000 ms + fade 1000 ms',
    animation: {
      type: 'custom',
      push: {
        type: 'custom',
        enter: { type: 'preset', name: 'slideFromRight', duration: 2000 },
        exit: { type: 'preset', name: 'fade', duration: 1000 },
      },
      pop: {
        type: 'custom',
        enter: { type: 'preset', name: 'fade', duration: 1000 },
        exit: { type: 'preset', name: 'slideFromLeft', duration: 2000 },
      },
    },
  },
  {
    label: 'parallax 30%',
    animation: {
      type: 'custom',
      push: {
        type: 'custom',
        enter: 'slideFromRight',
        exit: { type: 'preset', name: 'slideFromRight', distance: '30%' },
      },
      pop: {
        type: 'custom',
        enter: { type: 'preset', name: 'slideFromLeft', distance: '30%' },
        exit: 'slideFromLeft',
      },
    },
  },
  {
    label: 'invalid: enter iosFromRight',
    // The types reject it; the cast reaches the native fallback to `default`.
    animation: {
      type: 'custom',
      push: { type: 'custom', enter: 'iosFromRight' },
    } as unknown as StackScreenAnimation,
  },
  {
    label: 'invalid: distance on pop',
    // The types reject it; the cast reaches the native fallback to `default`.
    animation: {
      type: 'custom',
      pop: { type: 'preset', name: 'slideFromLeft', distance: '30%' },
    } as unknown as StackScreenAnimation,
  },
] satisfies readonly AnimationPresetOption[];

function TestStackAnimationPresetCompositionAndroid() {
  return (
    <AnimationPresetPlayground
      animationOptions={ANIMATION_OPTIONS}
      initialAnimation="slideFromRight"
    />
  );
}

export default createScenario(
  TestStackAnimationPresetCompositionAndroid,
  scenarioDescription,
);
