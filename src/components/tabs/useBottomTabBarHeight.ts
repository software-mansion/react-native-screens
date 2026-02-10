'use client';

import * as React from 'react';

import { BottomTabBarHeightContext } from './BottomTabBarHeightContext';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export function useBottomTabBarHeight() {
  const height = React.useContext(BottomTabBarHeightContext);

  if (height === undefined) {
    throw new Error(
      "Couldn't find the bottom tab bar height. Are you inside a screen in Native Bottom Tab Navigator?",
    );
  }

  return height;
}
