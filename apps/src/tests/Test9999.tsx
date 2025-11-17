import React from 'react';
import { Text, View } from 'react-native';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Outer />
    </View>
  );
}

function Outer() {
  return (
    // <SafeAreaView
    //   style={{ flex: 1, backgroundColor: 'orange' }}
    //   edges={{ top: false }}>
    <ScreenStack style={{ flex: 1 }}>
      <ScreenStackItem
        screenId="1"
        style={{ flex: 1, backgroundColor: 'red' }}
        headerConfig={{ title: 'Outer' }}>
        {/*<Inner />*/}
      </ScreenStackItem>
    </ScreenStack>
    // </SafeAreaView>
  );
}
