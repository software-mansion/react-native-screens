import * as React from 'react';
import { featureFlags } from '../../flags';

export const TopInsetConsumptionContext = React.createContext({
  isTopInsetConsumed: false,
});

export function useTopInsetConsumption(wantsToConsumeTopInset?: boolean) {
  const insetContext = React.useContext(TopInsetConsumptionContext);
  const useLegacyBehavior =
    featureFlags.experiment?.androidLegacyTopInsetBehavior ?? false;

  const consumesTopInset = useLegacyBehavior
    ? true
    : !insetContext.isTopInsetConsumed && wantsToConsumeTopInset === true;

  const nextContextValue = React.useMemo(
    () => ({
      isTopInsetConsumed: insetContext.isTopInsetConsumed || consumesTopInset,
    }),
    [insetContext.isTopInsetConsumed, consumesTopInset],
  );

  return {
    consumesTopInset,
    useLegacyBehavior,
    nextContextValue,
  };
}
