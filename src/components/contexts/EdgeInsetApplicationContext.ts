import * as React from 'react';
import { featureFlags } from '../../flags';

/**
 * Carries the inset-application state down the stack hierarchy for every edge.
 *
 * The semantics differ between the top edge and the rest:
 * - `topAlreadyApplied`: the top inset is coordinated "consume-once" across nested headers,
 *   so `true` means an ancestor header already applied it and the subtree should skip it.
 * - `left/right/bottomDisabled`: these insets are applied per-header (every header spans the
 *   full width and needs the inset on its own edges, and a custom `SafeAreaView` may consume
 *   them for a part of the subtree). The flags therefore only propagate the opt-out down the
 *   subtree: `true` means an ancestor header opted out, so the whole subtree should skip it.
 *   This context does NOT coordinate which header applies these insets — every header applies
 *   them on its own edges unless opted out.
 */
export interface EdgeInsetApplicationState {
  topAlreadyApplied: boolean;
  leftDisabled: boolean;
  rightDisabled: boolean;
  bottomDisabled: boolean;
}

const DEFAULT_STATE: EdgeInsetApplicationState = {
  topAlreadyApplied: false,
  leftDisabled: false,
  rightDisabled: false,
  bottomDisabled: false,
};

export const EdgeInsetApplicationContext =
  React.createContext<EdgeInsetApplicationState>(DEFAULT_STATE);

export function useEdgeInsetApplication(
  headerVisible: boolean,
  disableTopInsetApplication: boolean,
  disableLeftInsetApplication: boolean,
  disableRightInsetApplication: boolean,
  disableBottomInsetApplication: boolean,
) {
  const { topAlreadyApplied, leftDisabled, rightDisabled, bottomDisabled } =
    React.useContext(EdgeInsetApplicationContext);

  const useLegacyBehavior =
    featureFlags.experiment?.androidLegacyTopInsetBehavior ?? false;

  // We want to apply the top inset if:
  // - legacy mode (androidLegacyTopInsetBehavior)
  // - or when no ancestor applied it yet and our header is visible
  const wantsToApplyTopInset =
    useLegacyBehavior || (!topAlreadyApplied && headerVisible);

  // We apply the top padding only if we want to apply the inset and haven't been told to suppress it.
  const appliesTopInset = wantsToApplyTopInset && !disableTopInsetApplication;

  // Once disabled anywhere up the chain, an edge stays disabled for the whole subtree.
  const nextLeftDisabled = leftDisabled || disableLeftInsetApplication;
  const nextRightDisabled = rightDisabled || disableRightInsetApplication;
  const nextBottomDisabled = bottomDisabled || disableBottomInsetApplication;

  const nextContextValue = React.useMemo<EdgeInsetApplicationState>(
    () => ({
      // Once a header that may apply the top padding is found, mark it as consumed for the subtree.
      topAlreadyApplied: topAlreadyApplied || wantsToApplyTopInset,
      leftDisabled: nextLeftDisabled,
      rightDisabled: nextRightDisabled,
      bottomDisabled: nextBottomDisabled,
    }),
    [
      topAlreadyApplied,
      wantsToApplyTopInset,
      nextLeftDisabled,
      nextRightDisabled,
      nextBottomDisabled,
    ],
  );

  return {
    appliesTopInset,
    consumeLeftInset: !nextLeftDisabled,
    consumeRightInset: !nextRightDisabled,
    consumeBottomInset: !nextBottomDisabled,
    useLegacyBehavior,
    nextContextValue,
  };
}
