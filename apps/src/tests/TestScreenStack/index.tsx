import React from 'react';

import { generateStackWithNames } from './helper';
import { StackContainer } from '../../shared/gamma/containers/stack/StackContainer';

export default function App() {
  return (
    <StackContainer pathConfigs={generateStackWithNames(['A', 'B', 'C'])} />
  );
}

// import { generateStackWithNames } from './helper';
// import { StackContainer } from './StackContainer';

// export default function App() {
//   return (
//     <StackContainer config={generateStackWithNames(['A', 'B', 'C'])}/>
//   );
// }
