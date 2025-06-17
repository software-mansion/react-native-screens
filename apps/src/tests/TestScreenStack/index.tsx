import React from 'react';


// Alternative way to define stack

// import { Button } from 'react-native';
// import { ScreenLayout } from './ScreenLayout';
// import { StackContainer, StackContainerPath, useStackNavigation } from './StackContainer';

// const TestComponent = () => {
//    const navigation = useStackNavigation();

//    return (
//       <ScreenLayout>
//          <Button onPress={() => navigation.push('A')} title="Push A" />
//          <Button onPress={() => navigation.push('B')} title="Push B" />
//       </ScreenLayout>
//    );
// };

// export default function App() {
//    return (
//       <StackContainer>
//          <StackContainerPath name="A" component={TestComponent} />
//          <StackContainerPath name="B" component={TestComponent} />
//       </StackContainer>
//   );
// }

import { generateStackWithNames } from './helper';
import { StackContainer } from './StackContainer';

export default function App() {
  return (
    <StackContainer config={generateStackWithNames(['A', 'B', 'C'])}/>
  );
}
