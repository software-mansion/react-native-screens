import React from 'react';
import { Text, View } from 'react-native';
import PressableWithFeedback from '../../shared/PressableWithFeedback';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';


function SharedPressable() {
  return (
    <PressableWithFeedback>
      <View style={{ height: 120 }}>
        <Text>Regular pressable</Text>
      </View>
    </PressableWithFeedback>
  );
}

function HomeOne() {
  return (
    <View style={{ height: 600, backgroundColor: 'seagreen' }}>
      <SharedPressable />
    </View>
  );
}

export function App() {
  const gesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
    })
    .enabled(true); // Change this to `false` to fix the issue.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <HomeOne />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

export default App;
