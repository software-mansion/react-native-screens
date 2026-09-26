import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
  type PlatformIconIOS,
} from 'react-native-screens';

export default function Test4672() {
  const [depth, setDepth] = useState(0);
  const [synchronous, setSynchronous] = useState(false);
  const icon: PlatformIconIOS = {
    type: 'templateSource',
    templateSource: require('@assets/search_black.png'),
    preferredLoadingMode: synchronous ? 'synchronous' : 'automatic',
  };

  return (
    <ScreenStack style={{ flex: 1 }}>
      {Array.from({ length: depth + 1 }, (_, index) => (
        <Screen
          key={index}
          isNativeStack
          onDismissed={() =>
            setDepth(current => Math.max(0, Math.min(current, index - 1)))
          }>
          <ScreenStackHeaderConfig
            title={`Local PNG ${index}`}
            hideBackButton
            headerLeftBarButtonItems={
              index > 0
                ? [
                    {
                      type: 'button',
                      title: 'Back',
                      onPress: () => setDepth(index - 1),
                    },
                  ]
                : []
            }
            headerRightBarButtonItems={[
              {
                type: 'button',
                title: 'Push',
                icon,
                onPress: () => setDepth(index + 1),
              },
            ]}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: 24,
              backgroundColor: 'white',
            }}>
            <Text>
              Legacy iOS header: {synchronous ? 'synchronous' : 'automatic'}
            </Text>
            <Text>
              Use Release to load bundled PNGs. Push and pop to inspect icon and
              glass layout during transitions.
            </Text>
            <Button
              title="Toggle loading preference"
              onPress={() => setSynchronous(value => !value)}
            />
            <Button title="Push screen" onPress={() => setDepth(index + 1)} />
          </View>
        </Screen>
      ))}
    </ScreenStack>
  );
}
