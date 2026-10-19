import React, { useId, useMemo } from 'react';
import ContainedModalProviderNativeComponent from '../../../fabric/modals/contained-modal/ContainedModalProviderNativeComponent';
import { ContainedModalContext } from './ContainedModalContext';
import type { ContainedModalProviderProps } from './ContainedModal.types';

/**
 * A container that defines the presentation area for contained modals.
 *
 * @remarks
 * Contained modals rendered below this provider in the React tree are
 * presented within the provider's bounds, fully covering it. The nearest
 * provider is targeted by default; an outer one can be targeted explicitly
 * via the modal's `targetContainerId` prop and the provider's auto-generated
 * `containerId` exposed through context.
 *
 * Intended for region-scoped NATIVE modality - see the "When to reach for
 * this component" guidance on `ContainedModalOverContext`. For a simple
 * overlay inside a view, a conditionally rendered absolutely-positioned
 * `View` is usually the better tool.
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
