import React from 'react';
import { enableFreeze } from 'react-native-screens';

import Example from './Example';

// import { TestTabsSimpleNav } from './src/tests/single-feature-tests';
// import { TestTabsInStackStableEnterTransition } from './src/tests/component-integration-tests';
// import { Test42 } from './src/tests/issue-tests';

enableFreeze(true);

export default function App() {
  return <Example />;
}

// Most gesture-based test screens already wrap themselves in the providers
// they need (e.g. Test2819, TestScreenAnimation render their own
// GestureHandlerRootView / GestureDetectorProvider) — run those directly.
//
// A few screens use react-native-gesture-handler primitives WITHOUT wrapping
// themselves, and will throw error like "GestureDetector must be used as a descendant of
// GestureHandlerRootView" unless you wrap them here. Known case: Test1153
// (uses RNGH's ScrollView). Wrap such screens like:
//
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
//
// export default function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Test1153 />
//     </GestureHandlerRootView>
//   );
// }
