import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
  type HeaderBarButtonItem,
} from 'react-native-screens';

const LEFT_ITEMS: HeaderBarButtonItem[] = [
  {
    type: 'button',
    title: 'Settings',
    testID: 'header-left-button',
    accessibilityLabel: 'Open settings',
    onPress: () => {},
  },
];

const RIGHT_ITEMS: HeaderBarButtonItem[] = [
  {
    type: 'menu',
    title: 'Help',
    testID: 'header-right-menu',
    accessibilityLabel: 'Open help options',
    menu: {
      items: [
        {
          type: 'action',
          title: 'Contact support',
          onPress: () => {},
        },
      ],
    },
  },
];

export default function Test5188() {
  return (
    <ScreenStack style={styles.container}>
      <Screen activityState={2} isNativeStack>
        <ScreenStackHeaderConfig
          title="Header item test IDs"
          headerLeftBarButtonItems={LEFT_ITEMS}
          headerRightBarButtonItems={RIGHT_ITEMS}
        />
        <View style={styles.content} />
      </Screen>
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
