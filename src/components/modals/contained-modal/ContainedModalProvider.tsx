import React from 'react';
import ContainedModalProviderNativeComponent from '../../../fabric/modals/contained-modal/ContainedModalProviderNativeComponent';
import type { ContainedModalProviderProps } from './ContainedModal.types';

/**
 * Defines the presentation area for contained modals.
 *
 * @remarks
 * A contained modal whose `targetContainerId` equals this provider's
 * `containerId` presents within the provider's bounds, fully covering it.
 * The provider must be an ancestor of the modal in the React tree.
 *
 * Intended for region-scoped native modality - see `ContainedModalOverContent`
 * for when to prefer a plain absolutely-positioned `View` instead.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export function ContainedModalProvider(props: ContainedModalProviderProps) {
  const { children, style, containerId } = props;

  // Native maps an empty string to nil, and a modal targeting it would assert
  // (debug) or silently never present (release). Fail loudly instead.
  if (containerId === '') {
    throw new Error(
      '[RNScreens] ContainedModalProvider requires a non-empty containerId.',
    );
  }

  return (
    <ContainedModalProviderNativeComponent
      containerId={containerId}
      style={style}>
      {children}
    </ContainedModalProviderNativeComponent>
  );
}
