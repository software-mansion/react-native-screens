import * as React from 'react';
import { featureFlags } from '../../flags';

export const TopInsetApplicationContext = React.createContext(false);

export function useTopInsetApplication(
  headerVisible: boolean,
  disableTopInsetApplication: boolean,
) {
  const alreadyApplied = React.useContext(TopInsetApplicationContext);
  const useLegacyBehavior =
    featureFlags.experiment?.androidLegacyTopInsetBehavior ?? false;

  // We want to apply the inset if:
  // - legacy mode (androidLegacyTopInsetBehavior)
  // - or when no ancestor applied it yet and our header is visible
  const wantsToApplyInset =
    useLegacyBehavior || (!alreadyApplied && headerVisible);

  // We apply the padding, only if we want to apply the inset and haven't been told to suppress it
  const appliesTopInset = wantsToApplyInset && !disableTopInsetApplication;

  // Once found header that may apply the padding, mark it as consumed for the subtree
  const nextContextValue = alreadyApplied || wantsToApplyInset;

  return { appliesTopInset, useLegacyBehavior, nextContextValue };
}
