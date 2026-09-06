import React from 'react';
import { StackNavigationContext } from '../contexts/StackNavigationContext';
import type {
  NavigationActionMethods,
  StackNavigationEffect,
} from '../StackContainer.types';

export function useParentNavigationEffect(
  navActionMethods: NavigationActionMethods,
  effects: StackNavigationEffect[] | undefined,
) {
  const parentNavigation = React.useContext(StackNavigationContext);

  const consumeEffect = React.useEffectEvent(
    (effect: StackNavigationEffect) => {
      if (effect.type !== 'pop-container') {
        throw new Error(`[Stack] Unrecognized effect type: ${effect.type}`);
      }
      if (parentNavigation) {
        console.log(
          `[Stack] Delegating pop action to parent container for key ${parentNavigation.routeKey}`,
        );
        parentNavigation.pop(parentNavigation.routeKey);
      }
    },
  );

  const clearEffects = React.useEffectEvent(() => {
    navActionMethods.clearEffectsAction();
  });

  // We want to trigger this effect only when effects change.
  React.useEffect(() => {
    if (effects && effects.length > 0) {
      effects.forEach(consumeEffect);
      clearEffects();
    }
  }, [effects]);
}
