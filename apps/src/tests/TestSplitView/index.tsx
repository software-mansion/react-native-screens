import React from 'react';

import SplitViewBaseApp from './SplitViewBaseApp';
import {
  SplitViewWithNestedStack,
  SplitViewWithNativeStackBase,
  SplitViewWithNativeStackContainedModal,
  SplitViewWithNativeStackHeader,
  SplitViewWithNativeStackModal,
  SplitViewWithNativeStackPresentation
} from './SplitViewWithNativeStack';
import { SplitViewBaseConfig } from './helpers/types';

const App = () => {
  const splitViewBaseConfig: SplitViewBaseConfig = {
    preferredDisplayMode: 'oneOverSecondary',
    preferredSplitBehavior: 'overlay',
  }

  return (
    <SplitViewBaseApp splitViewBaseConfig={splitViewBaseConfig} />
  );
}

export default App;
