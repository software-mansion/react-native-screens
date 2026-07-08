import * as jotai from 'jotai';
import { AllowedDetentsType, SheetOptions } from './types';

export const sheetInitialOptions = {
  sheetAllowedDetents: [0.4, 0.6, 0.9],
  // sheetAllowedDetents: [0.6],
  // sheetAllowedDetents: 'fitToContents',
  sheetLargestUndimmedDetentIndex: 'none',
  sheetGrabberVisible: false,
  sheetCornerRadius: 24,
  sheetExpandsWhenScrolledToEdge: true,
  sheetInitialDetentIndex: 0,
} satisfies SheetOptions;

export const allowedDetentsAtom = jotai.atom<AllowedDetentsType>(
  sheetInitialOptions.sheetAllowedDetents,
);
export const largestUndimmedDetentAtom = jotai.atom<
  NonNullable<SheetOptions['sheetLargestUndimmedDetentIndex']>
>(
  sheetInitialOptions.sheetLargestUndimmedDetentIndex,
);
export const grabberVisibleAtom = jotai.atom<boolean>(
  sheetInitialOptions.sheetGrabberVisible,
);
export const cornerRadiusAtom = jotai.atom<number>(
  sheetInitialOptions.sheetCornerRadius,
);
export const expandsWhenScrolledToEdgeAtom = jotai.atom<boolean>(
  sheetInitialOptions.sheetExpandsWhenScrolledToEdge,
);

export const sheetOptionsAtom = jotai.atom(get => ({
  sheetAllowedDetents: get(allowedDetentsAtom),
  sheetLargestUndimmedDetentIndex: get(largestUndimmedDetentAtom),
  sheetGrabberVisible: get(grabberVisibleAtom),
  sheetCornerRadius: get(cornerRadiusAtom),
  sheetExpandsWhenScrolledToEdge: get(expandsWhenScrolledToEdgeAtom),
}));

export const selectedDetentIndexAtom = jotai.atom<number>(
  sheetInitialOptions.sheetInitialDetentIndex,
);

export const isAdditionalContentVisibleAtom = jotai.atom(false);
