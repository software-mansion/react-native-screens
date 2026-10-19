import React, { useId, useMemo } from 'react';
import ContainedModalProviderNativeComponent from '../../../fabric/modals/contained-modal/ContainedModalProviderNativeComponent';
import { ContainedModalContext } from './ContainedModalContext';
import type { ContainedModalProviderProps } from './ContainedModal.types';

/**
 * Defines the presentation area for contained modals.
 *
 * @remarks
 * Contained modals below this provider in the React tree present within its
 * bounds, fully covering it. The nearest provider is targeted by default; an
 * outer one via the modal's `targetContainerId` and the provider's
 * auto-generated `containerId`.
 *
 * Intended for region-scoped native modality - see `ContainedModalOverContext`
 * for when to prefer a plain absolutely-positioned `View` instead.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export function ContainedModalProvider(props: ContainedModalProviderProps) {
  const { children, style } = props;

  const containerId = useId();
  const contextValue = useMemo(() => ({ containerId }), [containerId]);

  return (
    <ContainedModalProviderNativeComponent
      containerId={containerId}
      style={style}>
      <ContainedModalContext.Provider value={contextValue}>
        {children}
      </ContainedModalContext.Provider>
    </ContainedModalProviderNativeComponent>
  );
}
