import React, { useState } from 'react';
import {
  Button,
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import {
  type HeaderBarButtonItem,
  ScreenStack,
  ScreenStackItem,
} from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

type ForcedStyle = 'light' | 'dark';

type Route =
  | { name: 'home' }
  | { name: 'forced'; style: ForcedStyle }
  | { name: 'no-header' };

// Icon-only items are placed in the vertical bar on iPhone Duo.
const HEADER_RIGHT_BAR_BUTTON_ITEMS: HeaderBarButtonItem[] = [
  {
    type: 'button',
    icon: { type: 'sfSymbol', name: 'star' },
    accessibilityLabel: 'Star',
    onPress: () => {},
  },
  {
    type: 'button',
    icon: { type: 'sfSymbol', name: 'square.and.arrow.up' },
    accessibilityLabel: 'Share',
    onPress: () => {},
  },
];

const FORCED_STYLE_COLORS: Record<
  ForcedStyle,
  { background: string; text: string }
> = {
  light: { background: '#ffffff', text: '#000000' },
  dark: { background: '#000000', text: '#ffffff' },
};

// Keeps the content out from under the vertical bar on iPhone Duo.
function Content({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container} edges={{ left: true, right: true }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function TestStackV4HeaderExperimentalUserInterfaceStyle() {
  const [routes, setRoutes] = useState<Route[]>([{ name: 'home' }]);

  const push = (route: Route) => setRoutes(current => [...current, route]);
  const pop = () => setRoutes(current => current.slice(0, -1));

  const renderScreen = (route: Route, screenId: string) => {
    const commonProps = {
      screenId,
      style: StyleSheet.absoluteFill,
      nativeBackButtonDismissalEnabled: true,
      onDismissed: pop,
    };

    switch (route.name) {
      case 'home':
        return (
          <ScreenStackItem
            key={screenId}
            {...commonProps}
            headerConfig={{
              title: 'System style',
              headerRightBarButtonItems: HEADER_RIGHT_BAR_BUTTON_ITEMS,
            }}>
            <Content>
              <Text style={styles.systemText}>
                This screen does not override the interface style. Its header
                items follow the system appearance.
              </Text>
              <Button
                title="Push forced dark screen"
                onPress={() => push({ name: 'forced', style: 'dark' })}
              />
              <Button
                title="Push forced light screen"
                onPress={() => push({ name: 'forced', style: 'light' })}
              />
            </Content>
          </ScreenStackItem>
        );
      case 'forced': {
        const colors = FORCED_STYLE_COLORS[route.style];
        return (
          <ScreenStackItem
            key={screenId}
            {...commonProps}
            contentStyle={{ backgroundColor: colors.background }}
            headerConfig={{
              title: `Forced ${route.style}`,
              experimental_userInterfaceStyle: route.style,
              headerRightBarButtonItems: HEADER_RIGHT_BAR_BUTTON_ITEMS,
            }}>
            <Content>
              <Text style={{ color: colors.text }}>
                {`The header sets experimental_userInterfaceStyle: '${route.style}'. Its items use the ${route.style} style wherever they are shown. The keyboard keeps following the system appearance.`}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.text },
                ]}
                placeholder="Tap to show the keyboard"
                placeholderTextColor="gray"
              />
              <Button
                title="Push screen without header"
                onPress={() => push({ name: 'no-header' })}
              />
            </Content>
          </ScreenStackItem>
        );
      }
      case 'no-header':
        return (
          <ScreenStackItem
            key={screenId}
            {...commonProps}
            headerConfig={{ title: 'No header', hidden: true }}>
            <Content>
              <Text style={styles.systemText}>
                This screen hides the header and does not override the interface
                style.
              </Text>
              <Button title="Go back" onPress={pop} />
            </Content>
          </ScreenStackItem>
        );
    }
  };

  return (
    <ScreenStack style={styles.container}>
      {routes.map((route, index) =>
        renderScreen(route, `${route.name}-${index}`),
      )}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  systemText: {
    color: PlatformColor('label'),
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
});

export default createScenario(
  TestStackV4HeaderExperimentalUserInterfaceStyle,
  scenarioDescription,
);
