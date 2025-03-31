import React from 'react';
import { Text, View } from 'react-native';
import PressableWithFeedback from '../shared/PressableWithFeedback';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Screen, ScreenStack } from 'react-native-screens';


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
    });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Screen>
          <HomeOne />
        </Screen>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

export default App;
