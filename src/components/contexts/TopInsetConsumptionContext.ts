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

  // If nothing consumed the top inset above and nothing disabled consuming that
  // it means that there's no header above us, which has configured one of the following:
  //
  // - headerShown: true - which would result in inset consumption higher in the view hierarchy
  // - disableTopInsetConsumption: true - which would block inset consumption (only in the case
  //   when the header is visible from the perspective of ScreenStackItem)
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
