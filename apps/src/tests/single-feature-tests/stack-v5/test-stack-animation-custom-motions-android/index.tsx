import type { StackScreenAnimation } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  AnimationPresetPlayground,
  type AnimationPresetOption,
} from '@apps/tests/shared/components/stack-v5/AnimationPresetPlayground';
import React from 'react';

// The preset's own curve is not linear, so the comparison with the tracks (which default to
// linear) is made against the linear preset.
const SLOW = { duration: 2000 } as const;

const ANIMATION_OPTIONS = [
  {
    label: 'iosFromRight linear 2000 ms',
    animation: {
      type: 'preset',
      name: 'iosFromRight',
      easing: 'linear',
      duration: 2000,
    },
  },
  {
    label: 'iosFromRight rebuilt from tracks 2000 ms',
    animation: {
      type: 'custom',
      push: {
        type: 'custom',
        enter: { type: 'custom', translateX: { from: '100%', ...SLOW } },
        exit: {
          type: 'custom',
          translateX: { to: '-30%', ...SLOW },
          dim: { to: 0.1, ...SLOW },
        },
      },
      pop: {
        type: 'custom',
        enter: {
          type: 'custom',
          translateX: { from: '-30%', ...SLOW },
          dim: { from: 0.1, ...SLOW },
        },
        exit: { type: 'custom', translateX: { to: '100%', ...SLOW } },
      },
    },
  },
  {
    label: 'from 200 dp left + fade 600 ms',
    animation: {
      type: 'custom',
      push: {
        type: 'custom',
        enter: {
          type: 'custom',
          translateX: { from: -200, duration: 600 },
          opacity: { from: 0, duration: 600 },
        },
      },
      pop: {
        type: 'custom',
        exit: {
          type: 'custom',
          translateX: { to: -200, duration: 600 },
          opacity: { to: 0, duration: 600 },
        },
      },
    },
  },
  {
    // The pop also dims the departing screen, so the predictive back gesture shows a scrim.
    label: 'rotate + scale 2000 ms',
    animation: {
      type: 'custom',
      push: {
        type: 'custom',
        enter: {
          type: 'custom',
          rotate: { from: -90, ...SLOW },
          scale: { from: 0.5, ...SLOW },
        },
      },
      pop: {
        type: 'custom',
        exit: {
          type: 'custom',
          rotate: { to: 90, ...SLOW },
          scale: { to: 0.5, ...SLOW },
          dim: { to: 0.5, ...SLOW },
        },
      },
    },
  },
  {
    label: 'scaleX overrides scale 2000 ms',
    animation: {
      type: 'custom',
      push: {
        type: 'custom',
        enter: {
          type: 'custom',
          scale: { from: 0.5, ...SLOW },
          scaleX: { from: 2, ...SLOW },
        },
      },
      pop: {
        type: 'custom',
        exit: {
          type: 'custom',
          scale: { to: 0.5, ...SLOW },
          scaleX: { to: 2, ...SLOW },
        },
      },
    },
  },
  {
    label: 'dim blue 50% on the covered screen',
    animation: {
      type: 'custom',
      push: {
        type: 'custom',
        enter: { type: 'preset', name: 'slideFromRight', duration: 1000 },
        exit: {
          type: 'custom',
          dim: { to: 1, color: 'rgba(0, 0, 255, 0.5)', duration: 1000 },
        },
      },
      pop: {
        type: 'custom',
        enter: {
          type: 'custom',
          dim: { from: 1, color: 'rgba(0, 0, 255, 0.5)', duration: 1000 },
        },
        exit: { type: 'preset', name: 'slideFromLeft', duration: 1000 },
      },
    },
  },
  {
    label: 'arriving screen brightens 1000 ms',
    animation: {
      type: 'custom',
      push: {
        type: 'custom',
        enter: {
          type: 'custom',
          translateX: { from: '100%', duration: 1000 },
          dim: { from: 1, duration: 1000 },
        },
      },
      pop: {
        type: 'custom',
        exit: {
          type: 'custom',
          translateX: { to: '100%', duration: 1000 },
          dim: { to: 1, duration: 1000 },
        },
      },
    },
  },
  {
    label: 'rise 2000 ms + fade 1000 ms after 1000 ms',
    animation: {
      type: 'custom',
      push: {
        type: 'custom',
        enter: {
          type: 'custom',
          translateY: { from: '100%', ...SLOW },
          opacity: { from: 0, duration: 1000, delay: 1000 },
        },
      },
      pop: {
        type: 'custom',
        exit: {
          type: 'custom',
          translateY: { to: '100%', ...SLOW },
          opacity: { to: 0, duration: 1000 },
        },
      },
    },
  },
  {
    label: 'hold 2000 ms on pop',
    animation: {
      type: 'custom',
      push: 'slideFromRight',
      pop: {
        type: 'custom',
        exit: { type: 'custom', opacity: SLOW },
      },
    },
  },
  {
    label: 'invalid: no duration',
    // The types reject it; the cast reaches the native fallback to `default`.
    animation: {
      type: 'custom',
      push: {
        type: 'custom',
        enter: { type: 'custom', opacity: { from: 0 } },
      },
    } as unknown as StackScreenAnimation,
  },
] satisfies readonly AnimationPresetOption[];

function TestStackAnimationCustomMotionsAndroid() {
  return (
    <AnimationPresetPlayground
      animationOptions={ANIMATION_OPTIONS}
      initialAnimation="iosFromRight linear 2000 ms"
    />
  );
}

export default createScenario(
  TestStackAnimationCustomMotionsAndroid,
  scenarioDescription,
);
