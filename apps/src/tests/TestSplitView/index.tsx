/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import SplitViewBaseApp from './SplitViewBaseApp';
import SplitViewOrientation from './SplitViewOrientation';
import SplitViewPerfApp from './SplitViewPerfApp';
import SplitViewPrimaryBackgroundStyle from './SplitViewPrimaryBackgroundStyle';
import {
  SplitViewWithNestedStack,
  SplitViewWithNativeStackBase,
  SplitViewWithNativeStackContainedModal,
  SplitViewWithNativeStackGestures,
  SplitViewWithNativeStackHeader,
  SplitViewWithNativeStackSearchBar,
  SplitViewWithNativeStackHeaderStyles,
  SplitViewWithNativeStackModal,
  SplitViewWithNativeStackPresentation,
  SplitViewWithNativeStackSheet
} from './SplitViewWithNativeStack';
import { SplitViewBaseConfig } from './helpers/types';

const App = () => {
  const splitViewBaseConfig: SplitViewBaseConfig = {
    preferredDisplayMode: 'twoBesideSecondary',
    preferredSplitBehavior: 'tile',
  }

  return (
    <SplitViewBaseApp splitViewBaseConfig={splitViewBaseConfig} />
  );
}

export default App;
