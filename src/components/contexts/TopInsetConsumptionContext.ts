import * as React from 'react';
import { featureFlags } from '../../flags';

export const TopInsetConsumptionContext = React.createContext({
  isTopInsetConsumed: false,
});

export function useTopInsetConsumption(isHeaderHidden: boolean | undefined) {
  const insetContext = React.useContext(TopInsetConsumptionContext);
  const useLegacyBehavior =
    featureFlags.experiment?.androidLegacyTopInsetBehavior ?? false;

  const hasVisibleHeader = isHeaderHidden !== true;
  const consumesTopInset = useLegacyBehavior
    ? true
    : !insetContext.isTopInsetConsumed && hasVisibleHeader;

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
