import * as React from 'react';
import { View, Text, Button } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
} from 'react-native-screens';

type ScreenKey = 'home' | 'detailWithBackTitle' | 'detailWithoutBackTitle';

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
            onPress={() => setPushedScreenKey('detailWithBackTitle')}
          />
          <Button
            title="Push without back title"
            onPress={() => setPushedScreenKey('detailWithoutBackTitle')}
          />
        </View>
      </Screen>
      {(pushedScreenKey === 'detailWithBackTitle' ||
        pushedScreenKey === 'detailWithoutBackTitle') && (
        <Screen
          key={pushedScreenKey}
          activityState={2}
          isNativeStack
          onDismissed={() => {
            setPushedScreenKey('home');
          }}>
          <ScreenStackHeaderConfig
            title={
              pushedScreenKey === 'detailWithBackTitle'
                ? 'Detail with back title'
                : 'Detail without back title'
            }
            backTitleVisible={pushedScreenKey === 'detailWithBackTitle'}
            backTitle="Hi"
          />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>
              Back chevron should have{' '}
              {pushedScreenKey === 'detailWithBackTitle' ? 'title' : 'no title'}
            </Text>
            <Button title="Pop" onPress={() => setPushedScreenKey('home')} />
          </View>
        </Screen>
      )}
    </ScreenStack>
  );
}
