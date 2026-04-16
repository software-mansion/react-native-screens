import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
} from '@apps/shared/gamma/containers/tabs';
import React from 'react';
import { Button, View, Text, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@apps/shared';

export function LightRootScreen({ onPush }: { onPush: () => void }) {
  return (
    <View style={{ flex: 1}}>
      <ScrollView style={{ padding: 40, backgroundColor: 'white' }}>
        <View>
          <Text style={styles.sectionHeader}>
            experimental_userInterfaceStyle
          </Text>
          <ThemedText>
            Enable system dark mode and observe the tab bar and back
            button on the pushed screen.
          </ThemedText>
          <Button
            title="Push screen with style: light"
            onPress={onPush}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function LightStyleTabScreen() {
  return (
    <View style={styles.centeredLightScreen}>
      <ThemedText>experimental_userInterfaceStyle: light</ThemedText>
      <ThemedText style={{ textAlign: 'center' }}>
        This screen forces light interface style regardless of system setting.
        Observe the tab bar and navigation bar appearance.
      </ThemedText>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: LightStyleTabScreen,
    options: {
      title: 'Tab1',
      ios: {
        icon: { type: 'sfSymbol', name: 'house' },
        experimental_userInterfaceStyle: 'light',
      },
      style: {
        backgroundColor: 'white'
      }
    },
  },
  {
    name: 'Tab2',
    Component: LightStyleTabScreen,
    options: {
      title: 'Tab2',
      ios: {
        icon: { type: 'sfSymbol', name: 'star' },
        experimental_userInterfaceStyle: 'light',
      },
      style: {
        backgroundColor: 'white'
      }
    },
  },
];

export function LightInterfaceStyleScreen() {
  return (
    <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} nativeContainerStyle={{ backgroundColor: 'white' }} />
  );
}

const styles = StyleSheet.create ({
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#888',
    letterSpacing: 0.5,
    marginTop: 60,
    marginBottom: 4,
  },
  centeredLightScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
});
