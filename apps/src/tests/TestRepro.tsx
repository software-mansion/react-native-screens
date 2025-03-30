import React from 'react';
import { Text, View } from 'react-native';
import PressableWithFeedback from '../shared/PressableWithFeedback';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GestureDetectorProvider } from 'react-native-screens/gesture-handler';
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
    <View style={{ height: 600, backgroundColor: 'orange' }}>
      <View style={{ flex: 1, backgroundColor: 'seagreen' }}>
        <SharedPressable />
      </View>
    </View>
  );
}

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetectorProvider>
        <ScreenStack>
          <Screen>
            <HomeOne />
          </Screen>
        </ScreenStack>
      </GestureDetectorProvider>
    </GestureHandlerRootView>
  );
}

export default App;
