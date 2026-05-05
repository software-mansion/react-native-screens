import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
} from '@apps/shared/gamma/containers/tabs';
import React from 'react';
import { Button, View, Text, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@apps/shared';

type InterfaceStyle = 'dark' | 'light';

export function DarkRootScreen({ onPush }: { onPush: () => void }) {
  return <RootScreen style="dark" onPush={onPush} />;
}

export function LightRootScreen({ onPush }: { onPush: () => void }) {
  return <RootScreen style="light" onPush={onPush} />;
}

function RootScreen({ style, onPush }: { style: InterfaceStyle; onPush: () => void }) {
  const isDark = style === 'dark';
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 40, backgroundColor: isDark ? 'black' : 'white' }}>
        <View>
          <Text style={styles.sectionHeader}>experimental_userInterfaceStyle</Text>
          {isDark ? (
            <Text style={styles.description}>
              Enable system light mode and observe the tab bar and back button on the pushed screen.
            </Text>
          ) : (
            <ThemedText>
              Enable system dark mode and observe the tab bar and back button on the pushed screen.
            </ThemedText>
          )}
          <Button title={`Push screen with style: ${style}`} onPress={onPush} />
        </View>
      </ScrollView>
    </View>
  );
}

function ThemedTabContent({ style }: { style: InterfaceStyle }) {
  const isDark = style === 'dark';
  const label = `experimental_userInterfaceStyle: ${style}`;
  const description = `This screen forces ${style} interface style regardless of system setting. Observe the tab bar and navigation bar appearance.`;

  return (
    <View style={styles.centeredScreen}>
      {isDark ? (
        <>
          <Text style={styles.sectionHeader}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </>
      ) : (
        <>
          <ThemedText>{label}</ThemedText>
          <ThemedText style={{ textAlign: 'center' }}>{description}</ThemedText>
        </>
      )}
    </View>
  );
}

export function DarkInterfaceStyleScreen() {
  return <InterfaceStyleScreen style="dark" />;
}

export function LightInterfaceStyleScreen() {
  return <InterfaceStyleScreen style="light" />;
}

function InterfaceStyleScreen({ style }: { style: InterfaceStyle }) {
  const isDark = style === 'dark';
  const backgroundColor = isDark ? 'black' : 'white';
  const icons = ['house', 'star'] as const;

  const routeConfigs: TabRouteConfig[] = icons.map((icon, i) => ({
    name: `Tab${i + 1}`,
    Component: () => <ThemedTabContent style={style} />,
    options: {
      title: `Tab${i + 1}`,
      ios: {
        icon: { type: 'sfSymbol', name: icon },
        experimental_userInterfaceStyle: style,
      },
      style: { backgroundColor },
    },
  }));

  return (
    <TabsContainerWithHostConfigContext
      routeConfigs={routeConfigs}
      nativeContainerStyle={{ backgroundColor }}
    />
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#888',
    letterSpacing: 0.5,
    marginTop: 60,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
  },
  centeredScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
});
