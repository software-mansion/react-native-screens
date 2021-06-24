import * as React from 'react';

import type { TransitionProgressContextBody } from '../types';

export default React.createContext<TransitionProgressContextBody | undefined>(
  undefined
);
