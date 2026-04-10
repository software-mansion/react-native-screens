import * as React from 'react';
import { featureFlags } from '../../flags';

export const TopInsetConsumptionContext = React.createContext({
  isTopInsetConsumed: false,
  isTopInsetConsumptionDisabled: false,
});

export function useTopInsetConsumption(
  wantsToConsumeTopInset: boolean = false,
  preventsSubtreeFromConsumingTopInset: boolean = false,
) {
  const insetContext = React.useContext(TopInsetConsumptionContext);
  const useLegacyBehavior =
    featureFlags.experiment?.androidLegacyTopInsetBehavior ?? false;

  // We're the outermost stack (the one that will make a decision about applying the padding to its header)
  // if no component higher in the hierarchy consumed the top inset, and no component prevented consuming that.
  const isOutermostStack =
    !insetContext.isTopInsetConsumed &&
    !insetContext.isTopInsetConsumptionDisabled;

  const consumesTopInset = useLegacyBehavior
    ? true
    : isOutermostStack && wantsToConsumeTopInset;

  // If this is the outermost stack and it explicitly opts out of inset
  // consumption, propagate the disabled state to the whole subtree so that
  // nested stacks cannot consume the inset either.
  const outermostStackDisablesSubtree =
    !useLegacyBehavior &&
    isOutermostStack &&
    preventsSubtreeFromConsumingTopInset;

  const nextContextValue = React.useMemo(
    () => ({
      isTopInsetConsumed: insetContext.isTopInsetConsumed || consumesTopInset,
      isTopInsetConsumptionDisabled:
        insetContext.isTopInsetConsumptionDisabled ||
        outermostStackDisablesSubtree,
    }),
    [
      insetContext.isTopInsetConsumed,
      consumesTopInset,
      insetContext.isTopInsetConsumptionDisabled,
      outermostStackDisablesSubtree,
    ],
  );

  return {
    consumesTopInset,
    useLegacyBehavior,
    nextContextValue,
  };
}
