import * as React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// import { SafeAreaView } from 'react-native-screens/experimental';
// import { Screen } from 'react-native-screens';
// import { SafeAreaView } from 'react-native-safe-area-context';
export default function App() {
  return (
    // <SafeAreaProvider>
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'blue' }}
      edges={['top', 'bottom']}>
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Hello
        </Text>
      </View>
    </SafeAreaView>
    // </SafeAreaProvider>
    // <Screen activityState={2} style={{ flex: 1 }}>
    //   <SafeAreaView
    //     style={{ flex: 1, backgroundColor: 'blue' }}
    //     edges={{ top: true, bottom: true }}>
    //     <View style={{ flex: 1, backgroundColor: 'red' }}>
    //       <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
    //         Hello
    //       </Text>
    //     </View>
    //   </SafeAreaView>
    // </Screen>
  );
}
