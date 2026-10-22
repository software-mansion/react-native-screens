import { createContext } from 'react';

export interface ContainedModalContextValue {
  /**
   * The `containerId` of the nearest `ContainedModalProvider` in the React tree.
   */
  containerId: string;
}

/**
 * Internal context pairing contained modals with their nearest provider.
 * `ContainedModalProvider` supplies the value; the modal components consume it
 * to resolve their presentation target when `targetContainerId` is not set.
 */
export const ContainedModalContext =
  createContext<ContainedModalContextValue | null>(null);
