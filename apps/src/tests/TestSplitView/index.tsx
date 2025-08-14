import React from 'react';

import SplitViewBaseApp from './SplitViewBaseApp';
import SplitViewOrientation from './SplitViewOrientation';
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
