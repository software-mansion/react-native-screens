/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import SplitBaseApp from './SplitBaseApp';
import SplitOrientation from './SplitOrientation';
import SplitPerfApp from './SplitPerfApp';
import SplitPrimaryBackgroundStyle from './SplitPrimaryBackgroundStyle';
import SplitShowColumn from './SplitShowColumn';
import {
  SplitWithNestedStack,
  SplitWithNativeStackBase,
  SplitWithNativeStackContainedModal,
  SplitWithNativeStackGestures,
  SplitWithNativeStackHeader,
  SplitWithNativeStackSearchBar,
  SplitWithNativeStackHeaderStyles,
  SplitWithNativeStackModal,
  SplitWithNativeStackPresentation,
  SplitWithNativeStackSheet
} from './SplitWithNativeStack';
import { SplitBaseConfig } from './helpers/types';

const App = () => {
  const splitBaseConfig: SplitBaseConfig = {
    preferredDisplayMode: 'twoBesideSecondary',
    preferredSplitBehavior: 'tile',
  };

  return (
    <SplitBaseApp splitBaseConfig={splitBaseConfig} />
  );
}

export default App;
