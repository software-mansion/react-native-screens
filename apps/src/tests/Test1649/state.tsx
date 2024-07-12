import * as React from 'react';
import * as jotai from 'jotai';
import { AllowedDetentsType, SheetOptions } from './types';

export const sheetInitialOptions: SheetOptions = {
  sheetAllowedDetents: [0.4, 0.6, 0.9],
  sheetLargestUndimmedDetent: 2,
  sheetGrabberVisible: false,
  sheetCornerRadius: 24,
  sheetExpandsWhenScrolledToEdge: true,
  sheetInitialDetent: 0,
}

// const sheetInitialOptions = {
//   sheetAllowedDetents:
// }

/// Sheet options
// const allowedDetentsAtom = jotai.atom<AllowedDetentsType>([
//   0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
// ]);
// const largestUndimmedDetentAtom = jotai.atom<number>(3);

export const allowedDetentsAtom = jotai.atom<AllowedDetentsType>(sheetInitialOptions.sheetAllowedDetents);
// const allowedDetentsAtom = jotai.atom<AllowedDetentsType>([0.6]);
// const allowedDetentsAtom =
//   jotai.atom<NativeStackNavigationOptions['sheetAllowedDetents']>(
//     'fitToContents',
//   );
export const largestUndimmedDetentAtom = jotai.atom<number>(sheetInitialOptions.sheetLargestUndimmedDetent);

// const allowedDetentsAtom = jotai.atom<number[]>([0.7]);
// const largestUndimmedDetentAtom = jotai.atom<number>(-1);

export const grabberVisibleAtom = jotai.atom(sheetInitialOptions.sheetGrabberVisible);
export const cornerRadiusAtom = jotai.atom(sheetInitialOptions.sheetCornerRadius);
export const expandsWhenScrolledToEdgeAtom = jotai.atom(sheetInitialOptions.sheetExpandsWhenScrolledToEdge);

export const sheetOptionsAtom = jotai.atom(get => ({
  sheetAllowedDetents: get(allowedDetentsAtom),
  sheetLargestUndimmedDetent: get(largestUndimmedDetentAtom),
  sheetGrabberVisible: get(grabberVisibleAtom),
  sheetCornerRadius: get(cornerRadiusAtom),
  sheetExpandsWhenScrolledToEdge: get(expandsWhenScrolledToEdgeAtom),
}));

export const selectedDetentIndexAtom = jotai.atom(sheetInitialOptions.sheetInitialDetent);

export const isAdditionalContentVisibleAtom = jotai.atom(false);

