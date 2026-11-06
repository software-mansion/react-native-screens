import React from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import {
  ScreenStack,
  ScreenStackHeaderRightView,
  ScreenStackItem,
  type HeaderMode,
  type ScreenStackHeaderConfigProps,
} from 'react-native-screens';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

const ROUTE_NAMES = ['Home', 'First', 'Second'] as const;
type RouteName = (typeof ROUTE_NAMES)[number];

const HEADER_MODES: HeaderMode[] = ['float', 'screen'];

const ROUTE_COLORS: Record<RouteName, string> = {
  Home: Colors.YellowLight40,
  First: Colors.GreenLight40,
  Second: Colors.BlueLight40,
};

interface RouteConfig {
  headerMode: HeaderMode;
  hidden: boolean;
}

type Config = Record<RouteName, RouteConfig>;

const INITIAL_CONFIG: Config = {
  Home: { headerMode: 'float', hidden: false },
  First: { headerMode: 'screen', hidden: false },
  Second: { headerMode: 'screen', hidden: false },
};

function TestStackV4HeaderMode() {
  const [config, setConfig] = React.useState(INITIAL_CONFIG);
  const [stack, setStack] = React.useState<RouteName[]>(['Home']);
  const [rightItemPressCount, setRightItemPressCount] = React.useState<
    Record<RouteName, number>
  >({ Home: 0, First: 0, Second: 0 });
  const [headerHeights, setHeaderHeights] = React.useState<
    Record<RouteName, number>
  >({ Home: 0, First: 0, Second: 0 });

  const updateRoute = (name: RouteName, patch: Partial<RouteConfig>) =>
    setConfig(prev => ({ ...prev, [name]: { ...prev[name], ...patch } }));

  const push = (name: RouteName) => setStack(prev => [...prev, name]);
  const removeRoute = (name: RouteName) =>
    setStack(prev => prev.filter(routeName => routeName !== name));

  const buildHeaderConfig = (
    routeName: RouteName,
  ): ScreenStackHeaderConfigProps => ({
    title: `${routeName} (${config[routeName].headerMode})`,
    headerMode: config[routeName].headerMode,
    hidden: config[routeName].hidden,
    children: (
      <ScreenStackHeaderRightView>
        <Pressable
          testID={`${routeName}-header-right`}
          style={styles.headerRight}
          onPress={() =>
            setRightItemPressCount(prev => ({
              ...prev,
              [routeName]: prev[routeName] + 1,
            }))
          }>
          <Text style={styles.headerRightText}>Tap</Text>
        </Pressable>
      </ScreenStackHeaderRightView>
    ),
  });

  return (
    <ScreenStack style={styles.container}>
      {stack.map(routeName => {
        const nextRouteName =
          ROUTE_NAMES[ROUTE_NAMES.indexOf(routeName) + 1] ?? undefined;
        return (
          <ScreenStackItem
            key={routeName}
            screenId={routeName}
            style={StyleSheet.absoluteFill}
            headerConfig={buildHeaderConfig(routeName)}
            onDismissed={() => removeRoute(routeName)}
            onHeaderHeightChange={event => {
              const { headerHeight } = event.nativeEvent;
              setHeaderHeights(prev => ({
                ...prev,
                [routeName]: Math.round(headerHeight),
              }));
            }}>
            <ScrollView
              style={{ backgroundColor: ROUTE_COLORS[routeName] }}
              contentContainerStyle={styles.content}>
              <Text testID={`${routeName}-content-top`} style={styles.marker}>
                Top of {routeName} content
              </Text>
              <Text testID={`${routeName}-header-right-press-count`}>
                header right item pressed: {rightItemPressCount[routeName]}
              </Text>
              <Text testID={`${routeName}-header-height`}>
                onHeaderHeightChange: {headerHeights[routeName]}
              </Text>
              {nextRouteName !== undefined && (
                <Button
                  testID={`${routeName}-push`}
                  title={`Push ${nextRouteName}`}
                  onPress={() => push(nextRouteName)}
                />
              )}
              {routeName !== 'Home' && (
                <Button
                  testID={`${routeName}-pop`}
                  title="Pop"
                  onPress={() => removeRoute(routeName)}
                />
              )}
              {ROUTE_NAMES.map(name => (
                <React.Fragment key={name}>
                  <Text style={styles.heading}>
                    {name === routeName ? `${name} (current)` : name}
                  </Text>
                  <SettingsPicker<HeaderMode>
                    testID={`${routeName}-${name}-header-mode`}
                    label="headerMode"
                    value={config[name].headerMode}
                    onValueChange={headerMode =>
                      updateRoute(name, { headerMode })
                    }
                    items={HEADER_MODES}
                  />
                  <SettingsSwitch
                    label="hidden"
                    value={config[name].hidden}
                    onValueChange={hidden => updateRoute(name, { hidden })}
                  />
                </React.Fragment>
              ))}
              {Array.from({ length: 20 }, (_, index) => (
                <Text key={index} style={styles.filler}>
                  {routeName} filler row {index + 1}
                </Text>
              ))}
            </ScrollView>
          </ScreenStackItem>
        );
      })}
    </ScreenStack>
  );
}

export default createScenario(TestStackV4HeaderMode, scenarioDescription);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  marker: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  heading: {
    fontWeight: '600',
    marginTop: 8,
  },
  headerRight: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.PurpleLight40,
  },
  headerRightText: {
    fontWeight: '600',
  },
  filler: {
    paddingVertical: 8,
  },
});
