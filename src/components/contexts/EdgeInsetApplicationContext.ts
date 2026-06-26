import * as React from 'react';

/**
 * Carries the information whether application of the left/right/bottom system insets has been
 * disabled somewhere up the stack hierarchy.
 *
 * `true` means that an ancestor header opted out from applying the inset on that edge,
 * so the whole subtree should also skip it.
 *
 * Note: unlike the top inset, these insets are applied per-header (every header spans the
 * full width and needs the inset on its own edges, and a custom `SafeAreaView` may consume
 * them for a part of the subtree). These contexts are therefore used only to propagate the
 * opt-out down the subtree, not to "consume" the inset once. They do NOT coordinate which
 * header applies the inset — every header applies it on its own edges unless opted out.
 */
export const LeftInsetApplicationContext = React.createContext(false);
export const RightInsetApplicationContext = React.createContext(false);
export const BottomInsetApplicationContext = React.createContext(false);

export function useEdgeInsetApplication(
  disableLeftInsetApplication: boolean,
  disableRightInsetApplication: boolean,
  disableBottomInsetApplication: boolean,
) {
  const leftDisabledByAncestor = React.useContext(LeftInsetApplicationContext);
  const rightDisabledByAncestor = React.useContext(
    RightInsetApplicationContext,
  );
  const bottomDisabledByAncestor = React.useContext(
    BottomInsetApplicationContext,
  );

  // Once disabled anywhere up the chain, it stays disabled for the whole subtree.
  const leftDisabled = leftDisabledByAncestor || disableLeftInsetApplication;
  const rightDisabled = rightDisabledByAncestor || disableRightInsetApplication;
  const bottomDisabled =
    bottomDisabledByAncestor || disableBottomInsetApplication;

  return {
    consumeLeftInset: !leftDisabled,
    consumeRightInset: !rightDisabled,
    consumeBottomInset: !bottomDisabled,
    nextLeftContextValue: leftDisabled,
    nextRightContextValue: rightDisabled,
    nextBottomContextValue: bottomDisabled,
  };
}
