import React from 'react';

import { generateStackWithNames } from './helper';
import { StackContainer } from './StackContainer';

export default function App() {
  return (
    <StackContainer pathConfigs={generateStackWithNames(['A', 'B', 'C'])} />
  );
}
