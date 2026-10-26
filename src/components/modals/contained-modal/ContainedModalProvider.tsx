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
 * outer one by giving that provider an explicit `containerId` and setting the
 * modal's `targetContainerId` to the same value.
 *
 * Intended for region-scoped native modality - see `ContainedModalOverContent`
 * for when to prefer a plain absolutely-positioned `View` instead.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export function ContainedModalProvider(props: ContainedModalProviderProps) {
  const { children, style, containerId: containerIdProp } = props;

  const generatedContainerId = useId();
  // An empty string is never a valid containerId (native maps it to nil), so
  // it falls back to the generated id exactly like an omitted prop.
  const containerId =
    containerIdProp !== undefined && containerIdProp !== ''
      ? containerIdProp
      : generatedContainerId;
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
