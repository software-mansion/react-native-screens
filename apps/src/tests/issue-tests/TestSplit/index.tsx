import React from 'react';

import SplitBaseApp from './SplitBaseApp';
import { SplitBaseConfig } from './helpers/types';

const App = () => {
  const splitBaseConfig: SplitBaseConfig = {
    preferredDisplayMode: 'twoBesideSecondary',
    preferredSplitBehavior: 'tile',
  };

  return <SplitBaseApp splitBaseConfig={splitBaseConfig} />;
};

export default App;
