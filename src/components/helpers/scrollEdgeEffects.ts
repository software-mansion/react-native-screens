import type { ScrollEdgeEffect } from '../shared/types';

export type ScrollEdgeEffects = {
  bottom?: ScrollEdgeEffect | undefined;
  left?: ScrollEdgeEffect | undefined;
  right?: ScrollEdgeEffect | undefined;
  top?: ScrollEdgeEffect | undefined;
};

export function hasExplicitScrollEdgeEffects(
  scrollEdgeEffects: ScrollEdgeEffects | undefined,
): boolean {
  return (
    scrollEdgeEffects !== undefined &&
    (scrollEdgeEffects.bottom !== undefined ||
      scrollEdgeEffects.left !== undefined ||
      scrollEdgeEffects.right !== undefined ||
      scrollEdgeEffects.top !== undefined)
  );
}
