import * as React from 'react';
import * as jotai from 'jotai';
import { AllowedDetentsType } from './types';

/// Sheet options
// const allowedDetentsAtom = jotai.atom<AllowedDetentsType>([
//   0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
// ]);
// const largestUndimmedDetentAtom = jotai.atom<number>(3);

export const allowedDetentsAtom = jotai.atom<AllowedDetentsType>([0.4, 0.6, 0.9]);
// const allowedDetentsAtom = jotai.atom<AllowedDetentsType>([0.6]);
// const allowedDetentsAtom =
//   jotai.atom<NativeStackNavigationOptions['sheetAllowedDetents']>(
//     'fitToContents',
//   );
export const largestUndimmedDetentAtom = jotai.atom<number>(2);

// const allowedDetentsAtom = jotai.atom<number[]>([0.7]);
// const largestUndimmedDetentAtom = jotai.atom<number>(-1);

export const grabberVisibleAtom = jotai.atom(false);
export const cornerRadiusAtom = jotai.atom(24);
export const expandsWhenScrolledToEdgeAtom = jotai.atom(true);

export const sheetOptionsAtom = jotai.atom(get => ({
  sheetAllowedDetents: get(allowedDetentsAtom),
  sheetLargestUndimmedDetent: get(largestUndimmedDetentAtom),
  sheetGrabberVisible: get(grabberVisibleAtom),
  sheetCornerRadius: get(cornerRadiusAtom),
  sheetExpandsWhenScrolledToEdge: get(expandsWhenScrolledToEdgeAtom),
}));

export const selectedDetentIndexAtom = jotai.atom(0);

export const isAdditionalContentVisibleAtom = jotai.atom(false);

