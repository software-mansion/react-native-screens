import * as React from 'react';
import { Alert, Text, View } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
  type HeaderBarButtonItem,
} from 'react-native-screens';

const headerRightBarButtonItems: HeaderBarButtonItem[] = [
  {
    type: 'menu',
    title: 'Menu',
    menu: {
      title: 'Context menu',
      items: [
        {
          type: 'submenu',
          title: 'Submenu with subtitle',
          subtitle: 'Submenu subtitle',
          icon: { type: 'sfSymbol', name: 'folder' },
          items: [
            {
              type: 'submenu',
              title: 'Nested submenu with subtitle',
              subtitle: 'Nested submenu subtitle',
              items: [
                {
                  type: 'action',
                  title: 'Deeply nested action',
                  onPress: () => Alert.alert('Deeply nested action pressed'),
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

export default function App() {
  return (
    <ScreenStack style={{ flex: 1 }}>
      <Screen key="home" activityState={2} isNativeStack>
        <ScreenStackHeaderConfig
          title="Menu subtitles"
          headerRightBarButtonItems={headerRightBarButtonItems}
        />
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
          <Text>
            iOS only. Tap the "Menu" button in the header and verify that:
          </Text>
          <Text>
            1. "Submenu with subtitle" shows its subtitle below the label.
          </Text>
          <Text>
            2. Inside the submenu, the nested submenu shows a subtitle as well.
          </Text>
        </View>
      </Screen>
    </ScreenStack>
  );
}
