import * as React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';
export default function App() {
  return (
    // SafeAreaView applies insets as margin (not padding), so backgroundColor
    // does not paint into the system safe-area — the parent shows through there.
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'blue' }}
      edges={{ top: true, bottom: true }}>
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Hello
        </Text>
      </View>
    </SafeAreaView>
  );
}
