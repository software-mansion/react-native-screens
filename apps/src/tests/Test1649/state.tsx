import * as React from 'react';
import * as jotai from 'jotai';
import { AllowedDetentsType, SheetOptions } from './types';

export const sheetInitialOptions: SheetOptions = {
  sheetAllowedDetents: [0.4, 0.6, 0.9],
  // sheetAllowedDetents: [0.6],
  // sheetAllowedDetents: 'fitToContents',
  sheetLargestUndimmedDetent: 'none',
  sheetGrabberVisible: false,
  sheetCornerRadius: 24,
  sheetExpandsWhenScrolledToEdge: true,
  sheetInitialDetent: 0,
}

export const allowedDetentsAtom = jotai.atom<AllowedDetentsType>(sheetInitialOptions.sheetAllowedDetents);
export const largestUndimmedDetentAtom = jotai.atom<number>(sheetInitialOptions.sheetLargestUndimmedDetent);
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

