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
  SplitViewWithNativeStackSheet,
} from './SplitViewWithNativeStack';
import { SplitViewBaseConfig } from './helpers/types';
import { featureFlags } from 'react-native-screens';

featureFlags.experiment.unstable_synchronousStateUpdatesEnabled = true;

const App = () => {
  const splitViewBaseConfig: SplitViewBaseConfig = {
    preferredSplitBehavior: 'tile',
    preferredDisplayMode: 'secondaryOnly',
  };

  return <SplitViewBaseApp splitViewBaseConfig={splitViewBaseConfig} />;
};

export default App;
