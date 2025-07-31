import React from 'react';
import { StackContainer } from '../../shared/gamma/containers/stack/StackContainer';
import { generateStackWithNames } from './helper';


const config = generateStackWithNames([
  {
    name: 'A',
    options: {
      navigationBar: {
        title: 'Screen A',
      },
    },
  },
  {
    name: 'B',
    options: {
      navigationBar: {
        title: 'Screen B',
      },
    },
  },
  {
    name: 'C',
    options: {
      navigationBar: {
        title: 'Screen C',
      },
    },
  },
]);

export default function App() {
  return (
    <StackContainer pathConfigs={config} />
  );
}

// import { generateStackWithNames } from './helper';
// import { StackContainer } from './StackContainer';

// export default function App() {
//   return (
//     <StackContainer config={generateStackWithNames(['A', 'B', 'C'])}/>
//   );
// }
