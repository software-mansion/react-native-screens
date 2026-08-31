import React, { useState } from 'react';
import { Button, RefreshControl, ScrollView, View } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
} from 'react-native-screens';

export default function App() {
  const [showRefresh, setShowRefresh] = useState(false);
  const pop = () => setShowRefresh(false);

  return (
    <ScreenStack style={{ flex: 1 }}>
      <Screen key="home" activityState={2} isNativeStack>
        <ScreenStackHeaderConfig title="Home" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Button
            title="Push refresh screen"
            onPress={() => setShowRefresh(true)}
          />
        </View>
      </Screen>
      {showRefresh && (
        <Screen key="refresh" activityState={2} isNativeStack onDismissed={pop}>
          <ScreenStackHeaderConfig title="Infinite refresh" />
          <ScrollView
            refreshControl={<RefreshControl refreshing onRefresh={() => {}} />}>
            <Button title="Go back" onPress={pop} />
          </ScrollView>
        </Screen>
      )}
    </ScreenStack>
  );
}
