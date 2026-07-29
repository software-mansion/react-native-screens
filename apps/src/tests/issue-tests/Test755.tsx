import * as React from 'react';
import { View, Text, Button } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
} from 'react-native-screens';

type ScreenKey = 'home' | 'datailWithBackTitle' | 'datailWithoutBackTitle';

export default function App() {
  const [pushedScreenKey, setPushedScreenKey] =
    React.useState<ScreenKey>('home');
  return (
    <ScreenStack style={{ flex: 1 }}>
      <Screen key="home" activityState={2} isNativeStack>
        <ScreenStackHeaderConfig title="Home" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Button
            title="Push with back title"
            onPress={() => setPushedScreenKey('datailWithBackTitle')}
          />
          <Button
            title="Push without back title"
            onPress={() => setPushedScreenKey('datailWithoutBackTitle')}
          />
        </View>
      </Screen>
      {pushedScreenKey === 'datailWithBackTitle' && (
        <Screen
          key="datailWithBackTitle"
          activityState={2}
          isNativeStack
          onDismissed={() => {
            setPushedScreenKey('home');
          }}>
          <ScreenStackHeaderConfig
            title="Detail with back title"
            backTitleVisible={true}
            backTitle="Hi"
          />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Back chevron should have title</Text>
            <Button title="Pop" onPress={() => setPushedScreenKey('home')} />
          </View>
        </Screen>
      )}
      {pushedScreenKey === 'datailWithoutBackTitle' && (
        <Screen
          key="datailWithBackTitle"
          activityState={2}
          isNativeStack
          onDismissed={() => {
            setPushedScreenKey('home');
          }}>
          <ScreenStackHeaderConfig
            title="Detail without back title"
            backTitleVisible={false}
            backTitle="Hi"
          />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Back chevron should have no title</Text>
            <Button title="Pop" onPress={() => setPushedScreenKey('home')} />
          </View>
        </Screen>
      )}
    </ScreenStack>
  );
}
